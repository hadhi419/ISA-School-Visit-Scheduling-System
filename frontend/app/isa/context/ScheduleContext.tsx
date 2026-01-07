import axios from 'axios';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export type ScheduleType = 'HNST' | 'EXAM' | 'DEV' | 'EVAL' | 'NONE' | 'HOLI';

export interface ScheduledEvent {
    date: string; 
    duty: ScheduleType;
    location: number;
}

interface ScheduleContextType {
    scheduledEvents: ScheduledEvent[];
    scheduledEventsApproved: ScheduledEvent[];
    addScheduleEvent: (event: ScheduledEvent) => void;
    fetchMonthVisits: (monthName: string) => Promise<void>;
    fetchMonthVisitsApproved: (monthName: string) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
    const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
    const [scheduledEventsApproved, setScheduledEventsApproved] = useState<ScheduledEvent[]>([]);

    const addScheduleEvent = (event: ScheduledEvent) => {

        console.log("Haaaaaaaaaaaaaaadhii")
        setScheduledEvents(prev => {
            const existingIndex = prev.findIndex(e => e.date === event.date);
            if (existingIndex !== -1) {
                const newEvents = [...prev];
                newEvents[existingIndex] = event;
                return newEvents;
            }
            return [...prev, event];
        });
    };

    const fetchMonthVisits = useCallback(async (monthName: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/visits/month/${monthName}/5`);
            const remoteEvents: ScheduledEvent[] = response.data.visits.map((item: any) => ({
                date: item.visit_date.toString(),
                duty: item.duty as ScheduleType,
            }));

            setScheduledEvents(prev => {
                const newMap = new Map<string, ScheduledEvent>();
                remoteEvents.forEach(event => newMap.set(event.date, event));
                prev.forEach(event => {
                    const isRelevantMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, Number(event.date))
                        .toLocaleString('default', { month: 'long' });
                    if (isRelevantMonth === monthName) newMap.set(event.date, event);
                });
                return Array.from(newMap.values());
            });
        } catch (error) {
            console.error('Failed to fetch visits:', error);
        }
    }, []);

    const fetchMonthVisitsApproved = useCallback(async (monthName: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/visits/approved/month/${monthName}/5`);
            const remoteEvents: ScheduledEvent[] = response.data.visits.map((item: any) => ({
                date: item.visit_date.toString(),
                duty: item.duty as ScheduleType,
            }));

            setScheduledEventsApproved(prev => {
                const newMap = new Map<string, ScheduledEvent>();
                remoteEvents.forEach(event => newMap.set(event.date, event));
                prev.forEach(event => {
                    const isRelevantMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, Number(event.date))
                        .toLocaleString('default', { month: 'long' });
                    if (isRelevantMonth === monthName) newMap.set(event.date, event);
                });
                return Array.from(newMap.values());
            });
        } catch (error) {
            console.error('Failed to fetch approved visits:', error);
        }
    }, []);

    return (
        <ScheduleContext.Provider value={{
            scheduledEvents,
            scheduledEventsApproved,
            addScheduleEvent,
            fetchMonthVisits,
            fetchMonthVisitsApproved
        }}>
            {children}
        </ScheduleContext.Provider>
    );
};

// Custom hook
export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) throw new Error('useSchedule must be used within ScheduleProvider');
    return context;
};
