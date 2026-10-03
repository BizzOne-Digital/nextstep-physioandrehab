/**
 * Generates a bcrypt hash for ADMIN_PASSWORD_HASH.
 *
 *   npm run hash-password -- "your-strong-password"
 */
import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];
  if (!password || password.length < 10) {
    console.error('Usage: npm run hash-password -- "a-strong-password" (at least 10 characters)');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  console.log("\nADMIN_PASSWORD_HASH for Vercel / hosting dashboards (paste as-is):\n");
  console.log(hash);
  console.log("\nFor .env.local, escape each $ so Next.js does not expand it:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, "\\$")}\n`);
}

void main();
