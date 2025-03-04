'use client'
import List from "@/components/List";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default  function Dashboard() {
  const {data: session, status} = useSession();
  const router = useRouter();
  if( status === "unauthenticated"){
    router.push("/signin");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your To-Do Lists</h1>
      {session?.user && (
          <List email={session!.user!.email!} />
      )}
    </div>
  );
}
