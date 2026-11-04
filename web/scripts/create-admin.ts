import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { prisma } from "../lib/prisma";

loadEnvConfig(process.cwd());

class BootstrapError extends Error {}

function validateBootstrapConfiguration() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !secret || !process.env.NEXTAUTH_URL) {
    throw new BootstrapError(
      "Set DATABASE_URL, AUTH_SECRET, and NEXTAUTH_URL before bootstrapping.",
    );
  }
  if (secret.length < 32 || secret.startsWith("REPLACE_WITH_")) {
    throw new BootstrapError(
      "AUTH_SECRET must be a non-placeholder secret of at least 32 characters.",
    );
  }
  try {
    const url = new URL(databaseUrl);
    if (
      !["postgres:", "postgresql:"].includes(url.protocol) ||
      !url.hostname ||
      /placeholder|example|your[-_ ]?host/i.test(url.hostname)
    ) {
      throw new Error("invalid database URL");
    }
  } catch {
    throw new BootstrapError(
      "DATABASE_URL must be a valid PostgreSQL connection URL.",
    );
  }
  try {
    const url = new URL(process.env.NEXTAUTH_URL);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  } catch {
    throw new BootstrapError("NEXTAUTH_URL must be a valid HTTP or HTTPS URL.");
  }
}

async function askLine(prompt: string): Promise<string> {
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    return await terminal.question(prompt);
  } finally {
    terminal.close();
  }
}

function askHiddenPassword(prompt: string): Promise<string> {
  return new Promise((resolvePassword, rejectPassword) => {
    let password = "";
    const stdin = process.stdin;
    const cleanup = () => {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
    };
    const onData = (chunk: Buffer | string) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\r" || character === "\n") {
          cleanup();
          process.stdout.write("\r\n");
          resolvePassword(password);
          return;
        }
        if (character === "\u0003" || character === "\u0004") {
          cleanup();
          process.stdout.write("\r\n");
          rejectPassword(new BootstrapError("Admin setup cancelled."));
          return;
        }
        if (character === "\u007f" || character === "\b") {
          const characters = Array.from(password);
          characters.pop();
          password = characters.join("");
          continue;
        }
        if (character >= " " && character !== "\u007f") {
          password += character;
        }
      }
    };

    process.stdout.write(prompt);
    stdin.setEncoding("utf8");
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function promptAdminCredentials() {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new BootstrapError(
      "Admin setup requires an interactive Windows Command Prompt or terminal.",
    );
  }

  const email = (await askLine("Admin email: ")).trim().toLowerCase();
  const password = await askHiddenPassword("Admin password (input hidden): ");
  const name = (await askLine("Admin display name: ")).trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BootstrapError("Enter a valid admin email address.");
  }
  if (
    Array.from(password).length < 12 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw new BootstrapError(
      "Password must be at least 12 characters and no more than 72 UTF-8 bytes.",
    );
  }
  if (!name) {
    throw new BootstrapError("Enter an admin display name.");
  }
  if (name.length > 80) {
    throw new BootstrapError("Admin display name must be 80 characters or fewer.");
  }

  return { email, password, name };
}

async function ensureMigrationsApplied() {
  let migrationRows: Array<{
    migration_name: string;
    finished_at: Date | null;
    rolled_back_at: Date | null;
  }>;
  try {
    migrationRows = await prisma.$queryRaw`
      SELECT migration_name, finished_at, rolled_back_at
      FROM "_prisma_migrations"
    `;
  } catch {
    throw new BootstrapError(
      "Unable to verify Prisma migration history. Confirm PostgreSQL is available and run `npx prisma migrate deploy` first.",
    );
  }

  const completed = new Set(
    migrationRows
      .filter((row) => row.finished_at !== null && row.rolled_back_at === null)
      .map((row) => row.migration_name),
  );
  const expected = readdirSync(resolve(process.cwd(), "prisma", "migrations"), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  if (expected.some((migration) => !completed.has(migration))) {
    throw new BootstrapError(
      "Database migrations are incomplete. Run `npx prisma migrate deploy` before creating the first admin.",
    );
  }
}

/**
 * Create the first CMS administrator using interactive terminal prompts.
 * The serializable transaction prevents competing bootstraps and never
 * updates an existing account.
 */
async function main() {
  validateBootstrapConfiguration();
  await ensureMigrationsApplied();
  const { email, password, name } = await promptAdminCredentials();
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction(
    async (tx) => {
      const existing = await tx.admin.findFirst({ select: { id: true } });
      if (existing) {
        throw new BootstrapError(
          "An administrator already exists. Initial bootstrap only creates the first account.",
        );
      }

      await tx.admin.create({
        data: { email, passwordHash, name, role: "admin" },
      });
    },
    { isolationLevel: "Serializable" },
  );
  console.log("Initial administrator created successfully. Password was not logged.");
}

void main()
  .catch((error: unknown) => {
    if (error instanceof BootstrapError) {
      console.error(error.message);
    } else {
      console.error(
        "Admin bootstrap failed. Check that migrations are applied and PostgreSQL is available. No password was logged.",
      );
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
