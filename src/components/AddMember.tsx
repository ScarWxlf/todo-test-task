"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMemberToList } from "@/server/db";
import { toast } from "react-toastify";

export default function AddMember({ listId, refreshMembers, userEmail }: { listId: string; refreshMembers: () => void, userEmail?: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "VIEWER">("VIEWER");

  const handleAddMember = async () => {
    if (!email.trim()) return;
    
    if(!userEmail){
        return;
    }
    const response = await addMemberToList(listId, email, role, userEmail);
    if ("message" in response) {
      toast.error(response.message);
      return;
    }
    refreshMembers();
    setEmail("");
  };

  return (
    <div className="flex gap-2">
      <Input placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select value={role} onChange={(e) => setRole(e.target.value as "ADMIN" | "VIEWER")}>
        <option value="VIEWER">Viewer</option>
        <option value="ADMIN">Admin</option>
      </select>
      <Button onClick={handleAddMember}>Add</Button>
    </div>
  );
}
