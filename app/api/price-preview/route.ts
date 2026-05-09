import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/priceCalculator";

export async function POST(req: Request) {
  try {
    const { brand, year, mileage, inspectionRating } = await req.json();

    const result = calculatePrice({
      brand,
      year: Number(year),
      mileage: Number(mileage),
      inspectionRating: Number(inspectionRating),
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to calculate price" },
      { status: 500 }
    );
  }
}