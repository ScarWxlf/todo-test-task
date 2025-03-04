'use client'
import { getMembers, getTasksByList } from "@/server/db";
import CreateTask from "@/components/CreateTask";
import TaskItem from "@/components/TaskItem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Task } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddMember from "@/components/AddMember";

export default function ListPage({ params }: { params: { listId: string } }) {
    const {data: session, status} = useSession();
    const router = useRouter();
    if( status === "unauthenticated"){
        router.push("/signin");
    }

    const [tasks, setTasks] = useState<Task[]>([]);
    const [members, setMembers] = useState<{ id: string; userEmail: string; role: string }[]>([]);

    useEffect(() => {
      async function fetchTasks() {
        const fetchedTasks = await getTasksByList(params.listId);
        setTasks(fetchedTasks);
      }
      fetchTasks();
    }, [params.listId]);
  
    const refreshTasks = async () => {
      const updatedTasks = await getTasksByList(params.listId);
      setTasks(updatedTasks);
    };

    const refreshMembers = async () => {
      const res = await getMembers(params.listId);
      setMembers(res);
    };
  
    useEffect(() => {
      refreshMembers();
    }, []);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTask listId={params.listId} refreshTasks={refreshTasks} email={session?.user?.email ?? undefined}/>
          <ul className="mt-4">
            {tasks.length > 0 ? (
              tasks.map((task) => <TaskItem key={task.id} task={task} refreshTasks={refreshTasks} email={session!.user!.email!}/>)
            ) : (
              <p>No tasks yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manage Members</CardTitle>
        </CardHeader>
        <CardContent>
          <AddMember listId={params.listId} refreshMembers={refreshMembers} userEmail={session?.user?.email ?? undefined}/>
          <ul className="mt-4">
            {members.map((member) => (
              <li key={member.id} className="flex justify-between border-b py-2">
                <span>{member.userEmail} - {member.role}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
