"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addTask } from "@/server/db";
import { toast } from "react-toastify";

export default function CreateTask({ listId, refreshTasks, email }: { listId: string, refreshTasks: () => void, email?: string }) {
  const [title, setTitle] = useState("");
  const titleInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    if (!title.trim()) return;
    setLoading(true);

    try {
      if(email){
        const response = await addTask(listId, title, email);
        if ('message' in response) {
          toast.error(response.message);
          return;
        }
        setTitle("");
        refreshTasks();
        toast.success("Task added successfully");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input ref={titleInput} placeholder="New Task" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button onClick={handleAddTask} disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </Button>
    </div>
  );
}
