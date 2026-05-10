"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND_MODELS } from "@/lib/constants";

const BRANDS = Object.keys(BRAND_MODELS);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR - i);

const CONDITION_OPTIONS = [
  { value: 10, label: "Perfect", desc: "Showroom condition" },
  { value: 9,  label: "Excellent", desc: "Like new, minimal wear" },
  { value: 8,  label: "Very Good", desc: "Well maintained" },
  { value: 7,  label: "Good", desc: "Minor cosmetic wear" },
  { value: 6,  label: "Above Average", desc: "Some visible wear" },
  { value: 5,  label: "Average", desc: "Normal use and wear" },
  { value: 4,  label: "Below Average", desc: "Noticeable wear" },
  { value: 3,  label: "Poor", desc: "Significant issues" },
  { value: 2,  label: "Very Poor", desc: "Major repairs needed" },
  { value: 1,  label: "Critical", desc: "Extensive damage" },
];

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    brand: "Toyota",
    model: BRAND_MODELS["Toyota"][0].model,
    year: CURRENT_YEAR,
    mileage: "",
    inspectionRating: 5,
    description: ""
  });
  const [preview, setPreview] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      .then(res => res.json())
      .then(data => setPreview(data.price));
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
    setError("");
    let imageUrl = null;
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
    const res = await fetch("/api/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl }),
    });
    setLoading(false);
    if (res.ok) { router.push("/buy"); router.refresh(); }
    else { const data = await res.json(); setError(data.message || "Failed to list car"); }
  };

  const selectedCondition = CONDITION_OPTIONS.find(c => c.value === form.inspectionRating);

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <div style={{ width: 32, height: 32, border: "2px solid #E8E8EC", borderTop: "2px solid #0057FF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <main style={{ background: "#F5F5F7", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", paddingTop: "80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --blue: #0057FF;
          --blue-light: #EEF3FF;
          --blue-mid: #D0DEFF;
          --surface: #F5F5F7;
          --border: #E8E8EC;
          --text-1: #111111;
          --text-2: #555560;
          --text-3: #9999AA;
          --green: #16A34A;
          --green-light: #F0FDF4;
          --red: #DC2626;
          --red-light: #FEF2F2;
          --radius-pill: 9999px;
          --radius-card: 20px;
          --radius-inner: 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        .page-wrap {
          max-width: 780px; margin: 0 auto; padding: 3rem 1.5rem 5rem;
        }

        /* Header */
        .page-header { margin-bottom: 2.5rem; }
        .page-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: var(--radius-pill);
          background: var(--blue-light); color: var(--blue);
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .page-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--blue); }
        .page-h1 {
          font-size: clamp(28px, 4vw, 40px); font-weight: 800;
          letter-spacing: -0.04em; color: var(--text-1); margin-bottom: 0.5rem;
        }
        .page-sub { font-size: 15px; color: var(--text-2); line-height: 1.6; }

        /* Price preview */
        .price-card {
          background: #fff; border-radius: var(--radius-card);
          border: 1px solid var(--border);
          padding: 1.5rem 1.75rem;
          margin-bottom: 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; flex-wrap: wrap;
          animation: fadeIn 0.3s ease;
        }
        .price-label { font-size: 12px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
        .price-value { font-size: 36px; font-weight: 800; color: var(--blue); letter-spacing: -0.04em; }
        .price-note { font-size: 12px; color: var(--text-3); margin-top: 3px; }
        .price-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: var(--radius-pill);
          background: var(--blue-light); color: var(--blue);
          font-size: 13px; font-weight: 600;
        }

        /* Error */
        .error-bar {
          background: var(--red-light); border: 1px solid #FECACA;
          border-radius: var(--radius-inner);
          padding: 12px 16px; margin-bottom: 1.25rem;
          font-size: 14px; color: var(--red);
          display: flex; align-items: center; gap: 8px;
        }

        /* Form card */
        .form-card {
          background: #fff; border-radius: var(--radius-card);
          border: 1px solid var(--border);
          overflow: hidden;
        }

        /* Sections inside form */
        .form-section { padding: 1.75rem; border-bottom: 1px solid var(--border); }
        .form-section:last-child { border-bottom: none; }
        .form-section-title {
          font-size: 13px; font-weight: 700; color: var(--text-3);
          text-transform: uppercase; letter-spacing: 0.07em;
          margin-bottom: 1.25rem;
        }

        /* Field */
        .field { margin-bottom: 1.25rem; }
        .field:last-child { margin-bottom: 0; }
        .field-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--text-1); margin-bottom: 6px;
        }
        .field-required { color: var(--blue); margin-left: 2px; }

        /* Inputs */
        .field-input, .field-select, .field-textarea {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-inner);
          font-family: inherit; font-size: 14px; font-weight: 500;
          color: var(--text-1); background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none; outline: none;
        }
        .field-input:focus, .field-select:focus, .field-textarea:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(0,87,255,0.08);
        }
        .field-input::placeholder, .field-textarea::placeholder { color: var(--text-3); font-weight: 400; }
        .field-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

        /* Select wrapper for custom arrow */
        .select-wrap { position: relative; }
        .select-wrap::after {
          content: ''; position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          width: 0; height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid var(--text-3);
          pointer-events: none;
        }
        .field-select { padding-right: 36px; cursor: pointer; }

        /* 2-col grid */
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 540px) { .field-grid { grid-template-columns: 1fr; } }

        /* Condition selector */
        .condition-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .condition-pill {
          padding: 7px 14px; border-radius: var(--radius-pill);
          border: 1.5px solid var(--border);
          font-size: 13px; font-weight: 600; color: var(--text-2);
          background: #fff; cursor: pointer;
          transition: all 0.15s;
        }
        .condition-pill:hover { border-color: var(--blue-mid); color: var(--blue); }
        .condition-pill.active {
          border-color: var(--blue); background: var(--blue-light);
          color: var(--blue);
        }
        .condition-desc {
          margin-top: 0.75rem; font-size: 13px; color: var(--text-2);
          display: flex; align-items: center; gap: 6px;
        }
        .condition-score {
          font-size: 22px; font-weight: 800; color: var(--text-1); letter-spacing: -0.03em;
        }

        /* Image upload */
        .image-upload-area {
          border: 2px dashed var(--border); border-radius: var(--radius-inner);
          padding: 2rem; text-align: center;
          cursor: pointer; transition: border-color 0.15s, background 0.15s;
          position: relative;
        }
        .image-upload-area:hover { border-color: var(--blue); background: var(--blue-light); }
        .image-upload-area input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .upload-icon { font-size: 28px; margin-bottom: 8px; }
        .upload-text { font-size: 14px; font-weight: 600; color: var(--text-1); margin-bottom: 3px; }
        .upload-sub { font-size: 12px; color: var(--text-3); }
        .image-preview-wrap { position: relative; margin-top: 1rem; }
        .image-preview { width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-inner); display: block; }
        .image-remove {
          position: absolute; top: 8px; right: 8px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(0,0,0,0.55); color: #fff;
          border: none; cursor: pointer; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
        }

        /* Char count */
        .char-count { font-size: 12px; color: var(--text-3); text-align: right; margin-top: 5px; }

        /* Submit */
        .submit-section { padding: 1.5rem 1.75rem; background: var(--surface); border-top: 1px solid var(--border); }
        .submit-btn {
          width: 100%; padding: 15px;
          border-radius: var(--radius-pill);
          background: var(--blue); color: #fff;
          font-family: inherit; font-size: 15px; font-weight: 700;
          border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.12s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .submit-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <div className="page-tag">
            <div className="page-tag-dot" />
            New Listing
          </div>
          <h1 className="page-h1">List your vehicle</h1>
          <p className="page-sub">Enter your car details — we'll calculate the market price automatically.</p>
        </div>

        {/* Price preview */}
        {preview && (
          <div className="price-card">
            <div>
              <div className="price-label">Estimated Market Value</div>
              <div className="price-value">${preview.toLocaleString()}</div>
              <div className="price-note">Calculated from your inputs · Updates live</div>
            </div>
            <div className="price-badge">
              <span>🤖</span> AI-Powered
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-bar">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-card">

            {/* Vehicle details */}
            <div className="form-section">
              <div className="form-section-title">Vehicle details</div>

              <div className="field-grid">
                <div className="field">
                  <label className="field-label">Brand <span className="field-required">*</span></label>
                  <div className="select-wrap">
                    <select
                      className="field-select"
                      value={form.brand}
                      onChange={e => setForm({ ...form, brand: e.target.value, model: BRAND_MODELS[e.target.value][0].model })}
                    >
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Model <span className="field-required">*</span></label>
                  <div className="select-wrap">
                    <select
                      className="field-select"
                      value={form.model}
                      onChange={e => setForm({ ...form, model: e.target.value })}
                    >
                      {BRAND_MODELS[form.brand].map(m => (
                        <option key={m.model} value={m.model}>{m.model}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field-grid">
                <div className="field">
                  <label className="field-label">Year <span className="field-required">*</span></label>
                  <div className="select-wrap">
                    <select
                      className="field-select"
                      value={form.year}
                      onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
                    >
                      {YEARS.map(year => <option key={year}>{year}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Mileage (miles) <span className="field-required">*</span></label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="e.g. 45,000"
                    value={form.mileage}
                    onChange={e => setForm({ ...form, mileage: e.target.value })}
                    min={0} max={500000} required
                  />
                </div>
              </div>
            </div>

            {/* Inspection Score */}
            <div className="form-section">
              <div style={{ marginBottom: "1.25rem" }}>
                <div className="form-section-title" style={{ marginBottom: "4px" }}>CarEstimate Inspection Score</div>
                <div style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.5 }}>
                  This score is assigned by a certified CarEstimate inspector. It reflects the overall vehicle condition across bodywork, mechanics, interior, and documentation.
                </div>
              </div>
              <div className="condition-pills">
                {CONDITION_OPTIONS.map(c => (
                  <button
                    type="button"
                    key={c.value}
                    className={`condition-pill${form.inspectionRating === c.value ? " active" : ""}`}
                    onClick={() => setForm({ ...form, inspectionRating: c.value })}
                  >
                    {c.value} — {c.label}
                  </button>
                ))}
              </div>
              {selectedCondition && (
                <div className="condition-desc">
                  <span className="condition-score">{selectedCondition.value}/10</span>
                  <span>— {selectedCondition.desc}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-section">
              <div className="form-section-title">Description</div>
              <div className="field">
                <label className="field-label">Additional details <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span></label>
                <textarea
                  className="field-textarea"
                  placeholder="Describe any extra features, recent services, modifications, or known issues..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  maxLength={1000}
                />
                <div className="char-count">{form.description.length} / 1000</div>
              </div>
            </div>

            {/* Image */}
            <div className="form-section">
              <div className="form-section-title">Photo</div>
              {!imagePreview ? (
                <div className="image-upload-area">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">Upload a photo</div>
                  <div className="upload-sub">PNG, JPG, WEBP · Optional but recommended</div>
                </div>
              ) : (
                <div className="image-preview-wrap">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="image-remove"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                  >✕</button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="submit-section">
              <button type="submit" className="submit-btn" disabled={loading || uploading}>
                {(loading || uploading) && <div className="submit-spinner" />}
                {uploading ? "Uploading image…" : loading ? "Listing your car…" : "List car for sale →"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}