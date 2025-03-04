"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteTask, updateTask } from "@/server/db";
import { toast } from "react-toastify";
import { Input } from "./ui/input";
import { CiEdit } from "react-icons/ci";

export default function TaskItem({ task, refreshTasks, email }: { task: { id: string; title: string; done: boolean }, refreshTasks: () => void, email: string }) {
  const [done, setDone] = useState(task.done);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const toggleDone = async () => {
    await updateTask(task.id, {done: !done}, email);
    setDone(!done);
  };

  const handleDelete = async () => {
    const response = await deleteTask(task.id, email);
    if("message" in response) {
      toast.error(response.message);
      return;
    }
    refreshTasks();
    toast.success("Task deleted successfully");
  };

  const handleUpdateTitle = async () => {
    if (title.trim() === "" || title === task.title) {
      setIsEditing(false);
      return;
    }

    const response = await updateTask(task.id, { title }, email);
    setIsEditing(false);
    if("message" in response) {
      toast.error(response.message);
      return;
    }
    refreshTasks();
    toast.success("Task title updated");
  };

  return (
    <li className="flex justify-between items-center p-2 border-b">
      <div className="flex items-center gap-2">
        <Checkbox checked={done} onClick={toggleDone} />
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
            autoFocus
            className="w-full"
          />
        ) : (
          <>
            <span className={done ? "line-through text-gray-500 cursor-pointer" : "cursor-pointer"}>
              {title}
            </span>
            <button className="hover:scale-110" onClick={() => setIsEditing(true)}>
                <CiEdit size={24} />
            </button>
          </>
        )}
      </div>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </li>
  );
}
