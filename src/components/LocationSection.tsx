import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  Navigation, 
  Star, 
  Wifi, 
  Coffee, 
  ShieldCheck, 
  Wind,
  Car
} from 'lucide-react';
import { SalonSettings } from '../types';

interface LocationSectionProps {
  settings: SalonSettings;
  onOpenBooking: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  settings,
  onOpenBooking,
}) => {
  return (
    <section id="location" className="py-16 lg:py-24 bg-stone-950 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Location Details & Contact (6 cols) */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
                Visit The Sanctuary
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
                Prime Location on Station Road, Ambernath East
              </h2>
              <p className="text-stone-300 text-sm sm:text-base mt-2 font-sans">
                Conveniently located at Shivdham Complex on Station Road, right near Sibbu Place Family Restaurant, just 2 minutes walking distance from Ambernath East Railway Station.
              </p>
            </div>

            {/* Address & Hours cards */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-stone-400 uppercase font-mono">Salon Address</div>
                  <div className="font-semibold text-stone-100 text-sm mt-0.5">{settings.salonName}</div>
                  <div className="text-stone-300 text-xs mt-0.5">{settings.addressLine1}</div>
                  <div className="text-stone-400 text-xs">{settings.addressLine2}</div>
                  <div className="text-stone-400 text-xs">{settings.city} — PIN {settings.pincode}</div>
                  <div className="text-[11px] text-amber-400 font-medium mt-1">Landmark: Near Sibbu Place Family Restaurant (Station Rd)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 uppercase font-mono">Opening Hours</div>
                    <div className="font-semibold text-stone-100 text-xs mt-0.5">Tuesday – Sunday</div>
                    <div className="text-amber-300 font-mono text-xs font-semibold">8:00 AM – 11:00 PM</div>
                    <div className="text-[11px] text-stone-500">Monday Closed</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 uppercase font-mono">Reception Line</div>
                    <a href={`tel:${settings.phonePrimary}`} className="font-semibold text-amber-300 font-mono text-xs block hover:underline mt-0.5">
                      {settings.phonePrimary}
                    </a>
                    <a href={`tel:${settings.phoneSecondary}`} className="text-stone-400 font-mono text-xs block hover:underline">
                      {settings.phoneSecondary}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities strip */}
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Guest Privileges & Amenities
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-400 pt-1">
                <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-amber-400" /> Climate Controlled</span>
                <span className="flex items-center gap-1.5"><Coffee className="w-3.5 h-3.5 text-amber-400" /> Espresso & Teas</span>
                <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-amber-400" /> High-Speed WiFi</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Medical Sterilization</span>
                <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-amber-400" /> Valet & Parking</span>
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> Private Bridal Pod</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Navigation className="w-4 h-4 text-stone-950" />
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${settings.phonePrimary}`}
                className="px-5 py-3 bg-stone-850 hover:bg-stone-800 text-stone-200 font-medium rounded-lg text-xs sm:text-sm border border-stone-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Salon Reception</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Google Maps Destination Card (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="rounded-2xl border border-stone-800 bg-stone-900 overflow-hidden flex-1 flex flex-col justify-between shadow-2xl relative">
              {/* Live Interactive Google Maps Embed */}
              <div className="relative aspect-[16/11] sm:aspect-auto sm:flex-1 min-h-[340px] bg-stone-950 overflow-hidden">
                <iframe
                  title="The Rich Unisex Salon Google Maps Location"
                  src="https://maps.google.com/maps?q=19.2077651,73.1845372&hl=en&z=16&output=embed"
                  className="w-full h-full border-0 filter contrast-[1.05] grayscale-[0.2]"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Top Badge Floating Card */}
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1.5 rounded-lg bg-stone-950/90 border border-stone-700 backdrop-blur-md flex items-center gap-2 pointer-events-auto shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-stone-200">Open 8:00 AM – 11:00 PM</span>
                  </div>
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1 shadow-md hover:bg-amber-300 pointer-events-auto transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 fill-stone-950" />
                    <span>4.9★ on Maps</span>
                  </a>
                </div>
              </div>

              {/* Bottom footer bar with instant booking prompt & directions */}
              <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-stone-200">Shivdham Complex · Station Road</div>
                  <div className="text-[11px] text-stone-400 font-mono">Near Sibbu Place, Ambernath East (421501)</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-750 text-amber-300 font-medium rounded-lg text-xs border border-stone-700 transition-colors flex items-center gap-1"
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={onOpenBooking}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-xs transition-colors"
                  >
                    Book Seat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
