"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderHeart, Download, Inbox, Image as ImageIcon, ArrowRight, User } from "lucide-react";

interface DashboardStats {
  activeProjects: number;
  totalDownloads: number;
  unreadMessages: number;
  totalPortfolio: number;
  recentMessages: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Active Deliveries",
      value: stats?.activeProjects || 0,
      icon: FolderHeart,
      color: "text-amber-600 bg-amber-50 border-amber-200/50",
      path: "/admin/projects",
    },
    {
      name: "Total Accesses",
      value: stats?.totalDownloads || 0,
      icon: Download,
      color: "text-green-600 bg-green-50 border-green-200/50",
      path: "/admin/analytics",
    },
    {
      name: "Unread Messages",
      value: stats?.unreadMessages || 0,
      icon: Inbox,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200/50",
      path: "/admin/messages",
    },
    {
      name: "Portfolio Assets",
      value: stats?.totalPortfolio || 0,
      icon: ImageIcon,
      color: "text-purple-600 bg-purple-50 border-purple-200/50",
      path: "/admin/portfolio",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Title */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-brand-charcoal">Studio Overview</h1>
        <p className="text-brand-dark-gray text-xs tracking-wider uppercase font-medium mt-1">
          Welcome back to Churchill Concept Administration
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.name}
              href={card.path}
              className="bg-brand-white p-6 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between"
            >
              <div>
                <span className="text-brand-dark-gray text-xs font-semibold tracking-wider uppercase">{card.name}</span>
                <h3 className="text-3xl font-bold text-brand-charcoal mt-2">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon size={20} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-8 bg-brand-white p-8 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between border-b border-brand-gray pb-6 mb-6">
            <h3 className="font-serif text-2xl font-semibold text-brand-charcoal">Recent Inquiries</h3>
            <Link
              href="/admin/messages"
              className="text-brand-gold text-xs font-semibold tracking-widest uppercase flex items-center hover:text-brand-gold-hover"
            >
              View Inbox <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {!stats?.recentMessages || stats.recentMessages.length === 0 ? (
            <p className="text-brand-dark-gray text-sm font-light py-12 text-center">No contact form messages yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${
                    msg.isRead ? "border-brand-gray bg-brand-gray/10" : "border-brand-gold/20 bg-brand-cream/30"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-cream border border-brand-gold/10 flex items-center justify-center shrink-0 text-brand-gold">
                    <User size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-sm font-semibold text-brand-charcoal truncate">{msg.name}</h4>
                      <span className="text-[10px] text-brand-dark-gray shrink-0 font-medium bg-brand-cream border border-brand-gold/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {msg.serviceType}
                      </span>
                    </div>
                    <p className="text-xs text-brand-dark-gray mt-1 truncate">{msg.message}</p>
                    <span className="text-[9px] text-brand-dark-gray/60 block mt-2">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 bg-brand-white p-8 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-brand-charcoal border-b border-brand-gray pb-6 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link
                href="/admin/projects"
                className="w-full py-4 px-6 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-all rounded-xl text-center block text-xs font-semibold tracking-widest uppercase"
              >
                Create Delivery
              </Link>
              <Link
                href="/admin/portfolio"
                className="w-full py-4 px-6 bg-brand-gold text-white hover:bg-brand-gold-hover transition-all rounded-xl text-center block text-xs font-semibold tracking-widest uppercase shadow-md shadow-brand-gold/10"
              >
                Upload Gallery Asset
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-brand-gray text-center">
            <span className="text-[9px] text-brand-dark-gray/60 uppercase tracking-widest font-semibold">
              Churchill Concept v1.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
