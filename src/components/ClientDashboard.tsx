import React, { useState, useMemo } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  Scissors, 
  Phone, 
  MapPin, 
  FileText, 
  RefreshCw, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Download, 
  Search,
  ChevronRight,
  Shield,
  CreditCard
} from 'lucide-react';
import { Appointment, SalonSettings, SalonService } from '../types';

interface ClientDashboardProps {
  appointments: Appointment[];
  settings: SalonSettings;
  onReschedule: (id: string, newDate: string, newTimeSlot: string) => void;
  onCancel: (id: string) => void;
  onBookNew: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  appointments,
  settings,
  onReschedule,
  onCancel,
  onBookNew,
}) => {
  // Search / Lookup input (phone or booking code)
  const [searchPhone, setSearchPhone] = useState<string>('98201 12345');
  const [activeQuery, setActiveQuery] = useState<string>('98201 12345');

  // Selected appointment for invoice modal
  const [invoiceAppointment, setInvoiceAppointment] = useState<Appointment | null>(null);

  // Selected appointment for reschedule modal
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('');
  const [newRescheduleTime, setNewRescheduleTime] = useState<string>('12:00 PM');

  // Filter appointments for this user
  const clientAppointments = useMemo(() => {
    if (!activeQuery.trim()) return appointments.slice(0, 3);
    const q = activeQuery.toLowerCase().replace(/\s+/g, '');
    return appointments.filter((a) => {
      const p = a.clientPhone.toLowerCase().replace(/\s+/g, '');
      const code = a.bookingCode.toLowerCase();
      const name = a.clientName.toLowerCase();
      return p.includes(q) || code.includes(q) || name.includes(q);
    });
  }, [appointments, activeQuery]);

  const upcomingAppointments = clientAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'in_progress'
  );
  const pastAppointments = clientAppointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchPhone);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleAppointment || !newRescheduleDate || !newRescheduleTime) return;
    onReschedule(rescheduleAppointment.id, newRescheduleDate, newRescheduleTime);
    setRescheduleAppointment(null);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <section id="client-portal" className="py-16 lg:py-24 bg-stone-950 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              Client Portal & Self-Service
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 tracking-tight">
              My Appointments & Loyalty Hub
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl font-sans">
              Look up your booking by mobile number or booking reference code. Reschedule slots, download tax invoices, or track loyalty reward points.
            </p>
          </div>

          <button
            onClick={onBookNew}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-sm flex items-center gap-2 self-start md:self-auto transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule New Visit</span>
          </button>
        </div>

        {/* Client Access & Quick Lookup Bar */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter your 10-digit mobile number or Booking Code (e.g. TRUS-9104)..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-800 hover:bg-stone-750 text-amber-300 font-medium text-sm rounded-lg border border-stone-700 transition-colors whitespace-nowrap"
            >
              Look Up Bookings
            </button>
          </form>

          {/* Quick Demo profiles clicker */}
          <div className="mt-3 flex items-center gap-2 text-xs text-stone-400 flex-wrap">
            <span className="text-stone-500">Quick Test Profiles:</span>
            <button
              type="button"
              onClick={() => {
                setSearchPhone('98201 12345');
                setActiveQuery('98201 12345');
              }}
              className="text-amber-400/90 hover:underline"
            >
              Aditya Mehta (98201 12345)
            </button>
            <span className="text-stone-700">·</span>
            <button
              type="button"
              onClick={() => {
                setSearchPhone('97654 32109');
                setActiveQuery('97654 32109');
              }}
              className="text-amber-400/90 hover:underline"
            >
              Sneha Deshmukh (97654 32109)
            </button>
          </div>
        </div>

        {/* Loyalty & Privileges Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-medium">The Rich Rewards Club</div>
              <div className="text-xl font-bold font-mono text-amber-300">250 Points</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Worth ₹250 discount on your next visit</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-medium">Bookings Tracked</div>
              <div className="text-xl font-bold font-mono text-stone-100">
                {clientAppointments.length} Visit{clientAppointments.length !== 1 ? 's' : ''}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">Registered under {activeQuery || 'Guest'}</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-medium">Access Permissions</div>
              <div className="text-sm font-semibold text-stone-200">Client Access Mode</div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Salon menu & rates editable by Owner only
              </div>
            </div>
          </div>
        </div>

        {/* UPCOMING APPOINTMENTS SECTION */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-stone-100">
              Upcoming Reservations ({upcomingAppointments.length})
            </h3>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-stone-900/30 border border-stone-800 text-stone-400">
              <Calendar className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-sm">No active upcoming appointments found for "{activeQuery}".</p>
              <button
                onClick={onBookNew}
                className="mt-3 px-4 py-2 text-xs font-semibold bg-amber-400 text-stone-950 rounded-lg hover:bg-amber-300 transition-colors"
              >
                Schedule an Appointment Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="rounded-2xl bg-stone-900 border border-stone-800 p-6 flex flex-col justify-between space-y-5 hover:border-amber-500/30 transition-all shadow-lg"
                >
                  <div className="space-y-4">
                    {/* Header: Code & Status */}
                    <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">
                          Booking ID
                        </span>
                        <div className="text-base font-bold font-mono text-amber-300">
                          {appt.bookingCode}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                          {appt.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Client & Date details */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-stone-500 block">Date & Arrival Time</span>
                        <span className="font-semibold text-stone-100">{appt.date}</span>
                        <span className="text-stone-400 font-mono block">{appt.timeSlot}</span>
                      </div>

                      <div>
                        <span className="text-stone-500 block">Assigned Specialist</span>
                        <span className="font-semibold text-stone-100">{appt.stylistName}</span>
                        <span className="text-stone-400 block">{settings.salonName}</span>
                      </div>
                    </div>

                    {/* Services Included */}
                    <div>
                      <span className="text-stone-500 text-xs block mb-1">Services</span>
                      <div className="space-y-1">
                        {appt.services.map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-stone-300 bg-stone-950/60 p-2 rounded border border-stone-850">
                            <span>{s.name} ({s.durationMinutes} min)</span>
                            <span className="font-mono text-amber-300 font-medium">₹{s.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment breakdown */}
                    <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-500 block">Payment Method</span>
                        <span className="font-medium text-stone-300 capitalize">{appt.paymentMethod}</span>
                        {appt.paymentTransactionId && (
                          <span className="text-[10px] text-stone-500 font-mono block">Ref: {appt.paymentTransactionId}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-stone-500 block">Total / Advance</span>
                        <span className="font-bold text-stone-100 font-sans">
                          ₹{appt.totalAmount}
                        </span>
                        <span className="text-[11px] text-emerald-400 block">
                          {appt.depositPaid > 0 ? `₹${appt.depositPaid} Paid` : 'Pay at Venue'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Client action buttons */}
                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInvoiceAppointment(appt)}
                      className="px-3 py-2 text-xs text-stone-300 hover:text-white bg-stone-800 rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tax Invoice</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRescheduleAppointment(appt);
                          setNewRescheduleDate(appt.date);
                          setNewRescheduleTime(appt.timeSlot);
                        }}
                        className="px-3 py-2 text-xs text-amber-300 hover:text-amber-200 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel booking ${appt.bookingCode}?`)) {
                            onCancel(appt.id);
                          }
                        }}
                        className="px-3 py-2 text-xs text-stone-400 hover:text-rose-400 bg-stone-950 border border-stone-800 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAST HISTORY SECTION */}
        {pastAppointments.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Past Visit History
            </h3>
            <div className="rounded-xl border border-stone-800 overflow-hidden bg-stone-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 font-mono">
                    <tr>
                      <th className="p-3.5">Booking Ref</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Services</th>
                      <th className="p-3.5">Stylist</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {pastAppointments.map((a) => (
                      <tr key={a.id} className="hover:bg-stone-850/50">
                        <td className="p-3.5 font-mono text-amber-300 font-semibold">{a.bookingCode}</td>
                        <td className="p-3.5">{a.date}</td>
                        <td className="p-3.5">{a.services.map(s => s.name).join(', ')}</td>
                        <td className="p-3.5">{a.stylistName}</td>
                        <td className="p-3.5 font-mono">₹{a.totalAmount}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            a.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setInvoiceAppointment(a)}
                            className="text-stone-400 hover:text-amber-300 underline text-xs"
                          >
                            View Receipt
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
      </div>

      {/* Reschedule Modal */}
      {rescheduleAppointment && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-stone-100">Reschedule Appointment</h4>
                <p className="text-xs text-amber-400 font-mono mt-0.5">Booking #{rescheduleAppointment.bookingCode}</p>
              </div>
              <button
                onClick={() => setRescheduleAppointment(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Select New Date</label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Select New Time Slot</label>
                <select
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {['10:00 AM', '11:15 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM', '08:00 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRescheduleAppointment(null)}
                className="flex-1 py-2 text-xs text-stone-400 hover:text-white bg-stone-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="flex-1 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {invoiceAppointment && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-stone-200">
            {/* Modal top bar */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-400" />
                <span className="font-serif font-bold text-lg text-stone-100">{settings.salonName}</span>
              </div>
              <button
                onClick={() => setInvoiceAppointment(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Invoice Print Content */}
            <div className="space-y-5 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-stone-400 font-mono text-[11px]">SALON ADDRESS</div>
                  <div className="font-semibold text-stone-200">{settings.addressLine1}</div>
                  <div className="text-stone-400">{settings.addressLine2}</div>
                  <div className="text-stone-400">{settings.city} - {settings.pincode}</div>
                  <div className="text-stone-400 font-mono mt-1">Ph: {settings.phonePrimary}</div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 font-bold text-sm font-mono">TAX INVOICE</div>
                  <div className="text-stone-300 font-mono font-semibold">#{invoiceAppointment.bookingCode}</div>
                  <div className="text-stone-400 font-mono">{invoiceAppointment.date}</div>
                  <div className="text-emerald-400 font-semibold uppercase mt-1">Status: {invoiceAppointment.status}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="p-3 bg-stone-950 rounded-lg border border-stone-800">
                <div className="text-[10px] text-stone-500 uppercase font-mono">Client Details</div>
                <div className="font-semibold text-stone-100 text-sm">{invoiceAppointment.clientName}</div>
                <div className="text-stone-400 font-mono">{invoiceAppointment.clientPhone} · {invoiceAppointment.clientEmail}</div>
                <div className="text-stone-400 mt-1">Slot: {invoiceAppointment.date} at {invoiceAppointment.timeSlot} (Stylist: {invoiceAppointment.stylistName})</div>
              </div>

              {/* Services Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 font-mono">
                    <th className="py-2">Description</th>
                    <th className="py-2">Duration</th>
                    <th className="py-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {invoiceAppointment.services.map((s, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium text-stone-200">{s.name}</td>
                      <td className="py-2 text-stone-400 font-mono">{s.durationMinutes} min</td>
                      <td className="py-2 text-right font-mono tabular-nums">₹{s.price}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-stone-700 font-semibold text-stone-100">
                    <td className="py-2.5" colSpan={2}>Subtotal</td>
                    <td className="py-2.5 text-right font-mono">₹{invoiceAppointment.totalAmount}</td>
                  </tr>
                  <tr className="text-stone-400 font-mono text-[11px]">
                    <td className="py-1" colSpan={2}>Applicable Taxes (GST 18% Incl.)</td>
                    <td className="py-1 text-right font-mono">Included</td>
                  </tr>
                  <tr className="border-t border-stone-800 text-amber-300 font-bold">
                    <td className="py-2" colSpan={2}>Deposit / Advance Paid</td>
                    <td className="py-2 text-right font-mono">₹{invoiceAppointment.depositPaid}</td>
                  </tr>
                  <tr className="text-stone-300">
                    <td className="py-1" colSpan={2}>Balance Due at Salon</td>
                    <td className="py-1 text-right font-mono font-bold">
                      ₹{Math.max(0, invoiceAppointment.totalAmount - invoiceAppointment.depositPaid)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Print and Download Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-800">
              <button
                onClick={handlePrintInvoice}
                className="px-4 py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={() => setInvoiceAppointment(null)}
                className="px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
