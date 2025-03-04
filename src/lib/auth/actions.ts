"use server";

import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "@/server/db";

export async function registerUser({ name, email, password }: { name: string; email: string; password: string }) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
      return {message: 'Email already exists'}
  }
  const solid = 10;
  const hashedPassword = await bcrypt.hash(password, solid);
  await createUser( name, email, hashedPassword );
}