"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/auth/actions";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { signUpSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    const validation = signUpSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors = validation.error.format();
      setErrors({
        name: fieldErrors.name?._errors[0],
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      return;
    }
    try {
      const registerResponse = await registerUser(form)
      if(registerResponse?.message){
        toast.error(registerResponse.message)
        return
      }
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Succes registration");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(` Error "${(error as Error).message}", try again.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Реєстрація</h1>
      <form onSubmit={handleSubmit} className={cn("flex flex-col w-80", errors ? "gap-1" : "gap-4")}>
      <Input
          type="text"
          placeholder="Ім'я"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors?.name && <p className="text-red-500 text-sm">{errors.name}</p>}

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
        <Button type="submit">Зареєструватися</Button>
      </form>
    </div>
  );
}
