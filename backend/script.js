import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "./lib/prisma.js";

async function main() {
  const args = process.argv.slice(2);
  const adminEmail = args[0] || "rajaxraj1997@gmail.com";
  const adminPassword = args[1] || "yulemkali97";
  const adminName = args[2] || "Mwitixo";

  console.log(`Checking admin account: ${adminEmail}...`);

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  if (existingAdmin) {
    console.log(`Admin ${adminEmail} already exists. Updating password...`);
    await prisma.admin.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        name: adminName,
      },
    });
    console.log(`Admin ${adminEmail} updated successfully.`);
  } else {
    console.log(`Creating new admin account: ${adminEmail}...`);
    const newAdmin = await prisma.admin.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`Admin created with ID: ${newAdmin.id}`);
  }

  console.log(`\n========================================`);
  console.log(`Admin Credentials:`);
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`========================================\n`);
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
