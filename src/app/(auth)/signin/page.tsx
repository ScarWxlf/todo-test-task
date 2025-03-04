"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    const validation = signInSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors = validation.error.format();
      setErrors({
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (result?.error) {
      toast.error("Email or password is incorrect");
    } else {
      toast.success("Successfully signed in");
      router.push("/dashboard");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Увійти</h1>
      <form onSubmit={handleSubmit} className={cn("flex flex-col w-80", errors ? "gap-1" : "gap-4")}>
      <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors?.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <Input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors?.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        <Button type="submit">Увійти</Button>
      </form>
    </div>
  );
}
