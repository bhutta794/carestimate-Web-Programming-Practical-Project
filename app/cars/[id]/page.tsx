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

  const scoreColor = (score: number) => {
    if (score >= 8) return { bg: "#F0FDF4", color: "#16A34A", label: "Excellent" };
    if (score >= 5) return { bg: "#FFFBEB", color: "#D97706", label: "Average" };
    return { bg: "#FEF2F2", color: "#DC2626", label: "Poor" };
  };

  return (
    <main style={{ background: "#F5F5F7", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

        .page-wrap { max-width: 780px; margin: 0 auto; padding: 3rem 2rem 5rem; }

        /* Spinner */
        .spinner-wrap { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
        .spinner {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid #E8E8EC; border-top-color: #0057FF;
          animation: spin 0.7s linear infinite;
        }

        /* Back link */
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #9999AA;
          text-decoration: none; margin-bottom: 1.75rem;
          transition: color 0.15s;
        }
        .back-link:hover { color: #0057FF; }

        /* Hero image */
        .hero-img-wrap {
          border-radius: 20px; overflow: hidden;
          margin-bottom: 1.5rem; border: 1px solid #E8E8EC;
          animation: fadeUp 0.3s ease;
        }
        .hero-img { width: 100%; height: 340px; object-fit: cover; display: block; }
        .hero-placeholder {
          width: 100%; height: 340px; background: #EFEFEF;
          display: flex; align-items: center; justify-content: center;
        }

        /* Card shell */
        .detail-card {
          background: #fff; border-radius: 20px;
          border: 1px solid #E8E8EC;
          overflow: hidden;
          animation: fadeUp 0.35s ease 0.05s both;
        }

        /* Card top: title + price */
        .card-top {
          padding: 1.75rem 1.75rem 1.5rem;
          border-bottom: 1px solid #F0F0F4;
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 1rem; flex-wrap: wrap;
        }
        .car-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 9999px;
          background: #EEF3FF; color: #0057FF;
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 0.625rem;
        }
        .car-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #0057FF; }
        .car-title {
          font-size: clamp(22px, 3vw, 30px); font-weight: 800;
          letter-spacing: -0.04em; color: #111111; line-height: 1.1;
        }
        .score-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 9999px;
          font-size: 12px; font-weight: 700; margin-top: 0.5rem;
        }
        .price-block { text-align: right; flex-shrink: 0; }
        .price-value {
          font-size: clamp(26px, 3.5vw, 34px); font-weight: 800;
          color: #0057FF; letter-spacing: -0.04em; line-height: 1;
        }
        .price-sub { font-size: 11px; color: #BCBCC8; font-weight: 500; margin-top: 4px; }

        /* Specs grid */
        .specs-section { padding: 1.5rem 1.75rem; border-bottom: 1px solid #F0F0F4; }
        .section-title {
          font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: #9999AA; margin-bottom: 1rem;
        }
        .specs-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.875rem;
        }
        .spec-item {
          background: #F5F5F7; border-radius: 12px; padding: 0.875rem 1rem;
        }
        .spec-label { font-size: 11px; color: #9999AA; font-weight: 600; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.04em; }
        .spec-value { font-size: 15px; color: #111111; font-weight: 700; letter-spacing: -0.02em; }

        /* Description */
        .desc-section { padding: 1.5rem 1.75rem; border-bottom: 1px solid #F0F0F4; }
        .desc-text { font-size: 14px; color: #555560; line-height: 1.7; font-weight: 400; }

        /* Seller */
        .seller-section { padding: 1.5rem 1.75rem; border-bottom: 1px solid #F0F0F4; }
        .seller-card {
          background: #F5F5F7; border-radius: 14px; padding: 1.25rem 1.25rem;
          display: flex; flex-direction: column; gap: 0.625rem;
        }
        .seller-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
        .seller-key { font-weight: 600; color: #333340; min-width: 52px; }
        .seller-val { color: #555560; font-weight: 400; }
        .login-hint { font-size: 13px; color: #BCBCC8; font-style: italic; }
        .login-hint a { color: #0057FF; font-weight: 600; text-decoration: none; }
        .login-hint a:hover { text-decoration: underline; }

        /* Owner actions */
        .actions-section { padding: 1.5rem 1.75rem; display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-edit {
          padding: 11px 22px; border-radius: 12px;
          background: #EEF3FF; color: #0057FF;
          font-size: 13px; font-weight: 700; text-decoration: none;
          border: none; cursor: pointer; font-family: inherit;
          transition: background 0.15s;
        }
        .btn-edit:hover { background: #DDEAFF; }
        .btn-delete {
          padding: 11px 22px; border-radius: 12px;
          background: #FEF2F2; color: #DC2626;
          font-size: 13px; font-weight: 700;
          border: none; cursor: pointer; font-family: inherit;
          transition: background 0.15s;
        }
        .btn-delete:hover { background: #FEE2E2; }

        @media (max-width: 600px) {
          .card-top { flex-direction: column; }
          .price-block { text-align: left; }
          .hero-img, .hero-placeholder { height: 220px; }
        }
      `}</style>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : !car || car.message ? (
        <div className="spinner-wrap" style={{ flexDirection: "column", gap: "1rem" }}>
          <span style={{ fontSize: 48 }}>🚗</span>
          <p style={{ color: "#9999AA", fontWeight: 600 }}>Car not found.</p>
        </div>
      ) : (() => {
        const isOwner = session?.user?.email === car.user.email;
        const sc = scoreColor(car.inspectionRating);
        return (
          <div className="page-wrap">
            <Link href="/buy" className="back-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to listings
            </Link>

            {/* Hero image */}
            <div className="hero-img-wrap">
              {car.imageUrl ? (
                <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="hero-img" />
              ) : (
                <div className="hero-placeholder">
                  <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
                    <path d="M6 28L11 14H29L34 28" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="28.5" r="3.5" fill="#D1D5DB"/>
                    <circle cx="28" cy="28.5" r="3.5" fill="#D1D5DB"/>
                    <path d="M6 28H34" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="detail-card">
              {/* Title + Price */}
              <div className="card-top">
                <div>
                  <div className="car-tag"><div className="car-tag-dot" /> Listing</div>
                  <div className="car-title">{car.year} {car.brand} {car.model}</div>
                  <div className="score-badge" style={{ background: sc.bg, color: sc.color }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 1l1.29 2.61 2.88.42-2.09 2.03.5 2.87L6 7.5l-2.58 1.43.5-2.87L1.83 4.03l2.88-.42z"/>
                    </svg>
                    {car.inspectionRating}/10 · {sc.label}
                  </div>
                </div>
                <div className="price-block">
                  <div className="price-value">${car.price.toLocaleString()}</div>
                  <div className="price-sub">System calculated</div>
                </div>
              </div>

              {/* Specs */}
              <div className="specs-section">
                <div className="section-title">Specifications</div>
                <div className="specs-grid">
                  <div className="spec-item">
                    <div className="spec-label">Brand</div>
                    <div className="spec-value">{car.brand}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">Model</div>
                    <div className="spec-value">{car.model}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">Year</div>
                    <div className="spec-value">{car.year}</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">Mileage</div>
                    <div className="spec-value">{car.mileage.toLocaleString()} mi</div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-label">Inspection</div>
                    <div className="spec-value" style={{ color: sc.color }}>{car.inspectionRating}/10</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div className="desc-section">
                  <div className="section-title">Description</div>
                  <p className="desc-text">{car.description}</p>
                </div>
              )}

              {/* Seller */}
              <div className="seller-section">
                <div className="section-title">Seller information</div>
                <div className="seller-card">
                  <div className="seller-row">
                    <span className="seller-key">Name</span>
                    <span className="seller-val">{car.user.name}</span>
                  </div>
                  <div className="seller-row">
                    <span className="seller-key">Email</span>
                    <span className="seller-val">{car.user.email}</span>
                  </div>
                  <div className="seller-row">
                    <span className="seller-key">Phone</span>
                    {session ? (
                      <span className="seller-val">{car.user.phoneNumber}</span>
                    ) : (
                      <span className="login-hint">
                        <Link href="/login">Login</Link> to see phone number
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner actions */}
              {isOwner && (
                <div className="actions-section">
                  <Link href={`/cars/${id}/edit`} className="btn-edit">Edit listing</Link>
                  <button onClick={handleDelete} className="btn-delete">Delete listing</button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </main>
  );
}