import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { calculatePrice } from "@/lib/priceCalculator";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const cars = await prisma.car.findMany({
    where: brand ? { brand } : {},
    include: { user: { select: { name: true, email: true, phoneNumber: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(cars);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

 const { brand, model, year, mileage, inspectionRating, description, imageUrl } = await req.json();
  const { price, breakdown } = calculatePrice({ brand, model, year, mileage, inspectionRating });

  const car = await prisma.car.create({
  data: {
    brand, model, year: Number(year), mileage: Number(mileage),
    inspectionRating: Number(inspectionRating), description,
    imageUrl: imageUrl || null,
    price, priceBreakdown: JSON.stringify(breakdown), userId: user.id,
  },
});
  return NextResponse.json(car, { status: 201 });
}
