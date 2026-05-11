"use client";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BRAND_MODELS } from "@/lib/constants";

const BRANDS = Object.keys(BRAND_MODELS);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR - i);

const RATING_OPTIONS = [
  { value: 10, label: "10 — Perfect condition" },
  { value: 9,  label: "9 — Excellent condition" },
  { value: 8,  label: "8 — Very good condition" },
  { value: 7,  label: "7 — Good condition" },
  { value: 6,  label: "6 — Above average" },
  { value: 5,  label: "5 — Average condition" },
  { value: 4,  label: "4 — Below average" },
  { value: 3,  label: "3 — Poor condition" },
  { value: 2,  label: "2 — Very poor condition" },
  { value: 1,  label: "1 — Extremely poor condition" },
];

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    brand: "Toyota",
    model: BRAND_MODELS["Toyota"][0].model,
    year: CURRENT_YEAR,
    mileage: "",
    inspectionRating: 5,
    description: "",
  });
  const [preview, setPreview] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then(r => r.json())
      .then(car => {
        setForm({
          brand: car.brand,
          model: car.model,
          year: car.year,
          mileage: String(car.mileage),
          inspectionRating: car.inspectionRating,
          description: car.description || "",
        });
        setCurrentImage(car.imageUrl || null);
      });
  }, [id]);

  useEffect(() => {
    if (!form.mileage) return;
    fetch("/api/price-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: form.brand,
        model: form.model,
        year: form.year,
        mileage: parseInt(form.mileage),
        inspectionRating: form.inspectionRating,
      }),
    })
      .then(r => r.json())
      .then(d => setPreview(d.price));
  }, [form.brand, form.model, form.year, form.mileage, form.inspectionRating]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile(reader.result as string);
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = currentImage;
    if (imageFile) {
      setUploading(true);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageFile }),
      });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
      setUploading(false);
    }

    const res = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl }),
    });
    setLoading(false);
    if (res.ok) router.push(`/cars/${id}`);
    else { const d = await res.json(); setError(d.message || "Update failed"); }
  };

  return (
    <main style={{ background: "#F5F5F7", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

        .page-wrap { max-width: 680px; margin: 0 auto; padding: 3rem 2rem 5rem; }

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

        /* Page header */
        .page-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 9999px;
          background: #EEF3FF; color: #0057FF;
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 0.75rem;
        }
        .page-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #0057FF; }
        .page-h1 {
          font-size: clamp(24px, 3vw, 32px); font-weight: 800;
          letter-spacing: -0.04em; color: #111111; line-height: 1.05;
          margin-bottom: 2rem;
        }

        /* Price preview banner */
        .price-banner {
          background: #fff; border: 1px solid #E8E8EC;
          border-radius: 16px; padding: 1.25rem 1.5rem;
          margin-bottom: 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          animation: fadeUp 0.3s ease;
        }
        .price-banner-label { font-size: 12px; font-weight: 700; color: #9999AA; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
        .price-banner-value { font-size: 28px; font-weight: 800; color: #0057FF; letter-spacing: -0.04em; }
        .price-banner-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: #EEF3FF; display: flex; align-items: center; justify-content: center;
        }

        /* Error */
        .form-error {
          background: #FEF2F2; border: 1px solid #FECACA;
          color: #DC2626; border-radius: 12px;
          padding: 0.75rem 1rem; font-size: 13px; font-weight: 500;
          margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 8px;
        }

        /* Form card */
        .form-card {
          background: #fff; border: 1px solid #E8E8EC;
          border-radius: 20px; overflow: hidden;
          animation: fadeUp 0.35s ease 0.05s both;
        }
        .form-section { padding: 1.5rem 1.75rem; border-bottom: 1px solid #F0F0F4; }
        .form-section:last-child { border-bottom: none; }
        .form-section-title {
          font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase; color: #9999AA; margin-bottom: 1.25rem;
        }

        /* Grid */
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 1rem; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }

        /* Field */
        .form-field { margin-bottom: 1.125rem; }
        .form-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #333340; margin-bottom: 0.5rem; letter-spacing: -0.01em;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #E8E8EC; border-radius: 12px;
          font-size: 14px; font-weight: 400; color: #111111;
          font-family: inherit; background: #FAFAFA;
          outline: none; transition: border-color 0.15s, background 0.15s;
          appearance: none;
        }
        .form-input::placeholder { color: #BCBCC8; }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #0057FF; background: #fff;
          box-shadow: 0 0 0 3px rgba(0,87,255,0.08);
        }
        .form-select {
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%239999AA' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          cursor: pointer;
        }
        .form-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
        .form-hint { font-size: 11px; color: #BCBCC8; margin-top: 5px; font-weight: 500; }

        /* Image upload */
        .img-preview {
          width: 100%; height: 200px; object-fit: cover;
          border-radius: 12px; margin-bottom: 1rem; display: block;
          border: 1px solid #E8E8EC;
        }
        .img-upload-area {
          border: 1.5px dashed #D1D5DB; border-radius: 12px;
          padding: 1.25rem; text-align: center;
          background: #FAFAFA; cursor: pointer;
          transition: border-color 0.15s;
          position: relative;
        }
        .img-upload-area:hover { border-color: #0057FF; }
        .img-upload-area input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .img-upload-label { font-size: 13px; font-weight: 600; color: #555560; }
        .img-upload-sub { font-size: 11px; color: #BCBCC8; margin-top: 4px; }

        /* Submit */
        .submit-section { padding: 1.5rem 1.75rem; }
        .submit-btn {
          width: 100%; padding: 14px;
          border-radius: 12px; background: #0057FF; border: none;
          color: #fff; font-size: 15px; font-weight: 700;
          font-family: inherit; cursor: pointer; letter-spacing: -0.01em;
          transition: opacity 0.15s, transform 0.1s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.88; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
          animation: spin 0.65s linear infinite;
        }

        @media (max-width: 560px) {
          .form-grid-3 { grid-template-columns: 1fr; }
          .form-grid-2 { grid-template-columns: 1fr; }
          .form-section { padding: 1.25rem; }
          .submit-section { padding: 1.25rem; }
        }
      `}</style>

      {status === "loading" ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="page-wrap">
          <Link href={`/cars/${id}`} className="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to listing
          </Link>

          <div className="page-tag"><div className="page-tag-dot" /> Edit</div>
          <h1 className="page-h1">Update listing</h1>

          {/* Price preview */}
          {preview && (
            <div className="price-banner">
              <div>
                <div className="price-banner-label">Estimated price</div>
                <div className="price-banner-value">${preview.toLocaleString()}</div>
              </div>
              <div className="price-banner-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2v16M6 6h6a2 2 0 010 4H7a2 2 0 000 4h7" stroke="#0057FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="form-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
                <path d="M8 4.5V8.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.75" fill="#DC2626"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-card">

              {/* Vehicle details */}
              <div className="form-section">
                <div className="form-section-title">Vehicle details</div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-label">Brand</label>
                    <select className="form-select" value={form.brand}
                      onChange={e => setForm({ ...form, brand: e.target.value, model: BRAND_MODELS[e.target.value][0].model })}>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Model</label>
                    <select className="form-select" value={form.model}
                      onChange={e => setForm({ ...form, model: e.target.value })}>
                      {BRAND_MODELS[form.brand].map(m => (
                        <option key={m.model} value={m.model}>{m.model}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-label">Year</label>
                    <select className="form-select" value={form.year}
                      onChange={e => setForm({ ...form, year: Number(e.target.value) })}>
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Mileage</label>
                    <input type="number" className="form-input" placeholder="e.g. 45000"
                      min={0} max={500000} value={form.mileage}
                      onChange={e => setForm({ ...form, mileage: e.target.value })} required />
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="form-section">
                <div className="form-section-title">Condition</div>
                <div className="form-field">
                  <label className="form-label">Inspection rating</label>
                  <select className="form-select" value={form.inspectionRating}
                    onChange={e => setForm({ ...form, inspectionRating: Number(e.target.value) })}>
                    {RATING_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="form-section">
                <div className="form-section-title">Description</div>
                <div className="form-field">
                  <label className="form-label">Notes <span style={{ color: "#BCBCC8", fontWeight: 400 }}>(optional)</span></label>
                  <textarea className="form-textarea" maxLength={1000}
                    placeholder="Any extra details about the car's condition, history, modifications…"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                  <p className="form-hint">{form.description.length}/1000 characters</p>
                </div>
              </div>

              {/* Image */}
              <div className="form-section">
                <div className="form-section-title">Photo</div>
                {(imagePreview || currentImage) && (
                  <img
                    src={imagePreview ?? currentImage!}
                    alt="Car preview"
                    className="img-preview"
                  />
                )}
                <div className="img-upload-area">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <div className="img-upload-label">
                    {imagePreview ? "Replace image" : currentImage ? "Upload new image" : "Upload image"}
                  </div>
                  <div className="img-upload-sub">JPG, PNG or WEBP · Max 10 MB</div>
                </div>
              </div>

              {/* Submit */}
              <div className="submit-section">
                <button type="submit" className="submit-btn" disabled={loading || uploading}>
                  {uploading ? (
                    <><div className="btn-spinner" /> Uploading image…</>
                  ) : loading ? (
                    <><div className="btn-spinner" /> Saving changes…</>
                  ) : (
                    "Save changes →"
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      )}
    </main>
  );
}