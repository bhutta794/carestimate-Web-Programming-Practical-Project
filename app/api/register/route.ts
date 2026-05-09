import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, phoneNumber, password } = await req.json();

  if (!name || name.length < 2)
    return NextResponse.json({ message: "Name must be at least 2 characters" }, { status: 400 });

  if (!email || !email.includes("@"))
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });

  if (!phoneNumber || !/^\d{10,15}$/.test(phoneNumber))
    return NextResponse.json({ message: "Phone must be 10-15 digits" }, { status: 400 });

  if (!password || password.length < 6)
    return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ message: "Email already registered" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, phoneNumber, password: hashed } });

  return NextResponse.json({ message: "Account created" }, { status: 201 });
}
