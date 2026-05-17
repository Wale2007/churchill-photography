"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const categories = ["All", "Lifestyle", "Weddings", "Corporate", "Studio", "Events"];

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      try {
        const res = await fetch(`/api/portfolio?category=${selectedCategory === "All" ? "" : selectedCategory}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, [selectedCategory]);

  return (
    <div className="py-24 md:py-32 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-brand-charcoal mb-6">Our Portfolio</h1>
          <p className="text-brand-dark-gray text-lg font-light leading-relaxed">
            A curated showcase of our finest visual stories. Discover elegance, raw emotion, and high luxury captured in high-definition.
          </p>
          <div className="w-24 h-1 bg-brand-gold mx-auto mt-6"></div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-widest uppercase border transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-brand-gold text-white border-brand-gold shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                  : "bg-white text-brand-charcoal border-brand-gray hover:border-brand-gold"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-brand-dark-gray/60 font-light">
            <p className="text-lg">No assets uploaded in this category yet.</p>
            <p className="text-sm mt-2">Visit the admin panel to populate your premium portfolio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-brand-white shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-gray">
                  {/* Cloudinary Optimization later */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-brand-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-brand-gold">
                    {item.category}
                  </div>
                </div>
                <div className="p-6 border-t border-brand-gray/50 bg-white">
                  <h3 className="font-serif text-xl font-semibold text-brand-charcoal">{item.title}</h3>
                  {item.description && (
                    <p className="text-brand-dark-gray text-xs mt-2 font-light leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
