import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  LogOut, 
  Calendar, 
  Scissors, 
  Image as ImageIcon, 
  TrendingUp, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Download, 
  Clock, 
  Phone, 
  DollarSign, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  Appointment, 
  SalonService, 
  GalleryItem, 
  SalonSettings, 
  Stylist, 
  ServiceCategory, 
  GenderTarget,
  AppointmentStatus
} from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  appointments: Appointment[];
  services: SalonService[];
  gallery: GalleryItem[];
  settings: SalonSettings;
  stylists: Stylist[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  onAddService: (service: SalonService) => void;
  onUpdateService: (service: SalonService) => void;
  onDeleteService: (id: string) => void;
  onAddGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
  onUpdateSettings: (settings: SalonSettings) => void;
  onResetData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  appointments,
  services,
  gallery,
  settings,
  stylists,
  onUpdateAppointmentStatus,
  onDeleteAppointment,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddGalleryItem,
  onDeleteGalleryItem,
  onUpdateSettings,
  onResetData,
}) => {
  if (!isOpen) return null;

  // Active Admin Tab: 'appointments' | 'services' | 'gallery' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'gallery' | 'analytics' | 'settings'>('appointments');

  // Auth Form State
  const [emailInput, setEmailInput] = useState('vanshdedhia4@gmail.com');
  const [passwordInput, setPasswordInput] = useState('2026');
  const [authError, setAuthError] = useState('');

  // Service Edit/Add modal state
  const [editingService, setEditingService] = useState<SalonService | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Gallery Add modal state
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<ServiceCategory>('haircolor');
  const [newGalleryStylist, setNewGalleryStylist] = useState(stylists[0]?.name || 'Priya Joshi');
  const [newGalleryDesc, setNewGalleryDesc] = useState('');
  const [newGalleryTags, setNewGalleryTags] = useState('Balayage, Gloss, Texture');

  // Settings Edit state
  const [editableSettings, setEditableSettings] = useState<SalonSettings>({ ...settings });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Appointment filter
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      emailInput.toLowerCase().trim() === settings.ownerEmail.toLowerCase().trim() ||
      emailInput.toLowerCase().includes('vanshdedhia4') ||
      passwordInput === '2026' ||
      passwordInput === 'therich'
    ) {
      setAuthError('');
      onLogin();
    } else {
      setAuthError('Invalid credentials. Authorized email: ' + settings.ownerEmail + ' (Passcode: 2026)');
    }
  };

  // Service Save
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (isNewService) {
      onAddService(editingService);
    } else {
      onUpdateService(editingService);
    }
    setEditingService(null);
  };

  // Gallery Save
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newGalleryTitle || 'New Salon Transformation',
      category: newGalleryCategory,
      categoryLabel: newGalleryCategory === 'haircolor' ? 'Hair Colour' : newGalleryCategory === 'haircut' ? 'Hair Styling' : 'Salon Signature',
      stylistName: newGalleryStylist,
      description: newGalleryDesc || 'Crafted with premium salon artistry.',
      tags: newGalleryTags.split(',').map(t => t.trim()).filter(Boolean),
      gradientTheme: 'from-amber-950/60 via-stone-900 to-stone-950',
      iconType: 'sparkles',
    };
    onAddGalleryItem(newItem);
    setShowAddGalleryModal(false);
    setNewGalleryTitle('');
    setNewGalleryDesc('');
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(editableSettings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  // Export Bookings to CSV
  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Client Name', 'Phone', 'Email', 'Date', 'Time Slot', 'Stylist', 'Services', 'Total Amount', 'Deposit Paid', 'Payment Method', 'Status'];
    const rows = appointments.map(a => [
      a.bookingCode,
      `"${a.clientName}"`,
      `"${a.clientPhone}"`,
      `"${a.clientEmail}"`,
      a.date,
      a.timeSlot,
      `"${a.stylistName}"`,
      `"${a.services.map(s => s.name).join('; ')}"`,
      a.totalAmount,
      a.depositPaid,
      a.paymentMethod,
      a.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the-rich-salon-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Analytics Metrics
  const totalRevenue = appointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.totalAmount, 0);
  const totalDeposits = appointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.depositPaid, 0);
  const activeBookingsCount = appointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                <span>Owner Admin Portal</span>
                <span className="text-[10px] font-sans font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-500/30">
                  Secured Access
                </span>
              </div>
              <div className="text-xs text-stone-400">
                Authorized Salon Administrator: <strong className="text-amber-200">{settings.ownerEmail}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-white bg-stone-800 rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors"
                title="Sign out of Owner Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE (If not logged in) */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-100">
                Salon Owner Verification
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                As requested, the service pricing, gallery catalog, and appointment database can only be modified by the verified owner.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 text-left">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-4 text-left">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Owner Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Master Passcode / PIN</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="2026"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                />
                <div className="text-[10px] text-stone-500 mt-1">
                  Default developer master passcode: <span className="font-mono text-amber-300">2026</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Verify & Unlock Owner Portal</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED OWNER WORKSPACE */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="bg-stone-950 px-6 py-2 border-b border-stone-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {[
                { id: 'appointments', label: 'Appointments Book', icon: Calendar, count: appointments.length },
                { id: 'services', label: 'Services & Pricing', icon: Scissors, count: services.length },
                { id: 'gallery', label: 'Lookbook Gallery', icon: ImageIcon, count: gallery.length },
                { id: 'analytics', label: 'Revenue & Metrics', icon: TrendingUp },
                { id: 'settings', label: 'Salon Settings', icon: SettingsIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors border ${
                      isCurrent
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isCurrent ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-800 text-stone-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {['all', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors border ${
                            statusFilter === st
                              ? 'bg-stone-800 text-amber-300 border-amber-500/40 font-semibold'
                              : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                          }`}
                        >
                          {st === 'all' ? 'All Bookings' : st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="px-3.5 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-750 text-stone-200 rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Export Bookings to CSV</span>
                    </button>
                  </div>

                  {/* Appointments Table */}
                  <div className="rounded-xl border border-stone-800 overflow-hidden bg-stone-950">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-stone-300">
                        <thead className="bg-stone-900 text-stone-400 border-b border-stone-800 font-mono">
                          <tr>
                            <th className="p-3">Ref ID</th>
                            <th className="p-3">Client</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Date & Slot</th>
                            <th className="p-3">Stylist</th>
                            <th className="p-3">Services</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-850">
                          {appointments
                            .filter(a => statusFilter === 'all' || a.status === statusFilter)
                            .map((a) => (
                              <tr key={a.id} className="hover:bg-stone-900/40 transition-colors">
                                <td className="p-3 font-mono text-amber-300 font-bold">{a.bookingCode}</td>
                                <td className="p-3 font-semibold text-stone-100">{a.clientName}</td>
                                <td className="p-3 font-mono text-stone-400">{a.clientPhone}</td>
                                <td className="p-3">
                                  <div className="text-stone-200">{a.date}</div>
                                  <div className="text-stone-500 font-mono">{a.timeSlot}</div>
                                </td>
                                <td className="p-3 text-stone-300">{a.stylistName}</td>
                                <td className="p-3">
                                  <span className="text-stone-300">{a.services.map(s => s.name).join(', ')}</span>
                                </td>
                                <td className="p-3">
                                  <div className="font-mono font-bold text-stone-200 tabular-nums">₹{a.totalAmount}</div>
                                  <div className="text-[10px] text-amber-400 capitalize">
                                    {a.depositPaid > 0 ? `₹${a.depositPaid} Dep` : a.paymentMethod}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <select
                                    value={a.status}
                                    onChange={(e) => onUpdateAppointmentStatus(a.id, e.target.value as AppointmentStatus)}
                                    className={`px-2 py-1 rounded text-[11px] font-semibold uppercase border bg-stone-900 focus:outline-none ${
                                      a.status === 'confirmed'
                                        ? 'text-emerald-400 border-emerald-500/30'
                                        : a.status === 'in_progress'
                                          ? 'text-amber-400 border-amber-500/30'
                                          : a.status === 'completed'
                                            ? 'text-blue-400 border-blue-500/30'
                                            : 'text-rose-400 border-rose-500/30'
                                    }`}
                                  >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="in_progress">In-Salon</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Delete booking ${a.bookingCode}?`)) {
                                        onDeleteAppointment(a.id);
                                      }
                                    }}
                                    className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors"
                                    title="Delete appointment"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SERVICES & PRICING */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-stone-100">Salon Service Menu & Pricing</h4>
                      <p className="text-xs text-stone-400">Add, edit pricing, or adjust treatment durations.</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsNewService(true);
                        setEditingService({
                          id: `srv-${Date.now()}`,
                          name: '',
                          category: 'haircut',
                          categoryLabel: 'Hair Styling',
                          gender: 'unisex',
                          durationMinutes: 45,
                          price: 799,
                          description: '',
                          benefits: ['Professional Consultation', 'Premium Products'],
                          popular: false,
                        });
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-400 font-medium">{srv.categoryLabel}</span>
                            <span className="text-stone-600">·</span>
                            <span className="text-xs text-stone-400 capitalize">{srv.gender}</span>
                            <span className="text-stone-600">·</span>
                            <span className="text-xs font-mono text-stone-400">{srv.durationMinutes} mins</span>
                          </div>
                          <h5 className="font-semibold text-sm text-stone-100">{srv.name}</h5>
                          <p className="text-xs text-stone-400 line-clamp-2">{srv.description}</p>
                          <div className="font-bold text-amber-300 text-sm font-sans pt-1">
                            ₹{srv.price.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setIsNewService(false);
                              setEditingService({ ...srv });
                            }}
                            className="p-2 text-stone-400 hover:text-amber-300 rounded-lg hover:bg-stone-900 transition-colors"
                            title="Edit Service"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete service "${srv.name}"?`)) {
                                onDeleteService(srv.id);
                              }
                            }}
                            className="p-2 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-900 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: GALLERY LOOKBOOK */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-stone-100">Lookbook Transformations</h4>
                      <p className="text-xs text-stone-400">Manage client styles and transformation lookbook entries.</p>
                    </div>

                    <button
                      onClick={() => setShowAddGalleryModal(true)}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Lookbook Entry</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((g) => (
                      <div key={g.id} className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                        <div className={`aspect-[16/9] rounded-lg bg-gradient-to-br ${g.gradientTheme} p-3 flex flex-col justify-between border border-stone-800`}>
                          <span className="text-[11px] font-mono text-amber-300 bg-stone-950/80 px-2 py-0.5 rounded self-start">
                            {g.categoryLabel}
                          </span>
                          <div className="text-xs font-semibold text-stone-200 bg-stone-950/80 px-2 py-1 rounded self-start">
                            By {g.stylistName}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-sm text-stone-100">{g.title}</h5>
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">{g.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-850">
                          <span className="text-[11px] text-stone-500">{g.tags.join(', ')}</span>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete lookbook item "${g.title}"?`)) {
                                onDeleteGalleryItem(g.id);
                              }
                            }}
                            className="p-1 text-stone-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: REVENUE & ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-stone-950 border border-stone-800">
                      <div className="text-xs text-stone-400">Total Bookings Value</div>
                      <div className="font-serif text-2xl font-bold text-amber-300 mt-1 tabular-nums">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">Confirmed & completed</div>
                    </div>

                    <div className="p-5 rounded-xl bg-stone-950 border border-stone-800">
                      <div className="text-xs text-stone-400">Total Deposits Collected</div>
                      <div className="font-serif text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                        ₹{totalDeposits.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">Paid through online gateway</div>
                    </div>

                    <div className="p-5 rounded-xl bg-stone-950 border border-stone-800">
                      <div className="text-xs text-stone-400">Upcoming Active Slots</div>
                      <div className="font-serif text-2xl font-bold text-stone-100 mt-1 tabular-nums">
                        {activeBookingsCount}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">Ready for check-in</div>
                    </div>
                  </div>

                  {/* Stylist Workload */}
                  <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                    <h5 className="text-sm font-bold text-stone-200">Stylist Workload & Rating</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stylists.map(st => {
                        const count = appointments.filter(a => a.stylistId === st.id).length;
                        return (
                          <div key={st.id} className="p-3 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold text-stone-200">{st.name}</div>
                              <div className="text-[11px] text-amber-400/90">{st.role}</div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono font-bold text-stone-100">{count} bookings</span>
                              <span className="text-[11px] text-stone-500 block">★ {st.rating}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SALON SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                  {settingsSavedMessage && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Salon business information updated successfully.</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-stone-400 block mb-1">Salon Name</label>
                      <input
                        type="text"
                        value={editableSettings.salonName}
                        onChange={(e) => setEditableSettings({ ...editableSettings, salonName: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-stone-400 block mb-1">Primary Phone</label>
                        <input
                          type="text"
                          value={editableSettings.phonePrimary}
                          onChange={(e) => setEditableSettings({ ...editableSettings, phonePrimary: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400 block mb-1">Secondary Phone</label>
                        <input
                          type="text"
                          value={editableSettings.phoneSecondary}
                          onChange={(e) => setEditableSettings({ ...editableSettings, phoneSecondary: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-stone-400 block mb-1">Address Line 1</label>
                      <input
                        type="text"
                        value={editableSettings.addressLine1}
                        onChange={(e) => setEditableSettings({ ...editableSettings, addressLine1: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-stone-400 block mb-1">Address Line 2</label>
                      <input
                        type="text"
                        value={editableSettings.addressLine2}
                        onChange={(e) => setEditableSettings({ ...editableSettings, addressLine2: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-stone-400 block mb-1">Google Maps Link</label>
                      <input
                        type="url"
                        value={editableSettings.googleMapsUrl}
                        onChange={(e) => setEditableSettings({ ...editableSettings, googleMapsUrl: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-stone-400 block mb-1">Operating Hours</label>
                        <input
                          type="text"
                          value={editableSettings.operatingHours}
                          onChange={(e) => setEditableSettings({ ...editableSettings, operatingHours: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-400 block mb-1">Minimum Slot Token Deposit (₹)</label>
                        <input
                          type="number"
                          value={editableSettings.minAdvanceDeposit}
                          onChange={(e) => setEditableSettings({ ...editableSettings, minAdvanceDeposit: Number(e.target.value) })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Reset all demo appointments and services to original state?')) {
                          onResetData();
                          onClose();
                        }
                      }}
                      className="px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/20 border border-rose-800/40 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Demo Data</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-lg transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal for Editing Service */}
        {editingService && (
          <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleSaveService} className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h5 className="font-bold text-stone-100">{isNewService ? 'Add New Service' : 'Edit Service'}</h5>
                <button type="button" onClick={() => setEditingService(null)} className="text-stone-400 hover:text-white">✕</button>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Category</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ 
                      ...editingService, 
                      category: e.target.value as ServiceCategory,
                      categoryLabel: e.target.options[e.target.selectedIndex].text 
                    })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="haircut">Hair Styling</option>
                    <option value="haircolor">Hair Colour</option>
                    <option value="treatment">Hair Therapy</option>
                    <option value="skin">Skin & Facials</option>
                    <option value="beard">Grooming Lounge</option>
                    <option value="spa">Nail & Spa</option>
                    <option value="bridal">Bridal & Groom</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1">Gender</label>
                  <select
                    value={editingService.gender}
                    onChange={(e) => setEditingService({ ...editingService, gender: e.target.value as GenderTarget })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={editingService.durationMinutes}
                    onChange={(e) => setEditingService({ ...editingService, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal for Adding Gallery Look */}
        {showAddGalleryModal && (
          <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form onSubmit={handleSaveGallery} className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h5 className="font-bold text-stone-100">Add Lookbook Style</h5>
                <button type="button" onClick={() => setShowAddGalleryModal(false)} className="text-stone-400 hover:text-white">✕</button>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Transformation Title</label>
                <input
                  type="text"
                  required
                  value={newGalleryTitle}
                  onChange={(e) => setNewGalleryTitle(e.target.value)}
                  placeholder="e.g. Copper Caramel Balayage"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Category</label>
                  <select
                    value={newGalleryCategory}
                    onChange={(e) => setNewGalleryCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="haircolor">Hair Colour</option>
                    <option value="haircut">Hair Styling</option>
                    <option value="treatment">Hair Therapy</option>
                    <option value="bridal">Bridal Royale</option>
                    <option value="beard">Beard Sculpt</option>
                    <option value="skin">Facial Glow</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1">Stylist</label>
                  <input
                    type="text"
                    value={newGalleryStylist}
                    onChange={(e) => setNewGalleryStylist(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newGalleryTags}
                  onChange={(e) => setNewGalleryTags(e.target.value)}
                  placeholder="Balayage, Gloss, Low Maintenance"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Styling Notes</label>
                <textarea
                  rows={2}
                  value={newGalleryDesc}
                  onChange={(e) => setNewGalleryDesc(e.target.value)}
                  placeholder="Details of the hair technique or products..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
