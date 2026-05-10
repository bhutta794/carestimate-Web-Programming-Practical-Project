import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/priceCalculator";

export async function POST(req: Request) {
  const { brand, model, year, mileage, inspectionRating } = await req.json();
  const result = calculatePrice({ brand, model, year, mileage, inspectionRating });
  return NextResponse.json(result);
}