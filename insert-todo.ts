import cuid from "cuid";
import { PrismaClient } from "@prisma/client";

(async () => {
  const prismaClient = new PrismaClient();

  try {
    await prismaClient.$connect();

    const todoCount = await prismaClient.todo.count();

    await prismaClient.todo.create({
      data: {
        id: cuid(),
        name: "Sample" + (todoCount + 1).toString(),
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prismaClient.$disconnect();
  }
})();
