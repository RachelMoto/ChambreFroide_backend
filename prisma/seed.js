import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminExiste =
    await prisma.user.findFirst({
      where: {
      OR: [
        { username: "admin" },
        { email: "contact@corefgroupinternational.com" },
      ],
    },
    });

  if (adminExiste) {

  await prisma.user.update({
    where: {
      username: "admin",
    },
    data: {
      email: "contact@corefgroupinternational.com",
    },
  });

  console.log("✅ Email du Super Admin mis à jour");

} else {

  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      nom: "Super Admin",
      username: "admin",
      email: "contact@corefgroupinternational.com",
      password: passwordHash,
      role: "SUPER_ADMIN",
      mustChangePassword: true,
    },
  });

  console.log("✅ Super Admin créé");

}
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });