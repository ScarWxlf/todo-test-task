"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createList } from "@/server/db";
import { toast } from "react-toastify";

export default function CreateList({email, refreshLists}: {email: string, refreshLists: () => void}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);

    try {
      await createList(title, email)
      refreshLists();
      setTitle("");
      toast.success("List created successfully");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input 
        placeholder="New List Name" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <Button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Add List"}
      </Button>
    </div>
  );
}
