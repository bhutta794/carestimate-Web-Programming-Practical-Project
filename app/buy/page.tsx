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
      .then(d => { setCars(d); setLoading(false); })
      .catch(() => { setCars([]); setLoading(false); });
  }, [brand]);

  const myCars = session ? cars.filter(c => c.user.id === session.user.id) : [];
  const otherCars = session ? cars.filter(c => c.user.id !== session.user.id) : cars;

  const scoreColor = (score: number) => {
    if (score >= 8) return { bg: "#F0FDF4", color: "#16A34A" };
    if (score >= 5) return { bg: "#FFFBEB", color: "#D97706" };
    return { bg: "#FEF2F2", color: "#DC2626" };
  };

  const CarCard = ({ car, mine }: { car: Car; mine?: boolean }) => {
    const sc = scoreColor(car.inspectionRating);
    return (
      <Link href={`/cars/${car.id}`} style={{ textDecoration: "none" }}>
        <div className="car-card">
          {mine && <div className="car-mine-badge">Your listing</div>}
          <div className="car-img-wrap">
            {car.imageUrl ? (
              <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="car-img" />
            ) : (
              <div className="car-img-placeholder">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M6 28L11 14H29L34 28" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="28.5" r="3.5" fill="#D1D5DB"/>
                  <circle cx="28" cy="28.5" r="3.5" fill="#D1D5DB"/>
                  <path d="M6 28H34" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </div>
          <div className="car-body">
            <div className="car-top-row">
              <div className="car-title">{car.year} {car.brand} {car.model}</div>
              <div className="car-score-badge" style={{ background: sc.bg, color: sc.color }}>
                {car.inspectionRating}/10
              </div>
            </div>
            <div className="car-meta">
              <span>{car.mileage.toLocaleString()} mi</span>
              <span className="car-meta-dot">·</span>
              <span>{car.brand}</span>
            </div>
            <div className="car-bottom-row">
              <div className="car-price">${car.price.toLocaleString()}</div>
              <div className="car-seller">by {car.user.name.split(" ")[0]}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main style={{ background: "#F5F5F7", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        .page-wrap { max-width: 1280px; margin: 0 auto; padding: 3rem 2rem 5rem; }

        /* Header */
        .page-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1.25rem;
        }
        .page-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 9999px;
          background: #EEF3FF; color: #0057FF;
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 0.75rem;
        }
        .page-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #0057FF; }
        .page-h1 {
          font-size: clamp(26px, 3.5vw, 38px); font-weight: 800;
          letter-spacing: -0.04em; color: #111111; line-height: 1.05;
        }
        .page-count { font-size: 14px; color: #9999AA; font-weight: 400; margin-left: 6px; }

        /* Brand filter */
        .filter-wrap { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .filter-pill {
          padding: 7px 16px; border-radius: 9999px;
          border: 1.5px solid #E8E8EC; background: #fff;
          font-size: 13px; font-weight: 600; color: #555560;
          cursor: pointer; font-family: inherit;
          transition: all 0.15s; white-space: nowrap;
        }
        .filter-pill:hover { border-color: #0057FF; color: #0057FF; }
        .filter-pill.active {
          background: #0057FF; border-color: #0057FF;
          color: #fff;
        }

        /* Section label */
        .section-label {
          font-size: 12px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: #9999AA;
          margin-bottom: 1.25rem; margin-top: 2.5rem;
          display: flex; align-items: center; gap: 10px;
        }
        .section-label::after {
          content: ''; flex: 1; height: 1px; background: #E8E8EC;
        }

        /* Grid */
        .cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        /* Card */
        .car-card {
          background: #fff; border-radius: 20px;
          border: 1px solid #E8E8EC;
          overflow: hidden; position: relative;
          transition: box-shadow 0.2s, transform 0.2s;
          animation: fadeUp 0.3s ease;
          cursor: pointer;
        }
        .car-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        .car-mine-badge {
          position: absolute; top: 12px; left: 12px; z-index: 2;
          padding: 4px 10px; border-radius: 9999px;
          background: rgba(0,87,255,0.9); color: #fff;
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
          backdrop-filter: blur(4px);
        }
        .car-img-wrap { position: relative; overflow: hidden; }
        .car-img {
          width: 100%; height: 190px; object-fit: cover; display: block;
          transition: transform 0.3s;
        }
        .car-card:hover .car-img { transform: scale(1.03); }
        .car-img-placeholder {
          width: 100%; height: 190px; background: #F5F5F7;
          display: flex; align-items: center; justify-content: center;
        }
        .car-body { padding: 1.25rem; }
        .car-top-row {
          display: flex; justify-content: space-between;
          align-items: flex-start; gap: 8px; margin-bottom: 5px;
        }
        .car-title {
          font-size: 16px; font-weight: 700; color: #111111;
          letter-spacing: -0.02em; line-height: 1.3;
        }
        .car-score-badge {
          padding: 4px 9px; border-radius: 9999px;
          font-size: 11px; font-weight: 700;
          white-space: nowrap; flex-shrink: 0;
        }
        .car-meta {
          font-size: 13px; color: #9999AA; font-weight: 400;
          margin-bottom: 1rem; display: flex; align-items: center; gap: 5px;
        }
        .car-meta-dot { color: #D1D5DB; }
        .car-bottom-row {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 0.875rem; border-top: 1px solid #F0F0F4;
        }
        .car-price {
          font-size: 22px; font-weight: 800;
          color: #0057FF; letter-spacing: -0.03em;
        }
        .car-seller { font-size: 12px; color: #9999AA; font-weight: 500; }

        /* Empty state */
        .empty-state {
          text-align: center; padding: 5rem 2rem;
          background: #fff; border-radius: 20px; border: 1px solid #E8E8EC;
        }
        .empty-icon { font-size: 48px; margin-bottom: 1rem; }
        .empty-title { font-size: 20px; font-weight: 700; color: #111111; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .empty-sub { font-size: 15px; color: #9999AA; margin-bottom: 1.5rem; }
        .empty-cta {
          display: inline-block; padding: 12px 24px;
          border-radius: 9999px; background: #0057FF; color: #fff;
          font-size: 14px; font-weight: 600; text-decoration: none;
          transition: opacity 0.15s;
        }
        .empty-cta:hover { opacity: 0.88; }

        /* Spinner */
        .spinner-wrap {
          min-height: 60vh; display: flex; align-items: center; justify-content: center;
        }
        .spinner {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid #E8E8EC; border-top-color: #0057FF;
          animation: spin 0.7s linear infinite;
        }

        @media (max-width: 640px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .filter-wrap { gap: 6px; }
        }
      `}</style>

      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : (
        <div className="page-wrap">
          {/* Header */}
          <div className="page-header">
            <div>
              <div className="page-tag">
                <div className="page-tag-dot" />
                Marketplace
              </div>
              <h1 className="page-h1">
                Browse vehicles
                <span className="page-count">{cars.length} listed</span>
              </h1>
            </div>

            {/* Brand filter pills */}
            <div className="filter-wrap">
              {BRANDS.map(b => (
                <button
                  key={b}
                  className={`filter-pill${brand === b ? " active" : ""}`}
                  onClick={() => setBrand(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {cars.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <div className="empty-title">No vehicles listed yet</div>
              <div className="empty-sub">Be the first to list a car for sale.</div>
              {session && (
                <Link href="/sell" className="empty-cta">List your car →</Link>
              )}
            </div>
          )}

          {/* Your listings */}
          {session && myCars.length > 0 && (
            <>
              <div className="section-label">Your listings ({myCars.length})</div>
              <div className="cars-grid">
                {myCars.map(car => <CarCard key={car.id} car={car} mine />)}
              </div>
            </>
          )}

          {/* Other listings */}
          {otherCars.length > 0 && (
            <>
              {session && myCars.length > 0 && (
                <div className="section-label">Other vehicles ({otherCars.length})</div>
              )}
              <div className="cars-grid">
                {otherCars.map(car => <CarCard key={car.id} car={car} />)}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}