"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  imageUrl: string;
  featured: boolean;
}

const CATEGORIES = ["Lifestyle", "Weddings", "Corporate", "Studio", "Editorial"];

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Lifestyle");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setErrorMsg("Please select at least one image file to upload.");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("featured", String(featured));
    
    // Append all selected files for bulk uploading
    imageFiles.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Successfully uploaded ${imageFiles.length} asset(s) to your portfolio!`);
        setTitle("");
        setDescription("");
        setFeatured(false);
        setImageFiles([]);
        // Reset file input element
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        fetchItems();
      } else {
        setErrorMsg(data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Server error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter((item) => item.id !== id));
      } else {
        alert(data.error || "Failed to delete item.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="space-y-12">
      {/* Title Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-brand-charcoal">Portfolio Management</h1>
        <p className="text-brand-dark-gray text-xs tracking-wider uppercase font-medium mt-1">
          Manage your high-end display gallery and homepage assets (Supports bulk image uploads!)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-4 bg-brand-white p-8 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)] h-fit">
          <h3 className="font-serif text-2xl font-semibold text-brand-charcoal border-b border-brand-gray pb-6 mb-6">
            Upload Assets
          </h3>

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                Base Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Amber Glow Sunset"
                className="w-full bg-brand-gray/50 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-brand-gray/50 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief artistic description..."
                className="w-full bg-brand-gray/50 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured-toggle"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-brand-gray text-brand-gold focus:ring-brand-gold"
              />
              <label htmlFor="featured-toggle" className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal cursor-pointer">
                Feature on Homepage
              </label>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                Select Photo(s)
              </label>
              <div className="relative border-2 border-dashed border-brand-gray rounded-xl p-6 hover:border-brand-gold transition-colors text-center cursor-pointer bg-brand-gray/20">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <Upload className="mx-auto text-brand-dark-gray/60" size={24} />
                  <p className="text-xs text-brand-dark-gray font-semibold">
                    {imageFiles.length > 0
                      ? `${imageFiles.length} file(s) selected`
                      : "Drag images or click to browse (Select Multiple!)"}
                  </p>
                  {imageFiles.length > 0 && (
                    <div className="text-[10px] text-brand-dark-gray font-light max-w-xs mx-auto truncate">
                      {imageFiles.map((f) => f.name).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {successMsg && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl border border-green-200 text-xs font-semibold">
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="text-red-500 bg-red-50 p-3 rounded-xl border border-red-200 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-4 bg-brand-gold text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-brand-gold/10 hover:bg-brand-gold-hover transition-all disabled:opacity-50"
            >
              {uploading ? `Uploading ${imageFiles.length} File(s)...` : "Upload Assets"}
            </button>
          </form>
        </div>

        {/* Gallery Grid Column */}
        <div className="lg:col-span-8 bg-brand-white p-8 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
          <h3 className="font-serif text-2xl font-semibold text-brand-charcoal border-b border-brand-gray pb-6 mb-6">
            Gallery Assets ({items.length})
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <ImageIcon className="mx-auto text-brand-dark-gray/30" size={48} />
              <p className="text-brand-dark-gray text-sm font-light">No images uploaded to the gallery yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-brand-cream border border-brand-gray rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_2px_15px_rgba(0,0,0,0.01)]"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold">
                          {item.category} {item.featured && "• Featured"}
                        </span>
                        <h4 className="text-white font-serif text-lg font-semibold mt-0.5 truncate">{item.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
