import { BRAND_SCORES, BRAND_MODELS } from "./constants";

export function calculatePrice({
  brand,
  model,
  year,
  mileage,
  inspectionRating,
}: {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  inspectionRating: number;
}) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - Number(year);

  // Get base price from model
  const modelData = BRAND_MODELS[brand]?.find(m => m.model === model);
  const basePrice = modelData?.basePrice ?? 30000;

  // Age score (35%)
  const ageScore = age <= 0 ? 100 : age >= 15 ? 15 : 100 - (age / 15) * 85;

  // Mileage score (30%)
  const expectedMileage = age * 12000;
  const mileageRatio = expectedMileage > 0 ? Number(mileage) / expectedMileage : 1;
  const mileageScore = Math.max(0, Math.min(100, (1 - (mileageRatio - 1) * 0.5) * 100));

  // Brand score (20%)
  const brandScore = BRAND_SCORES[brand] ?? 70;

  // Inspection score (15%)
  const inspectionScore = (Number(inspectionRating) / 10) * 80 + 20;

  // Composite score
  let compositeScore =
    ageScore * 0.35 +
    mileageScore * 0.30 +
    brandScore * 0.20 +
    inspectionScore * 0.15;

  // Adjustments
  if (age > 15) compositeScore *= 0.6;
  if (Number(inspectionRating) === 10) compositeScore *= 1.08;

  // Final price based on base price
  const price = Math.round(
    Math.max(500, (compositeScore / 100) * basePrice) / 1000
  ) * 1000;

  return {
    price,
    breakdown: {
      ageScore: Math.round(ageScore),
      mileageScore: Math.round(mileageScore),
      brandScore,
      inspectionScore: Math.round(inspectionScore),
      compositeScore: Math.round(compositeScore),
      basePrice,
    },
  };
}