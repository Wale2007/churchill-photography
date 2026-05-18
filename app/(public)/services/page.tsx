import { Camera, Heart, Briefcase, Gift, Home, Calendar } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Lifestyle",
    icon: Camera,
    description: "Natural, storytelling portraits that express your authentic self and capture your unique beauty in elegant environments.",
    details: ["1.5 Hour Session", "30 Edited High-Res Images", "1 Location", "Online Gallery"],
  },
  {
    title: "Weddings",
    icon: Heart,
    description: "Premium editorial wedding coverage capturing love stories with romance, luxury, and artistic timing.",
    details: ["Full Day Coverage", "Second Photographer", "Engagement Session Included", "Premium Photo Book"],
  },
  {
    title: "Corporate",
    icon: Briefcase,
    description: "High-end corporate portraits, team photos, and brand narrative assets that elevate your business profile.",
    details: ["Professional Headshots", "Office Environment Shoots", "Commercial Usage Rights", "Express Delivery"],
  },
  {
    title: "Birthdays & Celebrations",
    icon: Gift,
    description: "Vibrant and elegant event documentation to immortalize your milestones and joyous birthday moments.",
    details: ["3 Hours Coverage", "50+ Edited Photos", "Live Action & Candid Shots", "Digital Delivery"],
  },
  {
    title: "Studio Session",
    icon: Home,
    description: "Controlled luxury studio photography with high-end lighting setups and professional background designs.",
    details: ["2 Hour Studio Time", "2 Outfit Changes", "15 Fine Art Retouched Images", "Creative Art Direction"],
  },
  {
    title: "Events & Concerts",
    icon: Calendar,
    description: "Dynamic and immersive documentation of premium concerts, fashion shows, corporate events, and galas.",
    details: ["Comprehensive Event Coverage", "High-Resolution Candid Shots", "Next-Day Highlight Delivery", "Online Proofing Gallery"],
  },
];

export default function ServicesPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-brand-charcoal mb-6">Our Services</h1>
          <p className="text-brand-dark-gray text-lg font-light leading-relaxed">
            Discover our premium, bespoke photography packages tailored to preserve your special memories with absolute artistry and elegance.
          </p>
          <div className="w-24 h-1 bg-brand-gold mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-brand-white p-8 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.08)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-brand-cream border border-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-brand-charcoal mb-4">{service.title}</h3>
                  <p className="text-brand-dark-gray text-sm leading-relaxed mb-6 font-light">{service.description}</p>
                  
                  <ul className="space-y-2 mb-8">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-brand-dark-gray flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-2"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center max-w-xl mx-auto p-8 rounded-2xl glass-panel border border-brand-gold/10">
          <h3 className="font-serif text-2xl font-semibold text-brand-charcoal mb-2">Looking for a custom package?</h3>
          <p className="text-brand-dark-gray text-sm font-light mb-6">
            We are always happy to tailor a bespoke photography experience that fits your exact creative vision and production requirements.
          </p>
          <a
            href="https://wa.me/2349152907929"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-brand-gold text-white font-semibold tracking-widest uppercase text-xs rounded-full shadow-md hover:bg-brand-gold-hover transition-colors"
          >
            Customize via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
