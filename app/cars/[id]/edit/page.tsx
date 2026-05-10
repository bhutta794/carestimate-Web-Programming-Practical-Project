"use client";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND_MODELS } from "@/lib/constants";

const BRANDS = Object.keys(BRAND_MODELS);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR - i);

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
    description: ""
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
          description: car.description || ""
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
      body: JSON.stringify({ ...form, imageUrl })
    });
    setLoading(false);
    if (res.ok) router.push(`/cars/${id}`);
    else { const d = await res.json(); setError(d.message || "Update failed"); }
  };

  if (status === "loading") return (
    <div className="text-center py-20">Loading...</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {preview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-600">Estimated price</p>
          <p className="text-3xl font-bold text-blue-700">${preview.toLocaleString()}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select className="w-full border rounded px-3 py-2" value={form.brand}
            onChange={e => setForm({
              ...form,
              brand: e.target.value,
              model: BRAND_MODELS[e.target.value][0].model
            })}>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select className="w-full border rounded px-3 py-2" value={form.model}
            onChange={e => setForm({ ...form, model: e.target.value })}>
            {BRAND_MODELS[form.brand].map(m => (
              <option key={m.model} value={m.model}>{m.model}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select className="w-full border rounded px-3 py-2" value={form.year}
            onChange={e => setForm({ ...form, year: Number(e.target.value) })}>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mileage</label>
          <input type="number" className="w-full border rounded px-3 py-2"
            min={0} max={500000} value={form.mileage}
            onChange={e => setForm({ ...form, mileage: e.target.value })} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Inspection Rating (1-10)</label>
          <select className="w-full border rounded px-3 py-2" value={form.inspectionRating}
            onChange={e => setForm({ ...form, inspectionRating: Number(e.target.value) })}>
            <option value={10}>10 - Perfect condition</option>
            <option value={9}>9 - Excellent condition</option>
            <option value={8}>8 - Very good condition</option>
            <option value={7}>7 - Good condition</option>
            <option value={6}>6 - Above average</option>
            <option value={5}>5 - Average condition</option>
            <option value={4}>4 - Below average</option>
            <option value={3}>3 - Poor condition</option>
            <option value={2}>2 - Very poor condition</option>
            <option value={1}>1 - Extremely poor condition</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4} maxLength={1000}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Car Image</label>
          {currentImage && !imagePreview && (
            <img src={currentImage} alt="Current"
              className="mb-3 rounded-lg w-full h-48 object-cover" />
          )}
          {imagePreview && (
            <img src={imagePreview} alt="New preview"
              className="mb-3 rounded-lg w-full h-48 object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 rounded px-3 py-2"
            onChange={handleImageChange}
          />
          <p className="text-xs text-gray-400 mt-1">Upload a new image to replace the current one</p>
        </div>

        <button type="submit" disabled={loading || uploading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
          {uploading ? "Uploading image..." : loading ? "Updating..." : "Update Listing"}
        </button>
      </form>
    </div>
  );
}