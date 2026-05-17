"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-panel py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.PNG" alt="Churchill Concept Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-full border border-brand-gold/30 bg-transparent shadow-sm invert" />
          <span className="font-serif text-lg md:text-2xl font-bold tracking-wider text-brand-charcoal">
            CHURCHILL <span className="text-brand-gold">CONCEPT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-sm tracking-widest uppercase transition-colors ${
                pathname === link.path
                  ? "text-brand-gold font-semibold"
                  : "text-brand-charcoal hover:text-brand-gold"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://wa.me/2349152907929"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-colors duration-300 rounded-full text-sm tracking-widest uppercase"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-charcoal"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-white/20 py-6 px-6 flex flex-col space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className={`text-sm tracking-widest uppercase block ${
                pathname === link.path
                  ? "text-brand-gold font-semibold"
                  : "text-brand-charcoal"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
