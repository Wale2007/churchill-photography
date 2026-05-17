"use client";

import { useState, useEffect } from "react";
import { Download, Lock, FileText, Calendar } from "lucide-react";

interface FileItem {
  name: string;
  url: string;
  size?: string;
}

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  files: any; // HTML/Next JSON parses JSON field from Prisma as array/object
  expiryDate: string;
}

export default function DownloadsPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [hasTokenInUrl, setHasTokenInUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [error, setError] = useState("");

  // Extract token from URL search query on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      if (urlToken) {
        setToken(urlToken);
        setHasTokenInUrl(true);
      }
    }
  }, []);

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
      } else {
        setError(data.error || "Incorrect passcode. Access denied.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = async () => {
    if (!project) return;
    try {
      await fetch("/api/projects/download-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const parsedFiles: FileItem[] = project
    ? typeof project.files === "string"
      ? JSON.parse(project.files)
      : project.files
    : [];

  return (
    <div className="py-24 md:py-32 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Abstract luxury orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl mix-blend-multiply"></div>

      <div className="container mx-auto px-6 relative z-10">
        {!project ? (
          <div className="max-w-md mx-auto bg-brand-white p-8 md:p-12 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] glass-panel">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-brand-cream border border-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold mx-auto mb-4">
                <Lock size={20} />
              </div>
              <h1 className="font-serif text-3xl font-bold text-brand-charcoal">VIP Client Portal</h1>
              <p className="text-brand-dark-gray text-xs font-light tracking-wide mt-2">
                {hasTokenInUrl 
                  ? "This delivery is secure. Enter your passcode to unlock."
                  : "Enter your secure download token and passcode to unlock your deliverables."}
              </p>
            </div>

            <form onSubmit={handleAccess} className="space-y-6">
              {!hasTokenInUrl && (
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">Access Token</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    placeholder="Enter secure link/token"
                    className="w-full bg-brand-gray/50 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all text-center"
                  />
                </div>
              )}

              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2 text-center">Enter Passcode</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••"
                  className="w-full bg-brand-gray/50 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all text-center font-mono tracking-widest"
                />
              </div>

              {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-gold text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-hover hover:shadow-brand-gold/40 transition-all disabled:opacity-50"
              >
                {loading ? "Unlocking..." : "Unlock Deliverables"}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-brand-white p-8 md:p-12 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-gray pb-6 mb-8 gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold bg-brand-cream border border-brand-gold/20 px-3 py-1 rounded-full">
                  VIP Delivery
                </span>
                <h1 className="font-serif text-3xl font-bold text-brand-charcoal mt-3">{project.name}</h1>
                {project.description && (
                  <p className="text-brand-dark-gray text-sm font-light mt-1">{project.description}</p>
                )}
              </div>
              <div className="flex items-center text-xs text-brand-dark-gray bg-brand-gray/50 px-4 py-2 rounded-xl shrink-0">
                <Calendar className="w-4 h-4 mr-2 text-brand-gold" />
                <span>Expires: {new Date(project.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold text-brand-charcoal mb-4">Your Files</h3>
              
              {parsedFiles.length === 0 ? (
                <p className="text-brand-dark-gray text-sm font-light py-6 text-center">No files are attached to this delivery.</p>
              ) : (
                <div className="divide-y divide-brand-gray">
                  {parsedFiles.map((file, index) => (
                    <div key={index} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-cream border border-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-brand-charcoal truncate max-w-[200px] md:max-w-md">{file.name}</p>
                          {file.size && <p className="text-[10px] text-brand-dark-gray mt-0.5">{file.size}</p>}
                        </div>
                      </div>
                      
                      <a
                        href={file.url}
                        download
                        onClick={handleDownloadClick}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 border border-brand-gold/30 rounded-full text-brand-gold hover:bg-brand-gold hover:text-white transition-all text-xs font-semibold flex items-center shrink-0"
                      >
                        <Download size={14} className="mr-1.5" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-brand-gray flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <p className="text-xs text-brand-dark-gray font-light max-w-md">
                All visual materials are stored with high-luxury optimized bandwidth. Please download your materials before the expiry date.
              </p>
              <button
                onClick={() => setProject(null)}
                className="px-6 py-2 bg-brand-gray text-brand-charcoal rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-brand-gold hover:text-white transition-all"
              >
                Exit Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
