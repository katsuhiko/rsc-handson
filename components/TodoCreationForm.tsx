"use client"

import { useState } from "react";

export type CreateTodoFn = ({ }: { name: string })
  => Promise<{ type: "success" } | { type: "error" }>;

export function TodoCreationForm({ createTodo }: { createTodo: CreateTodoFn }) {
  const [todoName, setTodoName] = useState("");

  return (
    <>
      <input
        type="text"
        value={todoName}
        onInput={(e) => setTodoName((e.target as HTMLInputElement).value)}
      />
      <button onClick={async () => {
        const result = await createTodo({
          name: todoName,
        });

        if (result.type === "success") {
          alert("登録が完了しました");
        } else {
          alert("登録に失敗しました");
        }
      }}>追加</button>
    </>
  );
}