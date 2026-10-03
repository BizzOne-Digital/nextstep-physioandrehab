/**
 * Seeds MongoDB with the content migrated from nextstepphysioandrehab.com.
 *
 *   npm run seed            # fill empty collections only (safe to re-run)
 *   npm run seed -- --force # reset content collections to the defaults
 *
 * Submissions, uploaded images and admin accounts are never deleted.
 */
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { seedDatabase } from "@/lib/seed";

loadEnvConfig(process.cwd());

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
  }
  const force = process.argv.includes("--force");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`Connected. Seeding${force ? " (force reset)" : ""}…`);
  const result = await seedDatabase({ force });
  console.table(result);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
