import React, { useState, useMemo } from 'react';
import { 
  X, 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Scissors, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Download, 
  MapPin, 
  Phone,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  SalonService, 
  Stylist, 
  SalonSettings, 
  Appointment, 
  PaymentMethod, 
  PaymentStatus 
} from '../types';
import { PaymentGateway } from './PaymentGateway';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  allServices: SalonService[];
  allStylists: Stylist[];
  initialSelectedServices: SalonService[];
  settings: SalonSettings;
  existingAppointments: Appointment[];
  onBookingConfirmed: (newAppointment: Appointment) => void;
  onViewClientPortal: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  allServices,
  allStylists,
  initialSelectedServices,
  settings,
  existingAppointments,
  onBookingConfirmed,
  onViewClientPortal,
}) => {
  if (!isOpen) return null;

  // Selected services in scheduler
  const [selectedServices, setSelectedServices] = useState<SalonService[]>(
    initialSelectedServices.length > 0 ? initialSelectedServices : [allServices[0]]
  );

  // Scheduler Steps: 1: Services | 2: Stylist | 3: Date & Slot | 4: Client Info | 5: Payment | 6: Confirmation
  const [step, setStep] = useState<number>(1);

  // Stylist
  const [selectedStylistId, setSelectedStylistId] = useState<string>('any');

  // Dates (next 14 days)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({ iso, weekday, dayNum, monthStr, fullDate: d });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].iso);

  // Time Slots
  const morningSlots = ['09:45 AM', '10:30 AM', '11:15 AM', '12:00 PM'];
  const afternoonSlots = ['01:00 PM', '01:45 PM', '02:30 PM', '03:15 PM', '04:00 PM'];
  const eveningSlots = ['05:00 PM', '05:45 PM', '06:30 PM', '07:15 PM', '08:00 PM', '08:45 PM'];

  const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:15 AM');

  // Client Details Form
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Created appointment after payment
  const [completedAppointment, setCompletedAppointment] = useState<Appointment | null>(null);

  // Calculations
  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [selectedServices]);

  const totalAmount = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const chosenStylist = useMemo(() => {
    if (selectedStylistId === 'any') return null;
    return allStylists.find((s) => s.id === selectedStylistId) || null;
  }, [selectedStylistId, allStylists]);

  // Check booked slots for selectedDate & stylist
  const bookedSlotsOnDate = useMemo(() => {
    return existingAppointments
      .filter((a) => a.date === selectedDate && a.status !== 'cancelled')
      .map((a) => a.timeSlot);
  }, [existingAppointments, selectedDate]);

  // Step 1: Manage Services in Tray
  const handleRemoveService = (id: string) => {
    if (selectedServices.length === 1) return; // Keep at least one
    setSelectedServices(selectedServices.filter((s) => s.id !== id));
  };

  const handleAddService = (service: SalonService) => {
    if (!selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Step 4: Validate details form
  const validateClientForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!clientName.trim()) {
      errors.name = 'Full name is required';
    }
    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit mobile number is required';
    }
    if (clientEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      errors.email = 'Please enter a valid email address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateClientForm()) {
      setStep(5);
    }
  };

  // Step 5: Handle Payment Complete
  const handlePaymentSuccess = (paymentData: {
    method: PaymentMethod;
    status: PaymentStatus;
    totalAmount: number;
    depositPaid: number;
    transactionId: string;
  }) => {
    const bookingCode = `TRUS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingCode,
      clientName,
      clientPhone: clientPhone.startsWith('+91') ? clientPhone : `+91 ${clientPhone}`,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@guest.in`,
      clientNotes,
      services: selectedServices,
      stylistId: chosenStylist ? chosenStylist.id : 'any',
      stylistName: chosenStylist ? chosenStylist.name : 'Senior Salon Specialist',
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      totalAmount: paymentData.totalAmount,
      depositPaid: paymentData.depositPaid,
      paymentMethod: paymentData.method,
      paymentStatus: paymentData.status,
      paymentTransactionId: paymentData.transactionId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onBookingConfirmed(newAppointment);
    setCompletedAppointment(newAppointment);
    setStep(6);
  };

  // Add to Calendar iCal generator
  const downloadCalendarEvent = () => {
    if (!completedAppointment) return;
    const startIso = `${completedAppointment.date}T${completedAppointment.timeSlot.includes('PM') && !completedAppointment.timeSlot.startsWith('12') ? (parseInt(completedAppointment.timeSlot) + 12).toString().padStart(2, '0') : '11'}:00:00`;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Rich Unisex Salon//Appointment//EN
BEGIN:VEVENT
SUMMARY:Appointment: ${completedAppointment.services.map(s => s.name).join(', ')} - The Rich Unisex Salon
DESCRIPTION:Booking Ref: ${completedAppointment.bookingCode}\\nStylist: ${completedAppointment.stylistName}\\nVenue: ${settings.addressLine1}, ${settings.addressLine2}
LOCATION:${settings.addressLine1}, ${settings.addressLine2}, Ambernath East
DTSTART:${completedAppointment.date.replace(/-/g, '')}T100000Z
DURATION:PT${totalDuration}M
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${completedAppointment.bookingCode}-appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif text-base sm:text-lg font-bold text-stone-100">
                Online Appointment Scheduler
              </div>
              <div className="text-[11px] text-amber-300/80 font-sans">
                {settings.salonName} · Shivdham Complex, Station Rd, Ambernath East
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Bar (Hidden on step 6 confirmation) */}
        {step < 6 && (
          <div className="bg-stone-950/90 px-6 py-2.5 border-b border-stone-800/80 shrink-0">
            <div className="flex items-center justify-between text-xs font-medium">
              {[
                { s: 1, label: 'Services' },
                { s: 2, label: 'Stylist' },
                { s: 3, label: 'Date & Time' },
                { s: 4, label: 'Client Details' },
                { s: 5, label: 'Payment' },
              ].map((item) => (
                <button
                  key={item.s}
                  onClick={() => item.s < step && setStep(item.s)}
                  disabled={item.s > step}
                  className={`flex items-center gap-1.5 transition-colors ${
                    step === item.s
                      ? 'text-amber-400 font-semibold'
                      : item.s < step
                        ? 'text-stone-300 hover:text-amber-300 cursor-pointer'
                        : 'text-stone-600 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                      step === item.s
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : item.s < step
                          ? 'bg-stone-800 text-amber-300'
                          : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {item.s < step ? '✓' : item.s}
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Services Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-100">
                  Step 1: Your Selected Services
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Review your treatment package or add additional services to your visit.
                </p>
              </div>

              {/* Selected List */}
              <div className="space-y-3">
                {selectedServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-400 font-medium">{srv.categoryLabel}</span>
                        <span className="text-stone-600">·</span>
                        <span className="text-xs text-stone-400 capitalize">{srv.gender}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-stone-100 mt-0.5">
                        {srv.name}
                      </h4>
                      <div className="text-xs text-stone-400 mt-1 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span className="font-mono">{srv.durationMinutes} minutes</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-amber-300 font-sans tabular-nums text-base">
                          ₹{srv.price.toLocaleString('en-IN')}
                        </div>
                        {srv.originalPrice && (
                          <div className="text-[11px] text-stone-500 line-through tabular-nums">
                            ₹{srv.originalPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      {selectedServices.length > 1 && (
                        <button
                          onClick={() => handleRemoveService(srv.id)}
                          className="p-2 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-stone-900 transition-colors"
                          title="Remove service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add more service dropdown/quick suggestions */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80">
                <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Popular Add-Ons for this Visit
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allServices
                    .filter((s) => !selectedServices.some((sel) => sel.id === s.id))
                    .slice(0, 4)
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleAddService(s)}
                        className="p-2.5 rounded-lg bg-stone-900 hover:bg-stone-850 border border-stone-800 text-left flex items-center justify-between text-xs group transition-colors"
                      >
                        <div>
                          <div className="font-medium text-stone-200 group-hover:text-amber-300 transition-colors">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            {s.durationMinutes} min · ₹{s.price}
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-stone-500 group-hover:text-amber-400" />
                      </button>
                    ))}
                </div>
              </div>

              {/* Duration & Price Summary Box */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-300 font-medium">Estimated Appointment Length</div>
                  <div className="text-sm font-semibold text-stone-100 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{totalDuration} Minutes (~{Math.round((totalDuration / 60) * 10) / 10} hrs)</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-400">Total Services Amount</div>
                  <div className="font-bold text-xl text-amber-300 font-sans tabular-nums">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <span>Select Stylist</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Stylist Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-100">
                  Step 2: Choose Your Stylist
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Select your preferred beauty director or let our reception assign any available senior expert.
                </p>
              </div>

              {/* Any Stylist Option */}
              <button
                type="button"
                onClick={() => setSelectedStylistId('any')}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedStylistId === 'any'
                    ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/40'
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-100">Any Available Senior Specialist</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Recommended for faster scheduling. We assign the best specialist on duty.
                    </p>
                  </div>
                </div>
                {selectedStylistId === 'any' && (
                  <Check className="w-5 h-5 text-amber-400 shrink-0" />
                )}
              </button>

              {/* Specific Stylists List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allStylists.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStylistId(st.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
                      selectedStylistId === st.id
                        ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/40'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-100">{st.name}</span>
                        <span className="text-[11px] text-amber-400 font-mono">★ {st.rating}</span>
                      </div>
                      <div className="text-xs text-amber-300/80 font-medium">{st.role}</div>
                      <div className="text-[11px] text-stone-400 leading-snug pt-1">
                        {st.specialty}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono pt-1">
                        {st.experienceYears}+ years salon experience
                      </div>
                    </div>

                    {selectedStylistId === st.id && (
                      <Check className="w-5 h-5 text-amber-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Services</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <span>Select Date & Time</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Time Picker */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-100">
                  Step 3: Select Date & Slot
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Choose your appointment day and preferred arrival time at our Ambernath branch.
                </p>
              </div>

              {/* 14-Day Calendar Horizontal Scroll */}
              <div>
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                  Select Date (Next 14 Days)
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.iso;
                    return (
                      <button
                        key={item.iso}
                        type="button"
                        onClick={() => setSelectedDate(item.iso)}
                        className={`p-3 rounded-xl border flex flex-col items-center min-w-[70px] transition-all shrink-0 ${
                          isSelected
                            ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                        }`}
                      >
                        <span className="text-[11px] uppercase tracking-wider">{item.weekday}</span>
                        <span className="text-lg font-bold font-mono my-0.5">{item.dayNum}</span>
                        <span className="text-[10px]">{item.monthStr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                  Select Time Slot
                </label>

                {/* Morning */}
                <div>
                  <div className="text-xs text-stone-400 font-medium mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Morning Sessions (09:30 AM – 12:30 PM)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {morningSlots.map((slot) => {
                      const isBooked = bookedSlotsOnDate.includes(slot);
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-3 rounded-lg border text-xs font-mono transition-colors ${
                            isBooked
                              ? 'bg-stone-950/40 text-stone-600 border-stone-850 cursor-not-allowed line-through'
                              : isSelected
                                ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                                : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                          }`}
                        >
                          {slot} {isBooked && '(Booked)'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon */}
                <div>
                  <div className="text-xs text-stone-400 font-medium mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Afternoon Sessions (01:00 PM – 04:30 PM)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {afternoonSlots.map((slot) => {
                      const isBooked = bookedSlotsOnDate.includes(slot);
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-3 rounded-lg border text-xs font-mono transition-colors ${
                            isBooked
                              ? 'bg-stone-950/40 text-stone-600 border-stone-850 cursor-not-allowed line-through'
                              : isSelected
                                ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                                : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                          }`}
                        >
                          {slot} {isBooked && '(Booked)'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening */}
                <div>
                  <div className="text-xs text-stone-400 font-medium mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Evening Sessions (05:00 PM – 09:30 PM)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {eveningSlots.map((slot) => {
                      const isBooked = bookedSlotsOnDate.includes(slot);
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-3 rounded-lg border text-xs font-mono transition-colors ${
                            isBooked
                              ? 'bg-stone-950/40 text-stone-600 border-stone-850 cursor-not-allowed line-through'
                              : isSelected
                                ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                                : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                          }`}
                        >
                          {slot} {isBooked && '(Booked)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Stylist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <span>Enter Client Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Client Essential Information */}
          {step === 4 && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-100">
                  Step 4: Essential Client Details
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Required to send your digital appointment voucher, QR pass, and WhatsApp booking reminders.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs text-stone-300 block mb-1 font-medium">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Priyanka Patil"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="text-xs text-stone-300 block mb-1 font-medium">
                    Mobile / WhatsApp Number <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="98201 12345"
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-12 pr-3.5 py-2.5 text-sm text-stone-100 font-mono placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs text-stone-300 block mb-1 font-medium">
                    Email Address (For Tax Invoice)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="priyanka@example.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Notes or Allergies */}
                <div className="sm:col-span-2">
                  <label className="text-xs text-stone-300 block mb-1 font-medium">
                    Special Requests, Scalp Notes or Allergies (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="e.g. Skin sensitivity to bleach, prefer silent appointment, or trial patch test needed..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Review summary recap */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-400">Date & Slot:</span>
                  <span className="font-semibold text-stone-100">{selectedDate} at {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Stylist:</span>
                  <span className="font-semibold text-stone-100">{chosenStylist ? chosenStylist.name : 'Senior Salon Specialist'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Services:</span>
                  <span className="font-semibold text-amber-300">{selectedServices.length} Service(s) · ₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Time Slot</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Secure Payment Gateway */}
          {step === 5 && (
            <PaymentGateway
              services={selectedServices}
              stylist={chosenStylist}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              clientName={clientName}
              clientPhone={clientPhone}
              clientEmail={clientEmail}
              settings={settings}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={() => setStep(4)}
            />
          )}

          {/* STEP 6: Confirmation Pass & Digital Receipt */}
          {step === 6 && completedAppointment && (
            <div className="space-y-6 text-center py-2 animate-in fade-in duration-200">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
                  We look forward to styling you!
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-md mx-auto">
                  A digital confirmation with appointment QR pass has been registered for <strong className="text-stone-200">{completedAppointment.clientName}</strong>.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="max-w-md mx-auto bg-stone-950 border border-amber-500/40 rounded-2xl p-6 text-left shadow-2xl relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                      Booking Reference ID
                    </div>
                    <div className="text-lg font-bold font-mono text-amber-300">
                      {completedAppointment.bookingCode}
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    Confirmed
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block">Date & Time</span>
                    <span className="font-semibold text-stone-200">{completedAppointment.date}</span>
                    <span className="text-stone-400 block font-mono">{completedAppointment.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Assigned Stylist</span>
                    <span className="font-semibold text-stone-200">{completedAppointment.stylistName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-500 block">Selected Services</span>
                    <span className="text-stone-300 font-medium">
                      {completedAppointment.services.map(s => s.name).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Total Amount</span>
                    <span className="font-bold text-stone-200 tabular-nums">₹{completedAppointment.totalAmount}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Payment Status</span>
                    <span className="font-semibold text-amber-300 capitalize">
                      {completedAppointment.paymentStatus === 'paid_full' ? '100% Paid Online' : completedAppointment.paymentStatus === 'paid_deposit' ? `₹${completedAppointment.depositPaid} Deposit Paid` : 'Pay at Reception'}
                    </span>
                  </div>
                </div>

                {/* Salon Location */}
                <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 text-[11px] text-stone-400 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-300 block">{settings.salonName}</strong>
                    <span>{settings.addressLine1}, {settings.addressLine2}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={downloadCalendarEvent}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg border border-stone-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 text-amber-400" />
                  <span>Add to Google / Apple Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewClientPortal();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>View in Client Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
