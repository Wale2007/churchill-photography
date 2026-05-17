import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-white pt-16 pb-8 border-t border-brand-gray mt-auto">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <img src="/logo.PNG" alt="Churchill Concept Logo" className="w-12 h-12 object-contain rounded-full border border-brand-gold/20 shadow-sm invert" />
            <span className="font-serif text-xl font-bold tracking-wider text-brand-charcoal">
              CHURCHILL <span className="text-brand-gold">CONCEPT</span>
            </span>
          </Link>
          <p className="text-brand-dark-gray leading-relaxed max-w-sm">
            Capturing timeless moments with an elegant, luxurious touch. Specializing in lifestyle, corporate, and wedding photography.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-lg font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link href="/portfolio" className="text-brand-dark-gray hover:text-brand-gold transition-colors">Portfolio</Link></li>
            <li><Link href="/services" className="text-brand-dark-gray hover:text-brand-gold transition-colors">Services</Link></li>
            <li><Link href="/contact" className="text-brand-dark-gray hover:text-brand-gold transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h4 className="font-serif text-lg font-semibold mb-6">Get in Touch</h4>
          <ul className="space-y-4">
            <li className="flex items-center text-brand-dark-gray">
              <Mail className="w-5 h-5 mr-3 text-brand-gold" />
              <a href="mailto:churchillconcept@gmail.com" className="hover:text-brand-gold transition-colors">churchillconcept@gmail.com</a>
            </li>
            <li className="flex items-center text-brand-dark-gray">
              <Phone className="w-5 h-5 mr-3 text-brand-gold" />
              <a href="https://wa.me/2349152907929" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">+234 915 290 7929</a>
            </li>
            <li className="flex items-center text-brand-dark-gray mt-6 gap-3">
              <a href="https://www.instagram.com/churchill_concepts" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-brand-gray flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@churchill_concept" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-brand-gray flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-all" title="TikTok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-8 border-t border-brand-gray text-center text-sm text-brand-dark-gray">
        <p>&copy; {new Date().getFullYear()} Churchill Concept Photography. All rights reserved.</p>
      </div>
    </footer>
  );
}
