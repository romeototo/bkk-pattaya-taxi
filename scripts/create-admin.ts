import "dotenv/config";
import { createAdminCredential, getAdminByUsername, hashPassword } from "../server/db";

type CliOptions = {
  username?: string;
  email?: string;
  password?: string;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--username" && next) {
      options.username = next;
      i += 1;
    } else if (arg === "--email" && next) {
      options.email = next;
      i += 1;
    } else if (arg === "--password" && next) {
      options.password = next;
      i += 1;
    }
  }

  return options;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const username = args.username ?? process.env.ADMIN_USERNAME;
  const email = args.email ?? process.env.ADMIN_EMAIL;
  const password = args.password ?? process.env.ADMIN_PASSWORD;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  if (!username || username.trim().length < 3) {
    throw new Error("Admin username is required and must be at least 3 characters");
  }

  if (!email || !email.includes("@")) {
    throw new Error("Admin email is required");
  }

  if (!password || password.length < 8) {
    throw new Error("Admin password is required and must be at least 8 characters");
  }

  const existing = await getAdminByUsername(username);
  if (existing) {
    console.log(`Admin "${username}" already exists. No changes made.`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await createAdminCredential({
    username,
    email,
    passwordHash,
    isActive: "true",
  });

  console.log(`Admin "${username}" created successfully.`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
