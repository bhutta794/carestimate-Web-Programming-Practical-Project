"use client";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then(r => r.json())
      .then(d => { setCar(d); setLoading(false); });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    await fetch(`/api/cars/${id}`, { method: "DELETE" });
    router.push("/buy");
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!car || car.message) return <div className="text-center py-20">Car not found.</div>;

  const isOwner = session?.user?.email === car.user.email;
  const breakdown = car.priceBreakdown ? JSON.parse(car.priceBreakdown) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/buy" className="text-blue-600 hover:underline mb-6 inline-block">
  ← Back to listings
</Link>

{car.imageUrl && (
  <img
    src={car.imageUrl}
    alt={`${car.brand} ${car.model}`}
    className="w-full h-64 object-cover rounded-lg mb-6"
  />
)}

<div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {car.year} {car.brand} {car.model}
            </h1>
            <p className="text-yellow-500 text-xl mt-1">
              <span className="font-semibold">{car.inspectionRating}/10</span>

            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">${car.price.toLocaleString()}</p>
            <p className="text-sm text-gray-400">System calculated</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <p><span className="font-medium">Brand:</span> {car.brand}</p>
          <p><span className="font-medium">Model:</span> {car.model}</p>
          <p><span className="font-medium">Year:</span> {car.year}</p>
          <p><span className="font-medium">Mileage:</span> {car.mileage.toLocaleString()} miles</p>
<p><span className="font-medium">Inspection:</span> {car.inspectionRating}/10</p>        </div>

        {car.description && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{car.description}</p>
          </div>
        )}

        
        <div className="bg-blue-50 rounded-lg p-5 mb-6">
          <h3 className="font-semibold mb-3">Seller Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {car.user.name}</p>
            <p><span className="font-medium">Email:</span> {car.user.email}</p>
            {session ? (
              <p><span className="font-medium">Phone:</span> {car.user.phoneNumber}</p>
            ) : (
              <p className="text-gray-400 italic">
                <Link href="/login" className="text-blue-600 hover:underline">Login</Link> to see phone number
              </p>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-3">
            <Link href={`/cars/${id}/edit`} 
              className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600 transition">
              Edit Listing
            </Link>
            <button onClick={handleDelete}
              className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition">
              Delete Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}