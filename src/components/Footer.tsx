import React from 'react';
import { Scissors, MapPin, Phone, Shield, ArrowUp } from 'lucide-react';
import { SalonSettings } from '../types';

interface FooterProps {
  settings: SalonSettings;
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenBooking,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-850 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-base text-stone-100">
                THE RICH UNISEX SALON
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Luxury hair styling, dimensional coloring, Botoplex therapy, and grooming lounge at Shivdham Complex, Station Road, Ambernath East.
            </p>
            <div className="pt-1 text-stone-300 font-mono text-[11px]">
              Google Rating: 4.9 ★ (70+ Reviews)
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Quick Navigation
            </div>
            <ul className="space-y-1.5 text-stone-400">
              <li><a href="#services" className="hover:text-amber-300 transition-colors">Hair & Skin Services</a></li>
              <li><a href="#lookbook" className="hover:text-amber-300 transition-colors">Lookbook Gallery</a></li>
              <li><a href="#experience" className="hover:text-amber-300 transition-colors">The Salon Experience</a></li>
              <li><a href="#location" className="hover:text-amber-300 transition-colors">Location & Directions</a></li>
              <li><a href="#client-portal" className="hover:text-amber-300 transition-colors">Client Appointment Hub</a></li>
            </ul>
          </div>

          {/* Hours & Visiting */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Operating Hours
            </div>
            <div className="text-stone-300 font-medium">Tuesday through Sunday</div>
            <div className="text-amber-300 font-mono font-semibold">8:00 AM – 11:00 PM</div>
            <div className="text-stone-500 text-[11px] pt-1">
              Monday Closed · Advance reservations recommended for weekend slots.
            </div>
          </div>

          {/* Address & Appointments */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Contact & Bookings
            </div>
            <div className="text-stone-300">
              <a href={`tel:${settings.phonePrimary}`} className="hover:underline font-mono">
                {settings.phonePrimary}
              </a>
            </div>
            <div className="text-stone-400 text-[11px]">
              {settings.addressLine1}, {settings.addressLine2}
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-xs transition-colors"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with discrete Owner link */}
        <div className="pt-8 border-t border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} {settings.salonName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner Portal ({settings.ownerEmail})</span>
            </button>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="hover:text-stone-300 flex items-center gap-1 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
