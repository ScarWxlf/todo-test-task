import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiDeleteOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { deleteList, updateListTitle } from "@/server/db";
import { useState } from "react";
import { Input } from "./ui/input";
import { toast } from "react-toastify";

interface List {
  title: string;
  id: string;
  ownerId: string;
};

export default function ListCard({ list, refreshLists }: { list: List, refreshLists: () => void }) {

const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleUpdateTitle = async () => {
    if (title.trim() === "" || title === list.title) {
      setIsEditing(false);
      return;
    }
    
    await updateListTitle(list.id, title);
    setIsEditing(false);
    toast.success("List title updated successfully");
  };
  return (
    <Card key={list.id} className="p-4">
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateTitle()}
            autoFocus
          />
        ) : (
          <CardTitle
            className="text-lg flex items-center gap-2"
          >
            {title}
            <button className="hover:scale-110" onClick={() => setIsEditing(true)}>
                < CiEdit size={24} />
            </button>
          </CardTitle>
        )}

        <button
          className="hover:scale-110"
          onClick={async () => {
            await deleteList(list.id);
            refreshLists();
            toast.success("List deleted successfully");
          }}
        >
          <TiDeleteOutline size={24} />
        </button>
      </CardHeader>
      <CardContent>
        <Link href={`/dashboard/${list.id}`}>
          <Button variant="outline" className="w-full">View List</Button>
        </Link>
      </CardContent>
    </Card>
  );
}