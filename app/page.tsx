import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">CarEstimate</h1>
        <p className="text-xl mb-2">Car Price Estimator Marketplace</p>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Buy and sell cars with fair, system-calculated prices. No haggling, no guessing.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/buy" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Browse Cars
          </Link>
          {session ? (
            <Link href="/sell" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Sell Your Car
            </Link>
          ) : (
            <Link href="/register" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* How Price is Calculated */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Our system calculates a fair market price based on the car's condition, history and market factors.</h2>
        
      </div>

      {/* How it works steps */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h3 className="font-bold text-lg">Register an account</h3>
                <p className="text-gray-500">Create your free account with your name, email and phone number.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h3 className="font-bold text-lg">List your car</h3>
                <p className="text-gray-500">Enter your car details — brand, model, year, mileage and inspection rating.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h3 className="font-bold text-lg">Get a fair price</h3>
                <p className="text-gray-500">Our system instantly calculates a fair market price based on your inputs.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <h3 className="font-bold text-lg">Connect with buyers</h3>
                <p className="text-gray-500">Buyers browse listings and contact you directly via your phone number.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!session && (
        <div className="bg-blue-600 text-white text-center py-16 px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-8 text-blue-100">Join CarEstimate and list your car in minutes.</p>
          <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Create Free Account
          </Link>
        </div>
      )}

    </div>
  );
}