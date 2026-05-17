"use client";

import { useState } from "react";
import { Send, PhoneCall, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceType: "Lifestyle",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", serviceType: "Lifestyle", message: "" });
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-brand-charcoal mb-6">Contact Us</h1>
          <p className="text-brand-dark-gray text-lg font-light leading-relaxed">
            Ready to frame your story? Let us build something luxurious and timeless together. Reach out via our request system or message us directly.
          </p>
          <div className="w-24 h-1 bg-brand-gold mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-brand-white p-8 md:p-12 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <h2 className="font-serif text-2xl font-semibold text-brand-charcoal mb-8">Send a Message</h2>
            
            {success ? (
              <div className="text-center py-12 flex flex-col items-center">
                <CheckCircle className="w-16 h-16 text-brand-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-brand-charcoal">Message Sent!</h3>
                <p className="text-brand-dark-gray text-sm font-light mt-3 max-w-sm">
                  Thank you for contacting Churchill Concept. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-8 px-6 py-2 bg-brand-gold text-white font-semibold text-xs tracking-widest uppercase rounded-full hover:bg-brand-gold-hover transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-gray border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-gray border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">Service Type</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full bg-brand-gray border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
                  >
                    <option value="Lifestyle">Lifestyle Portraits</option>
                    <option value="Weddings">Luxury Weddings</option>
                    <option value="Corporate">Corporate Headshots</option>
                    <option value="Birthdays">Birthdays & Milestones</option>
                    <option value="Studio">Creative Studio Session</option>
                    <option value="Events">Premium Events</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-gray border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all resize-none"
                    placeholder="Tell us about your visual concept..."
                  ></textarea>
                </div>

                {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-brand-gold text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-hover hover:shadow-brand-gold/40 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit Inquiry"}
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
            )}
          </div>

          {/* Instant Response Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-amber-50 to-orange-50/50 p-8 md:p-12 rounded-2xl border border-brand-gold/20 shadow-[0_4px_30px_rgba(212,175,55,0.04)]">
            <div>
              <div className="w-12 h-12 bg-white border border-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold mb-6 shadow-sm">
                <PhoneCall size={24} />
              </div>
              <h2 className="font-serif text-3xl font-bold text-brand-charcoal mb-4">Instant Access</h2>
              <p className="text-brand-dark-gray text-sm leading-relaxed font-light mb-8">
                Do you have an urgent inquiry, booking adjustment, or time-sensitive request? Contact our team directly on WhatsApp for real-time consultation.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-xs text-brand-dark-gray">
                  <span className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 mr-3 shrink-0"></span>
                  <span>Instant response from lead photographer</span>
                </li>
                <li className="flex items-start text-xs text-brand-dark-gray">
                  <span className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 mr-3 shrink-0"></span>
                  <span>Schedule flexibility consults instantly</span>
                </li>
                <li className="flex items-start text-xs text-brand-dark-gray">
                  <span className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 mr-3 shrink-0"></span>
                  <span>Direct project coordination</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/2349152907929"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-green-500 text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-green-500/20 hover:bg-green-600 hover:shadow-green-600/40 transition-all flex items-center justify-center text-center"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
