import React from 'react';
import { Star, MapPin, Calendar, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { SalonSettings } from '../types';

interface HeroProps {
  settings: SalonSettings;
  onOpenBooking: () => void;
  onExploreServices: () => void;
  onExploreLookbook: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenBooking,
  onExploreServices,
  onExploreLookbook,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-stone-800/80 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust and location badge */}
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 text-xs text-stone-300">
              <span className="flex items-center text-amber-400 font-semibold gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.9 / 5.0</span>
              </span>
              <span className="text-stone-600">·</span>
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Shivdham Complex, Station Rd, Ambernath East</span>
              </a>
              <span className="text-stone-600">·</span>
              <span className="text-amber-300/90 font-medium">4.9★ Rating</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.15]" style={{ textWrap: 'balance' }}>
              Where Precision Haircraft Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Pure Indulgence</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed font-sans">
              Welcome to <strong className="text-amber-200 font-medium">{settings.salonName}</strong> — located at Shivdham Complex on Station Road, Ambernath East. Experience bespoke hair artistry, French balayage, restorative Botoplex therapies, and luxury grooming lounges.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-semibold rounded-lg hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/15 flex items-center justify-center gap-2 group text-base"
              >
                <Calendar className="w-5 h-5 text-stone-950" />
                <span>Book Your Appointment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-medium rounded-lg border border-stone-800 hover:border-stone-700 transition-colors flex items-center justify-center gap-2 text-base"
              >
                <span>View Full Menu & Rates</span>
              </button>
            </div>

            {/* Proof Points Strip */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-stone-800/80 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Ammonia-Free Colors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Certified Master Stylists</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live Slot Confirmation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Luxury Salon Showcase Container (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Decorative luxury architectural banner header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs uppercase tracking-widest text-amber-300/80 font-medium font-sans">
                    Sanctuary Experience
                  </span>
                </div>
                <span className="text-xs text-stone-400 font-mono">Station Rd, Ambernath</span>
              </div>

              {/* High-Resolution Photographic Salon Showcase - Vibrant Natural Color */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-amber-500/30 group shadow-2xl">
                {/* Real Vibrant Color Salon Photography */}
                <img
                  src="/images/salon_interior.jpg"
                  alt="The Rich Unisex Salon Interior - Ambernath"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-105 contrast-105"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle gradient scrim only at top and bottom for crisp readability */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-stone-950/80 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent pointer-events-none" />

                {/* Overlay Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="px-3 py-1.5 rounded-lg bg-stone-950/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-serif font-bold flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>THE RICH SALON</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-stone-950/90 backdrop-blur-md border border-stone-700 text-right">
                    <div className="text-[11px] font-semibold text-stone-200">8:00 AM – 11:00 PM</div>
                    <div className="text-[10px] text-amber-400 font-medium">Tue–Sun (Mon Closed)</div>
                  </div>
                </div>

                {/* Bottom Overlay Address & Map Link */}
                <div className="absolute bottom-4 left-4 right-4 z-10 bg-stone-950/90 backdrop-blur-md p-3.5 rounded-xl border border-stone-700/80 flex items-center justify-between shadow-xl">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-stone-100 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Shop 12, Shivdham Complex</span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Near Sibbu Place, Station Road, Ambernath East
                    </div>
                  </div>

                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shrink-0 shadow"
                  >
                    <span>Maps</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Photo Showcase Strips: 3 Mini Transformation Thumbnails */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div
                  onClick={onExploreLookbook}
                  className="group/thumb cursor-pointer relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-800 hover:border-amber-400/60 transition-all shadow-md"
                >
                  <img
                    src="/images/hair_balayage.jpg"
                    alt="Hair Color & Balayage"
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-medium text-stone-200">Balayage</span>
                  </div>
                </div>

                <div
                  onClick={onExploreLookbook}
                  className="group/thumb cursor-pointer relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-800 hover:border-amber-400/60 transition-all shadow-md"
                >
                  <img
                    src="/images/mens_fade.jpg"
                    alt="Men Fade Cut"
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-medium text-stone-200">Skin Fade</span>
                  </div>
                </div>

                <div
                  onClick={onExploreLookbook}
                  className="group/thumb cursor-pointer relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-800 hover:border-amber-400/60 transition-all shadow-md"
                >
                  <img
                    src="/images/bridal_hair.jpg"
                    alt="Bridal Styling"
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-medium text-stone-200">Bridal</span>
                  </div>
                </div>
              </div>

              {/* Quick glance counters */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-center">
                  <div className="font-serif text-lg font-bold text-amber-300">4.9★</div>
                  <div className="text-[11px] text-stone-400">Google Rating</div>
                </div>
                <div className="p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-center">
                  <div className="font-serif text-lg font-bold text-amber-300">12,000+</div>
                  <div className="text-[11px] text-stone-400">Clients Served</div>
                </div>
                <div className="p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-center">
                  <div className="font-serif text-lg font-bold text-amber-300">8+ Yrs</div>
                  <div className="text-[11px] text-stone-400">Master Artistry</div>
                </div>
              </div>

              {/* Lookbook quick tease */}
              <button
                onClick={onExploreLookbook}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-amber-300 text-xs font-medium rounded-lg border border-stone-800 flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Browse Recent Client Lookbook & Transformations</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
