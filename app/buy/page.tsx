"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  inspectionRating: number;
  price: number;
  description: string | null;
  user: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

const BRANDS = ["All", "Toyota", "Honda", "BMW", "Mercedes", "Audi", "Porsche", "Lexus"];

export default function BuyPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brand, setBrand] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = brand === "All" ? "/api/cars" : `/api/cars?brand=${brand}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        setLoading(false);
      })
      .catch(() => {
        setCars([]);
        setLoading(false);
      });
  }, [brand]);

  const getStars = (rating: number) => {
    return <span className="font-semibold">{car.inspectionRating}/10</span>
;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading cars...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cars for Sale</h1>
        <select
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          {BRANDS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No cars found</p>
          <Link href="/sell" className="text-blue-600 hover:underline mt-2 inline-block">
            Be the first to list a car
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Link key={car.id} href={`/cars/${car.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-5 cursor-pointer border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">
                  {car.year} {car.brand} {car.model}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {car.mileage.toLocaleString()} miles
                </p>
                <p className="text-yellow-500 mt-1">{getStars(car.inspectionRating)}</p>
                <p className="text-2xl font-bold text-blue-600 mt-3">
                  ${car.price.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm mt-2">Seller: {car.user.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}