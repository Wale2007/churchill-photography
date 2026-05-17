"use client";

import { useEffect, useState } from "react";
import { BarChart3, Clock } from "lucide-react";

interface AnalyticRecord {
  id: string;
  projectId: string;
  downloadCount: number;
  lastAccessTime: string | null;
  project: {
    name: string;
    description: string | null;
  };
}

export default function AdminAnalyticsPage() {
  const [records, setRecords] = useState<AnalyticRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecords(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-12">
      {/* Title Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-brand-charcoal">Download Telemetry</h1>
        <p className="text-brand-dark-gray text-xs tracking-wider uppercase font-medium mt-1">
          Monitor and track VIP deliverable access events and download telemetry
        </p>
      </div>

      <div className="bg-brand-white p-8 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
        <h3 className="font-serif text-2xl font-semibold text-brand-charcoal border-b border-brand-gray pb-6 mb-6">
          Access Log Feed
        </h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <BarChart3 className="mx-auto text-brand-dark-gray/30" size={48} />
            <p className="text-brand-dark-gray text-sm font-light">No accesses or downloads logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-gray pb-4">
                  <th className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray py-4">Client / Project</th>
                  <th className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray py-4">Last Access Time</th>
                  <th className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray py-4 text-right">Access Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray/30">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-brand-gray/10 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-serif font-bold text-brand-charcoal text-sm">{rec.project.name}</div>
                      {rec.project.description && (
                        <div className="text-xs text-brand-dark-gray mt-0.5">{rec.project.description}</div>
                      )}
                    </td>
                    <td className="py-4 text-xs text-brand-charcoal font-medium">
                      <div className="flex items-center gap-1.5 text-brand-dark-gray">
                        <Clock size={12} />
                        {rec.lastAccessTime ? new Date(rec.lastAccessTime).toLocaleString() : "Never accessed"}
                      </div>
                    </td>
                    <td className="py-4 text-sm font-bold text-brand-gold text-right">
                      {rec.downloadCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
