import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Check, 
  Plus, 
  Sparkles, 
  Scissors, 
  ChevronRight,
  SlidersHorizontal 
} from 'lucide-react';
import { SalonService, ServiceCategory, GenderTarget } from '../types';

interface ServicesSectionProps {
  services: SalonService[];
  selectedServiceIds: string[];
  onToggleService: (service: SalonService) => void;
  onInstantBook: (service: SalonService) => void;
  onOpenBookingTray: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  selectedServiceIds,
  onToggleService,
  onInstantBook,
  onOpenBookingTray,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<GenderTarget | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'haircut', label: 'Haircuts & Styling' },
    { id: 'haircolor', label: 'Hair Colour & Balayage' },
    { id: 'treatment', label: 'Keratin & Botoplex' },
    { id: 'skin', label: 'Facials & Dermal Care' },
    { id: 'beard', label: 'Beard & Men’s Lounge' },
    { id: 'spa', label: 'Nails & Pedicure' },
    { id: 'bridal', label: 'Bridal & Groom Royale' },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      // Category filter
      if (activeCategory !== 'all' && srv.category !== activeCategory) {
        return false;
      }
      // Gender filter
      if (genderFilter !== 'all') {
        if (genderFilter === 'women' && srv.gender !== 'women' && srv.gender !== 'unisex') return false;
        if (genderFilter === 'men' && srv.gender !== 'men' && srv.gender !== 'unisex') return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = srv.name.toLowerCase().includes(query);
        const matchesDesc = srv.description.toLowerCase().includes(query);
        const matchesCategory = srv.categoryLabel.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    });
  }, [services, activeCategory, genderFilter, searchQuery]);

  return (
    <section id="services" className="py-16 lg:py-24 bg-stone-950 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              Bespoke Hair, Skin & Wellness
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
              Essential Service Menu & Pricing
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl font-sans">
              Every service includes a personalized consultation, hair & scalp diagnosis, and premium international salon products. Select one or bundle multiple services.
            </p>
          </div>

          {/* Booking Tray summary badge if services selected */}
          {selectedServiceIds.length > 0 && (
            <button
              onClick={onOpenBookingTray}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2 text-sm shrink-0 transition-all animate-pulse"
            >
              <span>{selectedServiceIds.length} Service{selectedServiceIds.length > 1 ? 's' : ''} in Booking Tray</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls bar */}
        <div className="space-y-4 mb-8">
          {/* Search bar & Gender filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. balayage, botoplex, fade, hydra)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Gender Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-stone-900 rounded-lg border border-stone-800 self-start sm:self-auto">
              {(['all', 'women', 'men'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                    genderFilter === g
                      ? 'bg-amber-400 text-stone-950 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {g === 'all' ? 'All Clients' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs (Interactive Segmented buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                  activeCategory === cat.id
                    ? 'bg-stone-800 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-stone-800 rounded-2xl bg-stone-900/30">
            <SlidersHorizontal className="w-8 h-8 text-stone-500 mx-auto mb-3" />
            <h3 className="text-base font-medium text-stone-200">No services match your criteria</h3>
            <p className="text-xs text-stone-400 mt-1">Try resetting the search keywords or filters.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setGenderFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium bg-stone-800 text-amber-300 rounded-lg border border-stone-700 hover:bg-stone-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);

              return (
                <div
                  key={service.id}
                  className={`flex flex-col justify-between rounded-xl border p-5 transition-all relative ${
                    isSelected
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/5'
                      : 'bg-stone-900/70 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900'
                  }`}
                >
                  <div>
                    {/* Top metadata line (Unboxed zero-pill text) */}
                    <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-medium">{service.categoryLabel}</span>
                        <span aria-hidden="true" className="text-stone-600">·</span>
                        <span className="capitalize">{service.gender}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-stone-400">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span className="tabular-nums">{service.durationMinutes} min</span>
                      </div>
                    </div>

                    {/* Service Name */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-lg font-bold text-stone-100 leading-snug">
                        {service.name}
                      </h3>
                      {service.popular && (
                        <span className="text-[11px] font-sans font-semibold text-amber-400 shrink-0">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-300 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Bullet Benefits */}
                    <div className="space-y-1.5 mb-5 border-t border-stone-800/60 pt-3">
                      {service.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-400">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action row */}
                  <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-amber-300 font-sans tabular-nums">
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                        {service.originalPrice && (
                          <span className="text-xs text-stone-500 line-through tabular-nums">
                            ₹{service.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400">Taxes included</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle in tray button */}
                      <button
                        onClick={() => onToggleService(service)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750 hover:text-white'
                        }`}
                        title={isSelected ? 'Remove from booking tray' : 'Add to multi-service booking'}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-amber-400" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-stone-400" />
                            <span>Add</span>
                          </>
                        )}
                      </button>

                      {/* Instant Book CTA */}
                      <button
                        onClick={() => onInstantBook(service)}
                        className="px-3.5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
