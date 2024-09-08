import { PrismaClient } from "@prisma/client";
import { CreateTodoFn, TodoCreationForm } from "../components/TodoCreationForm";
import cuid from "cuid";
import { revalidatePath } from "next/cache";
import { Suspense, use } from "react";
import { sleep } from "../util/sleep";
import { ErrorBoundary } from "react-error-boundary";
import { cookies } from "next/headers";
import { Redirect } from "../components/Redirect";

export default async function Page() {
  const createTodo: CreateTodoFn = async ({ name }: { name: string }) => {
    "use server";

    const prismaClient = new PrismaClient();
    try {
      await prismaClient.$connect();

      await prismaClient.todo.create({
        data: {
          id: cuid(),
          name,
        }
      });

      revalidatePath("/");

      return {
        type: "success",
      };
    } catch (error) {
      console.error(error);

      return {
        type: "error",
      };
    } finally {
      await prismaClient.$disconnect();
    }
  };

  const prismaClient = new PrismaClient();
  try {
    const cookie = cookies();
    const loginId = cookie.get("login-id")?.value;

    if (!loginId) {
      return (
        <Suspense fallback={<span>...redirecting</span>}>
          <Redirect url="/login"></Redirect>
        </Suspense>
      );
    }

    await prismaClient.$connect();

    const now = new Date();
    const logins = await prismaClient.login.findMany({
      where: {
        id: loginId,
        expiredAt: {
          gt: now,
        },
      },
    });

    if (logins.length === 0) {
      return (
        <Suspense fallback={<span>...redirecting</span>}>
          <Redirect url="/login"></Redirect>
        </Suspense>
      );
    }
  } catch (error) {
    return <div>システムエラーです</div>;
  } finally {
    await prismaClient.$disconnect();
  }

  return (
    <div>
      <TodoCreationForm createTodo={createTodo}></TodoCreationForm>
      <ErrorBoundary fallback={<div>システムエラーです</div>}>
        <Suspense fallback={<div>...loading</div>}>
          <TodoList></TodoList>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function TodoList() {
  const todos = use(getTodos());
  return (
    <ul>
      {
        todos.map((x) => (
          <li key={x.id}>{x.name}</li>
        ))
      }
    </ul>
  );
}

async function getTodos() {
  const prismaClient = new PrismaClient();
  try {
    await prismaClient.$connect();

    await sleep(2000);

    const todos = await prismaClient.todo.findMany();

    return todos;
  } catch (error) {
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
}
