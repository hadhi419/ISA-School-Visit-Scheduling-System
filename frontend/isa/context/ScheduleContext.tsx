// ScheduleContext.tsx
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type ScheduleType = 'HNST' | 'EXAM' | 'DEV' | 'EVAL' | 'NONE' | 'HOLIDAY';

export interface ScheduledEvent {
  date: string;
  duty: ScheduleType;
  location: string;
  month: string;
}

interface ScheduleContextType {
  scheduledEvents: ScheduledEvent[];
  addEvent: (event: ScheduledEvent) => void;
  fetchMonthVisits: (month: string) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);

  // Add or update an event
  const addEvent = (event: ScheduledEvent) => {
    setScheduledEvents(prev => {
      // Remove any existing event for same date AND same month
      const filtered = prev.filter(e => !(e.date === event.date && e.month === event.month));
      return [...filtered, event];
    });
  };

  // Fetch visits for a specific month
  const fetchMonthVisits = async (month: string) => {
    try {
      console.log(`📡 Fetching visit data for ${month}...`);
      const response = await axios.get(`http://172.16.30.146:5000/api/visits/month/${month}`);
      const visits = response.data.visits;

      if (Array.isArray(visits)) {
        const formatted: ScheduledEvent[] = visits.map((v: any) => ({
          date: v.visit_date?.toString() || '',
          duty: v.duty || 'NONE',
          location: v.location_name || '',
          month: v.month || month,
        }));

        // Merge fetched events with existing local state
        setScheduledEvents(prev => {
          // Remove previous events for this month
          const filteredPrev = prev.filter(e => e.month !== month);
          // Merge
          return [...filteredPrev, ...formatted];
        });

        console.log('✅ Visits loaded for month:', month, formatted);
      } else {
        console.warn('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch visits:', error);
    }
  };

  return (
    <ScheduleContext.Provider value={{ scheduledEvents, addEvent, fetchMonthVisits }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedule must be used within ScheduleProvider');
  return context;
};
