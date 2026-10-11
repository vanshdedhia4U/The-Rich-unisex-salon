import React, { useState } from 'react';
import { Sparkles, Scissors, Droplet, Crown, Feather, X, Calendar, ArrowRight, Eye } from 'lucide-react';
import { GalleryItem, SalonService } from '../types';
import { getAssetUrl } from '../lib/asset';

interface GallerySectionProps {
  gallery: GalleryItem[];
  services: SalonService[];
  onBookStyle: (serviceId?: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  services,
  onBookStyle,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Styles' },
    { id: 'haircolor', label: 'Balayage & Hair Colour' },
    { id: 'haircut', label: 'Precision Cuts & Fades' },
    { id: 'treatment', label: 'Botoplex & Keratin' },
    { id: 'bridal', label: 'Bridal Royale' },
    { id: 'beard', label: 'Beard Sculpting' },
    { id: 'skin', label: 'Facial Glow' },
  ];

  const filteredItems = gallery.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const getIcon = (type: GalleryItem['iconType']) => {
    switch (type) {
      case 'scissors': return <Scissors className="w-5 h-5 text-amber-400" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'crown': return <Crown className="w-5 h-5 text-amber-400" />;
      case 'droplet': return <Droplet className="w-5 h-5 text-amber-400" />;
      case 'feather': return <Feather className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="lookbook" className="py-16 lg:py-24 bg-stone-900/50 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
            Salon Portfolio & Lookbook
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
            Recent Client Transformations & Signatures
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-2 font-sans">
            Crafted daily by our certified master colorists and styling architects at The Rich Unisex Salon. Click any look to inspect details and book.
          </p>

          {/* Filter Pills / Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-6 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-stone-950 border-amber-400 font-semibold shadow-sm'
                    : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:text-white hover:border-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-stone-800 bg-stone-950/80 hover:border-amber-500/40 transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              {/* Visual Card Photo Artwork container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-stone-800/80 bg-stone-900">
                <img
                  src={getAssetUrl(item.imageUrl || 'images/salon_interior.jpg')}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-stone-950/40" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-[11px] font-mono font-medium text-amber-300 bg-stone-950/85 px-2.5 py-1 rounded-md backdrop-blur-md border border-stone-800">
                    {item.categoryLabel}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-stone-950/80 border border-stone-700/60 backdrop-blur-md flex items-center justify-center">
                    {getIcon(item.iconType)}
                  </div>
                </div>

                {/* Bottom preview overlay */}
                <div className="absolute bottom-3 left-3 right-3 z-10 bg-stone-950/85 backdrop-blur-md p-2.5 rounded-lg border border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-stone-200">{item.stylistName}</div>
                    <div className="text-[10px] text-amber-400/90">Master Artist</div>
                  </div>
                  <span className="text-xs text-amber-300 font-medium flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </span>
                </div>
              </div>

              {/* Text metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags unboxed */}
                <div className="pt-4 mt-3 border-t border-stone-850 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-stone-400">{tag}</span>
                        {idx < item.tags.length - 1 && <span className="text-stone-700">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-amber-400/90 text-xs font-medium">Book</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 shrink-0 bg-stone-950">
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">Lookbook Showcase</span>
                <span className="text-stone-600">·</span>
                <span className="text-xs text-stone-400">{activeItem.categoryLabel}</span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* High-Res Photo Banner */}
              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-stone-800 relative bg-stone-950">
                <img
                  src={getAssetUrl(activeItem.imageUrl || 'images/salon_interior.jpg')}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                  <div className="bg-stone-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-800 text-amber-300 font-serif font-bold text-sm">
                    {activeItem.title}
                  </div>
                  <div className="bg-stone-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-stone-200 border border-stone-800">
                    Artistry by {activeItem.stylistName}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2">
                  {activeItem.tags.map((t, idx) => (
                    <span key={idx} className="text-xs bg-stone-950/85 backdrop-blur-md border border-stone-700 text-stone-300 px-2.5 py-1 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description and Stylist Notes */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-100 mb-2">
                  {activeItem.title}
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {/* Matched Service details if available */}
              {activeItem.serviceId && (() => {
                const matchedService = services.find(s => s.id === activeItem.serviceId);
                if (!matchedService) return null;
                return (
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-amber-400 font-medium">Recommended Service</div>
                      <div className="text-sm font-semibold text-stone-100">{matchedService.name}</div>
                      <div className="text-xs text-stone-400 font-mono">
                        {matchedService.durationMinutes} mins · ₹{matchedService.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveItem(null);
                        onBookStyle(matchedService.id);
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </button>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2.5 text-xs font-medium text-stone-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const sid = activeItem.serviceId;
                    setActiveItem(null);
                    onBookStyle(sid);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-semibold text-xs sm:text-sm rounded-lg hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-2"
                >
                  <span>Book This Look Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
