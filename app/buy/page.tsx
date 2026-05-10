"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const BRANDS = ["All","Toyota","Honda","BMW","Mercedes","Audi","Porsche","Lexus","Mazda","Volkswagen","Hyundai","Kia","Ford","Chevrolet","Nissan","Dodge","Jeep","Subaru","Volvo"];

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  inspectionRating: number;
  price: number;
  imageUrl: string | null;
  description: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export default function BuyPage() {
  const { data: session } = useSession();
  const [cars, setCars] = useState<Car[]>([]);
  const [brand, setBrand] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = brand === "All" ? "/api/cars" : `/api/cars?brand=${brand}`;
    fetch(url)
      .then(r => r.json())
      .then(d => { 
        setCars(d); 
        setLoading(false); 
      })
      .catch(() => {
        setCars([]);
        setLoading(false);
      });
  }, [brand]);

  const myCars = session ? cars.filter(car => car.user.id === session.user.id) : [];
  const otherCars = session ? cars.filter(car => car.user.id !== session.user.id) : cars;

  const CarCard = ({ car }: { car: Car }) => (
  <Link href={`/cars/${car.id}`}>
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-gray-100">
      {(car as any).imageUrl ? (
        <img
          src={(car as any).imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
          <span className="text-gray-400 text-5xl">🚗</span>
        </div>
      )}
      <div className="p-5">
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
        <p className="text-gray-400 text-sm mt-2">
          Seller: {car.user.name}
        </p>
      </div>
    </div>
  </Link>
);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading cars...</div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-500 text-lg">No cars listed yet.</p>
        {session && (
          <Link href="/sell" className="text-blue-600 hover:underline mt-2 inline-block">
            Be the first to list a car
          </Link>
        )}
      </div>
    );
  }

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

      {/* Your Listings Section */}
      {session && myCars.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
            Your Listings ({myCars.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      )}

      {/* Other Cars Section */}
      {otherCars.length > 0 && (
  <div>
    {session && myCars.length > 0 && (
      <h2 className="text-2xl font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
        Other Cars for Sale ({otherCars.length})
      </h2>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {otherCars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  </div>
)}
    </div>
  );
}