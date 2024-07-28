import cuid from "cuid";
import { PrismaClient } from "@prisma/client";

(async () => {
  const prismaClient = new PrismaClient();

  try {
    await prismaClient.$connect();

    await prismaClient.user.create({
      data: {
        id: cuid(),
        email: "test@example.com",
        password: "password",
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prismaClient.$disconnect();
  }
})();
