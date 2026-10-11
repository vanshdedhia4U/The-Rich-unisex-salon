import React, { useState } from 'react';
import { Scissors, Calendar, User, Shield, Menu, X, Phone, MapPin } from 'lucide-react';
import { SalonSettings } from '../types';

interface HeaderProps {
  settings: SalonSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeTab,
  setActiveTab,
  onOpenBooking,
  isAdmin,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'services', label: 'Services' },
    { id: 'lookbook', label: 'Lookbook' },
    { id: 'experience', label: 'Experience' },
    { id: 'location', label: 'Location' },
    { id: 'client-portal', label: 'My Bookings' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-amber-950/40 border-b border-amber-900/30 px-4 py-1.5 text-xs text-amber-200/90 text-center flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Shivdham Complex, Station Rd, Ambernath East</span>
        </span>
        <span className="hidden sm:inline text-amber-500/50">·</span>
        <span className="hidden sm:inline flex items-center gap-1.5">
          <Phone className="w-3 h-3 text-amber-400 shrink-0" />
          <a href={`tel:${settings.phonePrimary}`} className="hover:underline">{settings.phonePrimary}</a>
        </span>
        <span className="text-amber-500/50">·</span>
        <span className="font-medium text-amber-300">Tue–Sun: 8:00 AM – 11:00 PM</span>
      </div>

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors">
            <Scissors className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
              THE RICH
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans">
              UNISEX SALON
            </div>
          </div>
        </button>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`hover:text-amber-300 transition-colors py-1 relative whitespace-nowrap shrink-0 ${
                activeTab === link.id ? 'text-amber-300 font-semibold' : 'text-stone-300'
              }`}
            >
              {link.label}
              {activeTab === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action button + Admin access */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Admin shortcut button */}
          <button
            onClick={onOpenAdmin}
            title={isAdmin ? "Owner Admin Portal (Logged In)" : "Owner Admin Access"}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline whitespace-nowrap text-xs">
              {isAdmin ? 'Admin Portal' : 'Owner'}
            </span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-lg hover:from-amber-200 hover:to-amber-400 transition-all shadow-md shadow-amber-500/10 flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-4 h-4 text-stone-950" />
            <span>Book Appointment</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-300 hover:text-white lg:hidden rounded-lg hover:bg-stone-900 border border-transparent hover:border-stone-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-stone-900 text-amber-300 font-semibold'
                    : 'text-stone-300 hover:bg-stone-900/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex-1 px-3 py-2 text-xs text-stone-300 bg-stone-900 rounded-lg border border-stone-800 flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner Admin Portal</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="flex-1 px-3 py-2 text-xs font-semibold text-stone-950 bg-amber-400 rounded-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
