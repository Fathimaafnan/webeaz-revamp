import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

loadEnvConfig(process.cwd());

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }
  if (!password || password.startsWith("REPLACE_WITH_")) {
    throw new Error("Set ADMIN_PASSWORD to the new password.");
  }
  if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 12 characters and no more than 72 UTF-8 bytes.",
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, role: true },
  });
  if (!admin || admin.role !== "admin") {
    throw new Error("No administrator exists with that email address.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash },
  });
  console.log("Administrator password updated successfully. Password was not logged.");
}

main()
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Password update failed. No password was logged.");
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
