import { PrismaClient } from "@prisma/client";

async function main() {
  const p = new PrismaClient();
  for (let i = 0; i < 3; i++) {
    const t0 = Date.now();
    try {
      await p.$queryRaw`SELECT 1`;
      console.log("Q" + (i + 1) + " OK ms=" + (Date.now() - t0));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log("Q" + (i + 1) + " ERR ms=" + (Date.now() - t0) + " :: " + msg.slice(0, 220).replace(/\n/g, " "));
    }
  }
  const t1 = Date.now();
  try {
    await p.homepageContent.findFirst();
    console.log("TABLE OK ms=" + (Date.now() - t1));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log("TABLE ERR ms=" + (Date.now() - t1) + " :: " + msg.slice(0, 220).replace(/\n/g, " "));
  }
  await p.$disconnect();
}
main();
