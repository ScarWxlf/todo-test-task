"use client";
import { getLists } from "@/server/db";
import { useState, useEffect } from "react";
import ListCard from "./ListCard";
import CreateList from "./CreateList";
import type { List } from "@/lib/types";

export default function List({ email }: { email: string }) {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    async function fetchedLists () {
      const lists = await getLists(email);
      setLists(lists);
    }
    fetchedLists();
  }, [email]);

  const refreshLists = async () => {
    const updatedLists = await getLists(email);
    setLists(updatedLists);
  };

  return (
    <>
    <CreateList email={email} refreshLists={refreshLists}/>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} refreshLists={refreshLists}/>
      ))}
    </div>
    </>
  );
}
