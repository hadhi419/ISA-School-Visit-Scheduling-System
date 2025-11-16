import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import axios from 'axios';

export type ScheduleType = 'HNST' | 'EXAM' | 'DEV' | 'EVAL' | 'NONE' | 'HOLIDAY';

export interface ScheduledEvent {
    date: string; 
    duty: ScheduleType;
}

interface ScheduleContextType {
    scheduledEvents: ScheduledEvent[];
    addScheduleEvent: (event: ScheduledEvent) => void;
    fetchMonthVisits: (monthName: string) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
    const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);

    const addScheduleEvent = (event: ScheduledEvent) => {
        setScheduledEvents(prev => {
            const existingIndex = prev.findIndex(e => e.date === event.date);
            if (existingIndex !== -1) {
                // Update existing event (e.g., changing duty for the same date)
                const newEvents = [...prev];
                newEvents[existingIndex] = event;
                return newEvents;
            }
            // Add new event
            return [...prev, event];
        });
    };
    
    const fetchMonthVisits = useCallback(async (monthName: string) => {
        try {
            // Placeholder: Replace with your actual endpoint
            const response = await axios.get(`http://localhost:5000/api/visits?month=${monthName}`); 
            const remoteEvents: ScheduledEvent[] = response.data.map((item: any) => ({
                // Ensure the remote data is mapped to the correct ScheduledEvent format
                date: item.visit_date.toString(),
                duty: item.duty as ScheduleType,
            }));
            
            setScheduledEvents(prev => {
                const newMap = new Map<string, ScheduledEvent>();
                
                // 1. Add all *remote* events first (base schedule from server)
                remoteEvents.forEach(event => newMap.set(event.date, event));
                
                // 2. Overwrite/add with existing *local* events (preserves unsaved changes like HOLIDAY)
                prev.forEach(event => {
                    // Quick check to ensure we only merge events relevant to the current month being fetched
                    const isRelevantMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, Number(event.date))
                        .toLocaleString('default', { month: 'long' });
                        
                    if (isRelevantMonth === monthName) {
                        newMap.set(event.date, event);
                    }
                });

                return Array.from(newMap.values());
            });

        } catch (error) {
            console.error('Failed to fetch visits:', error);
            // Optionally, clear events or keep existing ones if fetch fails
        }
    }, []); 

    return (
        <ScheduleContext.Provider value={{ scheduledEvents, addScheduleEvent, fetchMonthVisits }}>
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