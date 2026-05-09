"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const BRANDS = [
  "Toyota", "Honda", "BMW", "Mercedes", "Audi", "Porsche", "Lexus",
  "Mazda", "Volkswagen", "Hyundai", "Kia", "Ford", "Chevrolet",
  "Nissan", "Dodge", "Jeep", "Subaru", "Volvo",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR - i);

const INSPECTION_RATINGS = [
  { value: 5, label: "⭐⭐⭐⭐⭐ - Excellent condition" },
  { value: 4, label: "⭐⭐⭐⭐ - Good condition" },
  { value: 3, label: "⭐⭐⭐ - Average condition" },
  { value: 2, label: "⭐⭐ - Below average condition" },
  { value: 1, label: "⭐ - Poor condition" },
];

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    brand: "Toyota",
    model: "",
    year: CURRENT_YEAR,
    mileage: "",
    inspectionRating: 3,
    description: "",
  });

  const [preview, setPreview] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Live price preview
  useEffect(() => {
    if (!form.mileage || form.mileage === "") return;

    const delay = setTimeout(() => {
      fetch("/api/price-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: form.brand,
          year: form.year,
          mileage: parseInt(form.mileage),
          inspectionRating: form.inspectionRating,
        }),
      })
        .then((res) => res.json())
        .then((data) => setPreview(data.price));
    }, 300);

    return () => clearTimeout(delay);
  }, [form.brand, form.year, form.mileage, form.inspectionRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/buy");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.message || "Failed to list car");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">List Your Car</h1>
      <p className="text-gray-500 mb-6">
        Fill in the details below. Price will be calculated automatically.
      </p>

      {/* Live Price Preview */}
      {preview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-600 mb-1">Estimated Market Value</p>
          <p className="text-3xl font-bold text-blue-700">
            ${preview.toLocaleString()}
          </p>
          <p className="text-xs text-blue-500 mt-1">
            * System-calculated based on your inputs
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Brand - Input 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand *
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
          >
            {BRANDS.map((brand) => (
              <option key={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Model - Input 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model *
          </label>
          <input
            type="text"
            placeholder="e.g., Camry, Civic, X5"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            required
          />
        </div>

        {/* Year - Input 3 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year *
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: parseInt(e.target.value) })
            }
          >
            {YEARS.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Mileage - Input 4 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mileage (miles) *
          </label>
          <input
            type="number"
            placeholder="e.g., 45000"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.mileage}
            onChange={(e) => setForm({ ...form, mileage: e.target.value })}
            min={0}
            max={500000}
            required
          />
        </div>

        {/* Inspection Rating - Input 5 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inspection Rating *
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.inspectionRating}
            onChange={(e) =>
              setForm({ ...form, inspectionRating: parseInt(e.target.value) })
            }
          >
            {INSPECTION_RATINGS.map((rating) => (
              <option key={rating.value} value={rating.value}>
                {rating.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            rows={4}
            placeholder="Describe any additional features, service history, or issues..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={1000}
          />
          <p className="text-xs text-gray-400 mt-1">
            {form.description.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Listing your car..." : "List Car for Sale"}
        </button>
      </form>

      {/* Weightage Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 text-sm">
        <h3 className="font-semibold text-gray-700 mb-2">How price is calculated:</h3>
        <div className="space-y-1 text-gray-600">
          <div className="flex justify-between">
            <span>📅 Year/Age:</span>
            <span className="font-medium">35% weightage</span>
          </div>
          <div className="flex justify-between">
            <span>📊 Mileage:</span>
            <span className="font-medium">30% weightage</span>
          </div>
          <div className="flex justify-between">
            <span>🏭 Brand Reputation:</span>
            <span className="font-medium">20% weightage</span>
          </div>
          <div className="flex justify-between">
            <span>⭐ Inspection Rating:</span>
            <span className="font-medium">15% weightage</span>
          </div>
        </div>
      </div>
    </div>
  );
}