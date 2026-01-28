import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Job {
  id: string;
  visitCharges: number;
  customerName: string;
  customerPhone: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  category: string;
  subcategory: string;
  bookingType: 'bookNow' | 'scheduled';
  scheduledDateTime?: string;
  description: string;
  images: string[];
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'job' | 'reminder' | 'system';
}

interface ProviderProfile {
  profilePhoto: string;
  name: string;
  email: string;
  contactNumber: string;
  cnicNumber: string;
  cnicFront: string;
  cnicBack: string;
  criminalClearance?: string;
  skills: { category: string; subcategories: string[] }[];
  certifications: string[];
  isApproved: boolean;
  rating: number;
  reviews: { rating: number; comment: string; date: string }[];
}

interface AppContextType {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
  locationShared: boolean;
  setLocationShared: (value: boolean) => void;
  currentLocation: { latitude: number; longitude: number } | null;
  setCurrentLocation: (location: { latitude: number; longitude: number } | null) => void;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  profile: ProviderProfile | null;
  setProfile: (profile: ProviderProfile | null) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isOnline,
        setIsOnline,
        locationShared,
        setLocationShared,
        currentLocation,
        setCurrentLocation,
        jobs,
        setJobs,
        notifications,
        setNotifications,
        profile,
        setProfile,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
