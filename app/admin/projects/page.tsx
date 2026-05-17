"use client";

import { useEffect, useState } from "react";
import { FolderHeart, Key, Calendar, Copy, Check, Trash2, Upload } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  generatedToken: string;
  password: string; // The passcode!
  expiryDate: string;
  createdAt: string;
  _count: {
    analytics: number;
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [expiryDays, setExpiryDays] = useState("30");
  const [deliverableFile, setDeliverableFile] = useState<File | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDeliverableFile(e.target.files[0]);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!deliverableFile && !downloadUrl) {
      setErrorMsg("Please either upload a deliverable file or paste a download link.");
      setCreating(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("clientName", clientName);
      formData.append("projectName", projectName);
      formData.append("passcode", passcode);
      formData.append("expiryDays", expiryDays);
      if (downloadUrl) formData.append("downloadUrl", downloadUrl);
      if (deliverableFile) formData.append("file", deliverableFile);

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("VIP Client Delivery created successfully!");
        setClientName("");
        setProjectName("");
        setPasscode("");
        setDownloadUrl("");
        setExpiryDays("30");
        setDeliverableFile(null);
        // Reset file input element
        const fileInput = document.getElementById("deliverable-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        fetchProjects();
      } else {
        setErrorMsg(data.error || "Failed to create project delivery.");
      }
    } catch (err) {
      setErrorMsg("Server connection failure.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to revoke and delete access for this client?")) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        alert(data.error || "Failed to revoke access.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleCopyLink = (passcode: string, id: string) => {
    const fullUrl = `${window.location.origin}/downloads?passcode=${passcode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Title Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-brand-charcoal">Client VIP Deliveries</h1>
        <p className="text-brand-dark-gray text-xs tracking-wider uppercase font-medium mt-1">
          Create secure, time-limited download tokens and passcodes for VIP client packages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Delivery Form */}
        <div className="lg:col-span-4 bg-brand-white p-8 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)] h-fit">
          <h3 className="font-serif text-2xl font-semibold text-brand-charcoal border-b border-brand-gray pb-6 mb-6">
            New Client Delivery
          </h3>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                Client Name
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full bg-brand-gray/50 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                Project Name
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Editorial Fashion Shoot 2026"
                className="w-full bg-brand-gray/50 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                VIP Access Passcode
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. 5982"
                  className="w-full bg-brand-gray/50 border border-transparent rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all font-mono tracking-widest"
                />
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark-gray/60" size={16} />
              </div>
            </div>

            {/* Direct File Upload option */}
            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                Upload Deliverable File (ZIP / Image)
              </label>
              <div className="relative border-2 border-dashed border-brand-gray rounded-xl p-4 hover:border-brand-gold transition-colors text-center cursor-pointer bg-brand-gray/20">
                <input
                  type="file"
                  id="deliverable-upload"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <Upload className="mx-auto text-brand-dark-gray/60" size={20} />
                  <p className="text-xs text-brand-dark-gray truncate max-w-[200px] mx-auto">
                    {deliverableFile ? deliverableFile.name : "Direct upload (ZIP/JPEGs)"}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-brand-dark-gray font-light uppercase tracking-widest py-1 border-y border-brand-gray/50">
              - OR LINK TO FILE -
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                External Link URL (Optional)
              </label>
              <input
                type="url"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="e.g. https://drive.google.com/..."
                className="w-full bg-brand-gray/50 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">
                Expiration (Days)
              </label>
              <div className="relative">
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full bg-brand-gray/50 border border-transparent rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                </select>
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark-gray/60 pointer-events-none" size={16} />
              </div>
            </div>

            {successMsg && (
              <div className="text-green-600 bg-green-50 p-3 rounded-xl border border-green-200 text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="text-red-500 bg-red-50 p-3 rounded-xl border border-red-200 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="w-full py-4 bg-brand-gold text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-brand-gold/10 hover:bg-brand-gold-hover transition-all disabled:opacity-50"
            >
              {creating ? "Processing & Uploading..." : "Generate Delivery"}
            </button>
          </form>
        </div>

        {/* Deliveries List Grid */}
        <div className="lg:col-span-8 bg-brand-white p-8 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
          <h3 className="font-serif text-2xl font-semibold text-brand-charcoal border-b border-brand-gray pb-6 mb-6">
            Active Deliveries ({projects.length})
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <FolderHeart className="mx-auto text-brand-dark-gray/30" size={48} />
              <p className="text-brand-dark-gray text-sm font-light">No client deliveries generated yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => {
                const isExpired = new Date(project.expiryDate) < new Date();
                return (
                  <div
                    key={project.id}
                    className={`p-6 rounded-2xl border transition-all ${
                      isExpired
                        ? "border-red-200 bg-red-50/10"
                        : "border-brand-gray bg-brand-white hover:border-brand-gold/30 shadow-[0_2px_15px_rgba(0,0,0,0.01)]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-serif font-bold text-brand-charcoal">{project.name}</h4>
                          <span
                            className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold border ${
                              isExpired
                                ? "bg-red-50 border-red-200 text-red-500"
                                : "bg-green-50 border-green-200 text-green-600"
                            }`}
                          >
                            {isExpired ? "Expired" : "Active"}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-xs text-brand-dark-gray mt-1 font-medium">{project.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-[10px] text-brand-dark-gray font-light">
                          <span>
                            Accesses: <strong className="font-semibold">{project._count.analytics}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Expires: <strong className="font-semibold">{new Date(project.expiryDate).toLocaleDateString()}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleCopyLink(project.password, project.id)}
                          disabled={isExpired}
                          className="flex items-center gap-2 px-4 py-2 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-all rounded-full text-[10px] font-semibold tracking-widest uppercase disabled:opacity-30 disabled:pointer-events-none"
                        >
                          {copiedId === project.id ? (
                            <>
                              <Check size={12} /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy URL
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 border border-red-200 text-red-500 hover:bg-red-50 transition-all rounded-full"
                          title="Revoke access"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
