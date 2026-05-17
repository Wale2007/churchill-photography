"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderHeart,
  BarChart3,
  Inbox,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // If we are on the login page, don't show the sidebar!
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Portfolio", path: "/admin/portfolio", icon: ImageIcon },
    { name: "Client Deliveries", path: "/admin/projects", icon: FolderHeart },
    { name: "Download Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Messages Inbox", path: "/admin/messages", icon: Inbox },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-brand-white border-b border-brand-gray/50 px-6 py-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-30">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.PNG" alt="Logo" className="w-8 h-8 object-contain rounded-full border border-brand-gold/20 shadow-sm invert" />
          <span className="font-serif text-lg font-bold tracking-wider text-brand-charcoal">
            CHURCHILL <span className="text-brand-gold">CONCEPT</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-brand-charcoal hover:text-brand-gold transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-20 w-64 bg-brand-white border-r border-brand-gray/50 flex flex-col justify-between shadow-[2px_0_15px_rgba(0,0,0,0.01)] shrink-0`}
      >
        <div>
          {/* Brand Header */}
          <div className="hidden md:block px-8 py-8 border-b border-brand-gray/50">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.PNG" alt="Logo" className="w-12 h-12 object-contain rounded-full border border-brand-gold/20 shadow-sm invert" />
              <span className="font-serif text-xl font-bold tracking-wider text-brand-charcoal block">
                CHURCHILL <span className="text-brand-gold">CONCEPT</span>
              </span>
            </Link>
            <span className="text-[9px] uppercase tracking-widest text-brand-dark-gray/60 font-semibold mt-2 block">
              Studio Administrator
            </span>
          </div>

          {/* Nav List */}
          <nav className="px-4 py-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-brand-cream text-brand-gold border-l-4 border-brand-gold"
                      : "text-brand-charcoal hover:bg-brand-gray/50"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-brand-gold" : "text-brand-charcoal/70"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-brand-gray/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200/50 hover:bg-red-50 text-red-500 hover:border-red-500 transition-all rounded-xl text-xs font-semibold tracking-widest uppercase"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main dashboard content area */}
      <main className="flex-1 p-6 md:p-12 relative z-10 overflow-y-auto">
        {children}
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-10"
        />
      )}
    </div>
  );
}
