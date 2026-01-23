// ScheduleContext.tsx
import { useAuth } from '@/AuthContext';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import api from '../../api/axiosInstance';

export type ScheduleType = 'HNST' | 'EXAM' | 'DEV' | 'EVAL' | 'NONE' | 'HOLI';

export interface ScheduledEvent {
  id: number;
  date: string;
  duty: ScheduleType;
  location: string;
  month: string;
  status:
    | 'VISITED'
    | 'IN_PROGRESS'
    | 'DDE_APPROVED'
    | 'DDE_REJECTED'
    | 'ADE_APPROVED'
    | 'ADE_REJECTED'
    | 'NOT_SUBMITTED';
}

interface ScheduleContextType {
  scheduledEvents: ScheduledEvent[];
  addEvent: (event: ScheduledEvent) => void;
  fetchMonthVisits: (month: string) => Promise<void>;
  fetchMonthVisitsApproved: (month: string) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
  const { id } = useAuth();

  const addEvent = (event: ScheduledEvent) => {
    setScheduledEvents((prev) => {
      const filtered = prev.filter(
        (e) => !(e.date === event.date && e.month === event.month)
      );
      return [...filtered, event];
    });
  };

  // Fetch all visits for a month (both approved and unapproved)
  const fetchMonthVisits = async (month: string) => {
    try {
      console.log(`📡 Fetching all visit data for ${month}...`);
      const response = await api.get(`visits/month/${month}${id}`);
      const visits = response.data.visits;

      if (Array.isArray(visits)) {
        const formatted: ScheduledEvent[] = visits.map((v: any) => ({
          id: v.id,
          date: v.visit_date?.toString() || '',
          duty: v.duty || 'NONE',
          location: v.location_name || '',
          month: v.month || month,
          status: v.status || 'NOT_SUBMITTED',
        }));

        setScheduledEvents((prev) => {
          const filteredPrev = prev.filter((e) => e.month !== month);
          return [...filteredPrev, ...formatted];
        });
        console.log('✅ All visits loaded for month:', month, formatted);
      } else {
        console.warn('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch visits:', error);
    }
  };

  // Fetch only approved visits for a month
  const fetchMonthVisitsApproved = async (month: string) => {
    try {
      console.log(`📡 Fetching approved visit data for ${month}...`);
      const response = await api.get(`/visits/approved/month/${month}`);
      const visits = response.data.visits;

      if (Array.isArray(visits)) {
        const formatted: ScheduledEvent[] = visits.map((v: any) => ({
          id: v.id,
          date: v.visit_date?.toString() || '',
          duty: v.duty || 'NONE',
          location: v.location_name || '',
          month: v.month || month,
          status: v.status || 'NOT_SUBMITTED',
        }));

        setScheduledEvents((prev) => {
          const filteredPrev = prev.filter((e) => e.month !== month);
          return [...filteredPrev, ...formatted];
        });
        console.log('✅ Approved visits loaded for month:', month, formatted);
      } else {
        console.warn('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch approved visits:', error);
    }
  };

  return (
    <ScheduleContext.Provider
      value={{
        scheduledEvents,
        addEvent,
        fetchMonthVisits,
        fetchMonthVisitsApproved,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context)
    throw new Error('useSchedule must be used within ScheduleProvider');
  return context;
};
