export const CAR_BRANDS = [
  "Toyota", "Honda", "BMW", "Mercedes", "Audi", "Porsche", "Lexus",
  "Mazda", "Volkswagen", "Hyundai", "Kia", "Ford", "Chevrolet",
  "Nissan", "Dodge", "Jeep", "Subaru", "Volvo",
];

export const CURRENT_YEAR = new Date().getFullYear();

export const CAR_YEARS = Array.from(
  { length: CURRENT_YEAR - 1949 },
  (_, i) => CURRENT_YEAR - i
);

export const INSPECTION_RATINGS = [
  { value: 5, label: "⭐⭐⭐⭐⭐ - Excellent condition" },
  { value: 4, label: "⭐⭐⭐⭐ - Good condition" },
  { value: 3, label: "⭐⭐⭐ - Average condition" },
  { value: 2, label: "⭐⭐ - Below average condition" },
  { value: 1, label: "⭐ - Poor condition" },
];

export const BRAND_SCORES: Record<string, number> = {
  Porsche: 95, Mercedes: 92, BMW: 90, Audi: 88, Lexus: 87,
  Toyota: 85, Honda: 82, Mazda: 80, Volkswagen: 78, Hyundai: 75,
  Kia: 74, Ford: 72, Chevrolet: 70, Nissan: 68, Dodge: 65,
  Jeep: 64, Subaru: 76, Volvo: 83,
};
