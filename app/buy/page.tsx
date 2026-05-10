"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const BRANDS = ["All","Toyota","Honda","BMW","Mercedes","Audi","Porsche","Lexus","Mazda","Volkswagen","Hyundai","Kia","Ford","Chevrolet","Nissan","Dodge","Jeep","Subaru","Volvo"];

export default function BuyPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [brand, setBrand] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(brand === "All" ? "/api/cars" : `/api/cars?brand=${brand}`)
      .then(r => r.json())
      .then(d => { setCars(d); setLoading(false); });
  }, [brand]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse Cars</h1>
        <select
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={brand}
          onChange={e => setBrand(e.target.value)}>
          {BRANDS.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-500">Loading...</p>
      ) : cars.length === 0 ? (
        <p className="text-center py-20 text-gray-500">No cars listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car: any) => (
            <Link key={car.id} href={`/cars/${car.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-md transition p-5 cursor-pointer">
                <h2 className="text-xl font-bold text-gray-800">
                  {car.year} {car.brand} {car.model}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {car.mileage.toLocaleString()} miles
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Inspection: <span className="font-medium">{car.inspectionRating}/10</span>
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-3">
                  ${car.price.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Seller: {car.user.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}