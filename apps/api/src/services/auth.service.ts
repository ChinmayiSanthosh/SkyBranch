import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../db";
import { HttpError } from "../utils/errors";

export async function registerUser(email: string, password: string){
    const existing = await prisma.user.findUnique({where: {email} });
    if(existing) throw new HttpError(409, "An account with this email already exists");
    const passwordHash = await bcrypt.hash(password,12);
    return prisma.user.create({
        data: {email,passwordHash},
        select: {id:true, email:true, createdAt: true},
    });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !valid) throw new HttpError(401, "Invalid email or password");

  const token = jwt.sign({ email: user.email }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: "8h",
  });
  return { token, user: { id: user.id, email: user.email } };
}