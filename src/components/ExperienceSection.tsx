import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  HeartHandshake, 
  Check, 
  Calendar 
} from 'lucide-react';
import { Stylist } from '../types';
import { getAssetUrl } from '../lib/asset';

interface ExperienceSectionProps {
  stylists: Stylist[];
  onOpenBooking: () => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  stylists,
  onOpenBooking,
}) => {
  return (
    <section id="experience" className="py-16 lg:py-24 bg-stone-900/40 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Experience Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
            The Rich Philosophy
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
            Craftsmanship, Hygiene & Uncompromising Luxury
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-2 font-sans">
            We reject the hurried, transactional barbershop model in favor of deliberate precision, consultation-led artistry, and world-class formulation.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-100">Certified Master Artistry</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every stylist on our floor has completed rigorous advanced masterclasses in European balayage painting, Vidal Sassoon precision cutting, and advanced trichology therapies.
            </p>
            <div className="pt-2 text-xs text-amber-300/90 font-mono font-medium">
              Average 7+ Years Experience
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-100">100% Medical Grade Hygiene</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              All shears, razors, and implements undergo medical-grade autoclave sterilization. We utilize disposable neck strips, sanitized biodegradable capes, and single-use facial kits.
            </p>
            <div className="pt-2 text-xs text-amber-300/90 font-mono font-medium">
              Autoclave & UV Sanitized
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-100">Pure Ammonia-Free Formulas</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Zero harsh chemical fumes, zero scalp burning. We partner exclusively with premium international color houses and organic protein treatments to safeguard your hair fiber.
            </p>
            <div className="pt-2 text-xs text-amber-300/90 font-mono font-medium">
              L'Oréal Professionnel & Olaplex
            </div>
          </div>
        </div>

        {/* Visual Feature Split: Salon Floor and Stations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-950 p-6 sm:p-8 rounded-2xl border border-stone-800">
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-xl">
            <img
              src={getAssetUrl('images/salon_chair.jpg')}
              alt="The Rich Unisex Salon Styling Stations"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs">
              <span className="font-serif font-bold text-stone-100 text-sm block">Private Styling Bays</span>
              <span className="text-stone-400">Ergonomic Italian leather reclining wash and styling chairs</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Atmosphere & Hospitality
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              An Oasis Crafted for Rest and Rejuvenation
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              Step away from the bustle of the city into our climate-controlled salon suites at Shivdham Complex on Station Road. Every appointment is paired with a complimentary cup of fresh artisan coffee or calming jasmine green tea, soft ambient acoustics, and unhurried master consultation.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Dedicated Men’s & Women’s Grooming Zones</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Private Bridal & Pre-Wedding Suite</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Child-Friendly Styling Chairs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Master Stylists Team Showcase */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
                Meet The Artists
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-100">
                Our Senior Stylists & Color Directors
              </h3>
            </div>
            <button
              onClick={onOpenBooking}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Schedule with a specific artist</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stylists.map((st) => (
              <div
                key={st.id}
                className="p-5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/30 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  {/* Stylist Initials Portrait Badge */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-300 font-serif text-lg font-bold mb-3 shadow-md">
                    {st.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-stone-100 text-sm">{st.name}</h4>
                    <span className="text-xs text-amber-400 font-mono font-semibold">★ {st.rating}</span>
                  </div>

                  <div className="text-xs text-amber-300/80 font-medium mt-0.5">{st.role}</div>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    {st.specialty}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-850 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span>{st.experienceYears}+ Yrs Practice</span>
                  <span className="text-emerald-400 font-semibold">Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
