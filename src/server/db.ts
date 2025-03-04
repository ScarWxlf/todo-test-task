"use server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

//user
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return await prisma.user.create({ data: { name, email, password } });
};

export const isUserAdmin = async (listId: string, userEmail: string) => {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: { members: true },
  });

  if (!list) return false;

  const user = await getUserByEmail(userEmail);
  if (list.ownerId === user!.id) return true;

  const isAdmin = list.members.some(
    (member) => member.userEmail === userEmail && member.role === "ADMIN"
  );

  return isAdmin;
};

export const getMembers = async (listId: string) => {
  return await prisma.member.findMany({ where: { listId } });
};

export const addMemberToList = async (
  listId: string,
  userEmail: string,
  role: Role,
  currentUserEmail: string
) => {
  const list = await prisma.list.findUnique({
    where: { id: listId },
  });

  const userOwner = await prisma.user.findUnique({
    where: { email: currentUserEmail },
  });

  if (list!.ownerId !== userOwner!.id) {
    return {message: "Only the owner can add members"};
  }
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) return { message: "User not found" };

  return await prisma.member.create({
    data: {
      listId,
      userEmail: userEmail,
      role,
    },
  });
};

//list
export const getLists = async (email: string) => {
  const response = await prisma.user.findUnique({ where: { email } });
  return await prisma.list.findMany({
    where: {
      OR: [
        { ownerId: response!.id },
        { members: { some: { userEmail: email } } },
      ],
    },
    include: {
      members: true,
    },
  });
};

export const createList = async (title: string, email: string) => {
  const response = await prisma.user.findUnique({ where: { email } });
  return await prisma.list.create({ data: { title, ownerId: response!.id } });
};

export const updateListTitle = async (id: string, title: string) => {
  return await prisma.list.update({ where: { id }, data: { title } });
};

export const deleteList = async (id: string) => {
  return await prisma.list.delete({ where: { id } });
};
//task
export const getTasksByList = async (listId: string) => {
  return await prisma.task.findMany({ where: { listId } });
};


export const updateTask = async (taskId: string, updateData: { title?: string; done?: boolean }, userEmail: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { list: true },
  });


  const isAdminOrOwner = await isUserAdmin(task!.listId, userEmail);
  
  if (!isAdminOrOwner && Object.keys(updateData).some((key) => key !== "done")) {
    return {message: "Viewers can only mark tasks as completed"};
  }

  return await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });
};


export const addTask = async (listId: string, title: string, email: string) => {
  const isAdmin = await isUserAdmin(listId, email);
  if (!isAdmin) return { message: "Only admins can add tasks" };

  return await prisma.task.create({
    data: { listId, title, done: false },
  });
};

export const deleteTask = async (taskId: string, email: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { list: true },
  });

  const isAdmin = await isUserAdmin(task!.listId, email);
  if (!isAdmin) return { message: "Only admins can delete tasks" };

  return await prisma.task.delete({ where: { id: taskId } });
};
