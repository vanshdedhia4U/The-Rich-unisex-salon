import { 
  SalonService, 
  Appointment, 
  Stylist, 
  GalleryItem, 
  SalonSettings,
  ClientProfile 
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_STYLISTS, 
  INITIAL_GALLERY, 
  INITIAL_SETTINGS 
} from '../data/mockData';

const STORAGE_KEYS = {
  SERVICES: 'rich_salon_services_v1',
  APPOINTMENTS: 'rich_salon_appointments_v1',
  STYLISTS: 'rich_salon_stylists_v1',
  GALLERY: 'rich_salon_gallery_v1',
  SETTINGS: 'rich_salon_settings_v1',
  CURRENT_CLIENT: 'rich_salon_current_client_v1',
  ADMIN_AUTH: 'rich_salon_admin_auth_v1',
};

// Safe JSON parser
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const Storage = {
  // Services
  getServices: (): SalonService[] => {
    return safeGet<SalonService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveServices: (services: SalonService[]): void => {
    safeSet(STORAGE_KEYS.SERVICES, services);
  },
  addService: (newService: SalonService): SalonService[] => {
    const services = Storage.getServices();
    const updated = [newService, ...services];
    Storage.saveServices(updated);
    return updated;
  },
  updateService: (updatedService: SalonService): SalonService[] => {
    const services = Storage.getServices();
    const updated = services.map(s => s.id === updatedService.id ? updatedService : s);
    Storage.saveServices(updated);
    return updated;
  },
  deleteService: (id: string): SalonService[] => {
    const services = Storage.getServices();
    const updated = services.filter(s => s.id !== id);
    Storage.saveServices(updated);
    return updated;
  },

  // Appointments
  getAppointments: (): Appointment[] => {
    return safeGet<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },
  saveAppointments: (appointments: Appointment[]): void => {
    safeSet(STORAGE_KEYS.APPOINTMENTS, appointments);
  },
  createAppointment: (appointment: Appointment): Appointment[] => {
    const appointments = Storage.getAppointments();
    const updated = [appointment, ...appointments];
    Storage.saveAppointments(updated);
    return updated;
  },
  updateAppointment: (updatedAppt: Appointment): Appointment[] => {
    const appointments = Storage.getAppointments();
    const updated = appointments.map(a => a.id === updatedAppt.id ? updatedAppt : a);
    Storage.saveAppointments(updated);
    return updated;
  },
  cancelAppointment: (id: string): Appointment[] => {
    const appointments = Storage.getAppointments();
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'cancelled' as const, updatedAt: new Date().toISOString() } : a);
    Storage.saveAppointments(updated);
    return updated;
  },
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string): Appointment[] => {
    const appointments = Storage.getAppointments();
    const updated = appointments.map(a => a.id === id ? { ...a, date: newDate, timeSlot: newTimeSlot, updatedAt: new Date().toISOString() } : a);
    Storage.saveAppointments(updated);
    return updated;
  },

  // Stylists
  getStylists: (): Stylist[] => {
    return safeGet<Stylist[]>(STORAGE_KEYS.STYLISTS, INITIAL_STYLISTS);
  },
  saveStylists: (stylists: Stylist[]): void => {
    safeSet(STORAGE_KEYS.STYLISTS, stylists);
  },

  // Gallery
  getGallery: (): GalleryItem[] => {
    const stored = safeGet<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    return stored.map((item) => {
      if (!item.imageUrl) {
        const found = INITIAL_GALLERY.find((g) => g.id === item.id);
        return { ...item, imageUrl: found?.imageUrl || 'images/salon_interior.jpg' };
      }
      return item;
    });
  },
  saveGallery: (gallery: GalleryItem[]): void => {
    safeSet(STORAGE_KEYS.GALLERY, gallery);
  },
  addGalleryItem: (item: GalleryItem): GalleryItem[] => {
    const items = Storage.getGallery();
    const updated = [item, ...items];
    Storage.saveGallery(updated);
    return updated;
  },
  deleteGalleryItem: (id: string): GalleryItem[] => {
    const items = Storage.getGallery();
    const updated = items.filter(g => g.id !== id);
    Storage.saveGallery(updated);
    return updated;
  },

  // Settings
  getSettings: (): SalonSettings => {
    const s = safeGet<SalonSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    if (!s.addressLine1 || s.addressLine1.includes('NISARG')) {
      Storage.saveSettings(INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
    return s;
  },
  saveSettings: (settings: SalonSettings): void => {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  // Current client quick lookup
  getCurrentClient: (): ClientProfile | null => {
    return safeGet<ClientProfile | null>(STORAGE_KEYS.CURRENT_CLIENT, null);
  },
  saveCurrentClient: (client: ClientProfile | null): void => {
    safeSet(STORAGE_KEYS.CURRENT_CLIENT, client);
  },

  // Admin Auth Status
  isAdminAuthenticated: (): boolean => {
    return safeGet<boolean>(STORAGE_KEYS.ADMIN_AUTH, false);
  },
  setAdminAuthenticated: (status: boolean): void => {
    safeSet(STORAGE_KEYS.ADMIN_AUTH, status);
  },

  // Reset to initial demo state
  resetAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.STYLISTS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CLIENT);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};
