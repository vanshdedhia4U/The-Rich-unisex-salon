import React, { useState, useEffect } from 'react';
import { 
  SalonService, 
  Appointment, 
  Stylist, 
  GalleryItem, 
  SalonSettings, 
  AppointmentStatus 
} from './types';
import { Storage } from './lib/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { ExperienceSection } from './components/ExperienceSection';
import { LocationSection } from './components/LocationSection';
import { ClientDashboard } from './components/ClientDashboard';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPortal } from './components/AdminPortal';
import { Calendar, ChevronUp } from 'lucide-react';

export default function App() {
  // App persistent states
  const [services, setServices] = useState<SalonService[]>(() => Storage.getServices());
  const [appointments, setAppointments] = useState<Appointment[]>(() => Storage.getAppointments());
  const [stylists, setStylists] = useState<Stylist[]>(() => Storage.getStylists());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => Storage.getGallery());
  const [settings, setSettings] = useState<SalonSettings>(() => Storage.getSettings());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => Storage.isAdminAuthenticated());

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Selected services in booking tray
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [servicesForBooking, setServicesForBooking] = useState<SalonService[]>([]);

  // Toggle service in user's selection tray
  const handleToggleService = (service: SalonService) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(service.id)) {
        return prev.filter((id) => id !== service.id);
      } else {
        return [...prev, service.id];
      }
    });
  };

  // Instant booking from service card
  const handleInstantBook = (service: SalonService) => {
    setServicesForBooking([service]);
    setIsBookingOpen(true);
  };

  // Open booking tray with all selected services
  const handleOpenBookingTray = () => {
    const chosen = services.filter((s) => selectedServiceIds.includes(s.id));
    setServicesForBooking(chosen.length > 0 ? chosen : [services[0]]);
    setIsBookingOpen(true);
  };

  // Book directly from lookbook style click
  const handleBookStyle = (serviceId?: string) => {
    if (serviceId) {
      const match = services.find((s) => s.id === serviceId);
      if (match) {
        setServicesForBooking([match]);
        setIsBookingOpen(true);
        return;
      }
    }
    setServicesForBooking([services[0]]);
    setIsBookingOpen(true);
  };

  // General "Book Appointment" CTA
  const handleGeneralBookingOpen = () => {
    const chosen = services.filter((s) => selectedServiceIds.includes(s.id));
    setServicesForBooking(chosen.length > 0 ? chosen : [services[0]]);
    setIsBookingOpen(true);
  };

  // On client booking completed
  const handleBookingConfirmed = (newAppt: Appointment) => {
    const updated = Storage.createAppointment(newAppt);
    setAppointments(updated);
    setSelectedServiceIds([]);
  };

  // Reschedule
  const handleReschedule = (id: string, newDate: string, newTime: string) => {
    const updated = Storage.rescheduleAppointment(id, newDate, newTime);
    setAppointments(updated);
  };

  // Cancel appointment
  const handleCancelAppointment = (id: string) => {
    const updated = Storage.cancelAppointment(id);
    setAppointments(updated);
  };

  // Admin Actions
  const handleAdminLogin = () => {
    Storage.setAdminAuthenticated(true);
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    Storage.setAdminAuthenticated(false);
    setIsAdmin(false);
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;
    const updatedAppt = { ...appt, status, updatedAt: new Date().toISOString() };
    const list = Storage.updateAppointment(updatedAppt);
    setAppointments(list);
  };

  const handleDeleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    Storage.saveAppointments(updated);
    setAppointments(updated);
  };

  const handleAddService = (newService: SalonService) => {
    const updated = Storage.addService(newService);
    setServices(updated);
  };

  const handleUpdateService = (updatedService: SalonService) => {
    const updated = Storage.updateService(updatedService);
    setServices(updated);
  };

  const handleDeleteService = (id: string) => {
    const updated = Storage.deleteService(id);
    setServices(updated);
  };

  const handleAddGalleryItem = (item: GalleryItem) => {
    const updated = Storage.addGalleryItem(item);
    setGallery(updated);
  };

  const handleDeleteGalleryItem = (id: string) => {
    const updated = Storage.deleteGalleryItem(id);
    setGallery(updated);
  };

  const handleUpdateSettings = (newSettings: SalonSettings) => {
    Storage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleResetData = () => {
    Storage.resetAllData();
    setServices(Storage.getServices());
    setAppointments(Storage.getAppointments());
    setStylists(Storage.getStylists());
    setGallery(Storage.getGallery());
    setSettings(Storage.getSettings());
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Header */}
      <Header
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={handleGeneralBookingOpen}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          settings={settings}
          onOpenBooking={handleGeneralBookingOpen}
          onExploreServices={() => {
            const el = document.getElementById('services');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreLookbook={() => {
            const el = document.getElementById('lookbook');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Essential Services Menu & Pricing */}
        <ServicesSection
          services={services}
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
          onInstantBook={handleInstantBook}
          onOpenBookingTray={handleOpenBookingTray}
        />

        {/* Lookbook Transformations Gallery */}
        <GallerySection
          gallery={gallery}
          services={services}
          onBookStyle={handleBookStyle}
        />

        {/* Salon Experience & Certified Team */}
        <ExperienceSection
          stylists={stylists}
          onOpenBooking={handleGeneralBookingOpen}
        />

        {/* Prime Location & Google Maps */}
        <LocationSection
          settings={settings}
          onOpenBooking={handleGeneralBookingOpen}
        />

        {/* Client Portal & Self-Service */}
        <ClientDashboard
          appointments={appointments}
          settings={settings}
          onReschedule={handleReschedule}
          onCancel={handleCancelAppointment}
          onBookNew={handleGeneralBookingOpen}
        />
      </main>

      {/* Understated Luxury Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={handleGeneralBookingOpen}
      />

      {/* Mobile Sticky Booking CTA Bar (stays under 15% mobile viewport height) */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-30">
        <button
          onClick={handleGeneralBookingOpen}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 text-sm border border-amber-300/40"
        >
          <Calendar className="w-4 h-4 text-stone-950" />
          <span>Book Appointment Online</span>
        </button>
      </div>

      {/* Interactive Online Appointment Scheduler Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        allServices={services}
        allStylists={stylists}
        initialSelectedServices={servicesForBooking}
        settings={settings}
        existingAppointments={appointments}
        onBookingConfirmed={handleBookingConfirmed}
        onViewClientPortal={() => {
          const el = document.getElementById('client-portal');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Owner Admin Control Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        appointments={appointments}
        services={services}
        gallery={gallery}
        settings={settings}
        stylists={stylists}
        onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
        onDeleteAppointment={handleDeleteAppointment}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        onAddGalleryItem={handleAddGalleryItem}
        onDeleteGalleryItem={handleDeleteGalleryItem}
        onUpdateSettings={handleUpdateSettings}
        onResetData={handleResetData}
      />
    </div>
  );
}
