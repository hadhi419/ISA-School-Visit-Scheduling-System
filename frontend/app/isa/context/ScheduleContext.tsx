import React, { createContext, ReactNode, useContext, useState } from 'react';

export type ScheduleType = 'HNST' | 'EXAM' | 'DEV' | 'EVAL' | 'NONE' | 'HOLIDAY';

export interface ScheduledEvent {
  date: string; // you can keep it string for simplicity
  duty: ScheduleType;
  location: string;
}

interface ScheduleContextType {
  scheduledEvents: ScheduledEvent[];
  addEvent: (event: ScheduledEvent) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);

  const addEvent = (event: ScheduledEvent) => {
    // Replace existing event for same date/duty
    setScheduledEvents(prev => {
      const filtered = prev.filter(e => !(e.date === event.date && e.duty === event.duty));
      return [...filtered, event];
    });
  };

  return (
    <ScheduleContext.Provider value={{ scheduledEvents, addEvent }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Custom hook to use context
export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedule must be used within ScheduleProvider');
  return context;
};
