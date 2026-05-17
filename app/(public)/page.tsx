import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  let featuredItems = [];
  try {
    featuredItems = await prisma.portfolio.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to fetch featured items:", error);
  }

  // Safe elegant luxury fallback placeholders if no items are featured in database yet
  const displayItems = featuredItems.length > 0 ? featuredItems : [
    {
      id: "placeholder-1",
      title: "Luxury Wedding",
      category: "Weddings",
      description: "Lifestyle & Romance",
      imageUrl: "",
      isPlaceholder: true,
    },
    {
      id: "placeholder-2",
      title: "Editorial Portrait",
      category: "Studio",
      description: "Vogue & High Fashion",
      imageUrl: "",
      isPlaceholder: true,
    },
    {
      id: "placeholder-3",
      title: "Corporate Showcase",
      category: "Corporate",
      description: "Minimalist Campaign",
      imageUrl: "",
      isPlaceholder: true,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Abstract glowing background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-brand-cream/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-brand-charcoal leading-tight mb-6">
            Elegance in <br /> <span className="gold-gradient">Every Frame</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-dark-gray max-w-2xl mx-auto mb-10 font-light tracking-wide">
            Premium lifestyle, wedding, and corporate photography tailored to capture your most extraordinary moments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/2349152907929" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-semibold tracking-widest uppercase text-sm shadow-[0_8px_30px_rgb(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgb(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Book Your Shoot
            </a>
            <Link 
              href="/portfolio" 
              className="px-8 py-4 bg-white text-brand-charcoal rounded-full font-semibold tracking-widest uppercase text-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex items-center group"
            >
              View Portfolio
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-24 bg-brand-white relative z-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">Featured Work</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayItems.map((item: any, index: number) => (
              <div key={item.id || index} className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 bg-brand-cream border border-brand-gray/30">
                {item.imageUrl && !item.isPlaceholder ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <span className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-1">{item.category}</span>
                      <h3 className="text-white font-serif text-2xl font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h3>
                      {item.description && (
                        <p className="text-white/80 text-sm mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.description}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-cream to-brand-white flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold mb-2">{item.category}</span>
                    <h3 className="font-serif text-xl font-bold text-brand-charcoal mb-1">{item.title}</h3>
                    <span className="text-xs text-brand-dark-gray/60 italic">{item.description}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/portfolio"
              className="inline-flex items-center text-brand-gold font-semibold tracking-widest uppercase hover:text-brand-gold-hover transition-colors"
            >
              Explore Full Gallery
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the Artist Section */}
      <section className="py-24 bg-brand-white relative z-20 border-t border-brand-gray">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: Beautiful Image Container */}
            <div className="relative group max-w-sm mx-auto md:mx-0">
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold to-amber-200 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-4 border-white shadow-2xl bg-brand-gray">
                <img 
                  src="/churchill.jpeg" 
                  alt="Churchill - Founder & Lead Photographer" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right: Premium Bio Text */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Behind The Lens</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-charcoal">Meet Churchill</h2>
              <p className="text-brand-dark-gray leading-relaxed font-light">
                Founder and lead visionary behind Churchill Concept Photography. With a passion for light luxury aesthetics, Churchill merges fine art photography with modern editorial narratives to capture moments that transcend standard visual capture.
              </p>
              <p className="text-brand-dark-gray leading-relaxed font-light">
                Specializing in luxury lifestyles, high-fashion editorials, and premium weddings, Churchill works closely with each client to manifest their unique story into everlasting visual gold.
              </p>
              <div className="pt-4">
                <a 
                  href="https://wa.me/2349152907929" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-all rounded-full text-xs font-semibold tracking-widest uppercase"
                >
                  Connect with Churchill <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial / Brand Philosophy */}
      <section className="py-24 bg-brand-cream relative z-20">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <Star className="w-8 h-8 text-brand-gold mx-auto mb-8" />
          <h3 className="font-serif text-3xl md:text-4xl leading-relaxed text-brand-charcoal font-medium">
            "Churchill Concept brings an unparalleled level of sophistication and artistry to every shoot. The results are nothing short of breathtaking."
          </h3>
          <p className="mt-8 text-brand-dark-gray font-semibold tracking-widest uppercase text-sm">
            - A Happy Client
          </p>
        </div>
      </section>
    </div>
  );
}
