import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../db";
import { HttpError } from "../utils/errors";

const sessionSelect = {
  id: true,
  email: true,
  role: true,
  employeeId: true,
  mustChangePassword: true,
  employee: { select: { name: true, surname: true } },
} as const;

interface SessionRow {
  id: number;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  employeeId: number | null;
  mustChangePassword: boolean;
  employee: { name: string; surname: string } | null;
}

// What the frontend is told about the signed-in person
function toSessionUser(u: SessionRow) {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    employeeId: u.employeeId,
    mustChangePassword: u.mustChangePassword,
    name: u.employee ? `${u.employee.name} ${u.employee.surname}` : null,
  };
}

function signToken(id: number, email: string) {
  return jwt.sign({ email }, env.jwtSecret, { subject: String(id), expiresIn: "8h" });
}

export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "An account with this email already exists");

  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { ...sessionSelect, passwordHash: true },
  });
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !valid) throw new HttpError(401, "Incorrect email or password");

  return { token: signToken(user.id, user.email), user: toSessionUser(user) };
}

// An employee creates their own login. The email must already belong to an
// employee record, and each employee can only have one login.
export async function signUpEmployee(email: string, password: string) {
  const employee = await prisma.employee.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true },
  });
  if (!employee) {
    throw new HttpError(
      400,
      "We could not find an employee with this email. Use your work email, or ask your administrator to add you."
    );
  }

  const taken = await prisma.user.findFirst({
    where: { OR: [{ employeeId: employee.id }, { email: employee.email }] },
    select: { id: true },
  });
  if (taken) throw new HttpError(409, "An account already exists for this email. Sign in instead.");

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await prisma.user.create({
      data: { email: employee.email, passwordHash, role: "EMPLOYEE", employeeId: employee.id },
      select: sessionSelect,
    });
    return { token: signToken(user.id, user.email), user: toSessionUser(user) };
  } catch (err) {
    // Two sign-ups at the same moment: the database's unique rule rejects the second
    if ((err as { code?: string }).code === "P2002") {
      throw new HttpError(409, "An account already exists for this email. Sign in instead.");
    }
    throw err;
  }
}

export async function getSessionUser(id: number) {
  const user = await prisma.user.findUnique({ where: { id }, select: sessionSelect });
  if (!user) throw new HttpError(401, "This account no longer exists");
  return toSessionUser(user);
}

export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  const valid = user ? await bcrypt.compare(currentPassword, user.passwordHash) : false;
  if (!user || !valid) throw new HttpError(400, "Current password is incorrect");
  if (currentPassword === newPassword) {
    throw new HttpError(400, "Choose a different password from the current one");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, mustChangePassword: false },
    select: sessionSelect,
  });
  return toSessionUser(updated);
}