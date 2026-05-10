import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { calculatePrice } from "@/lib/priceCalculator";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true, phoneNumber: true } } },
  });
  if (!car) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car || car.userId !== user?.id) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

 const { brand, model, year, mileage, inspectionRating, description, imageUrl } = await req.json();
  const { price, breakdown } = calculatePrice({ brand, model, year, mileage, inspectionRating });

  const updated = await prisma.car.update({
  where: { id },
  data: { 
    brand, model, year: Number(year), mileage: Number(mileage), 
    inspectionRating: Number(inspectionRating), description, 
    imageUrl: imageUrl || null,
    price, priceBreakdown: JSON.stringify(breakdown) 
  },
});
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car || car.userId !== user?.id) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  await prisma.car.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}