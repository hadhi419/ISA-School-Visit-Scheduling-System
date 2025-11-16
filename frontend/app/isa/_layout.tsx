import { Stack } from "expo-router";
import { ScheduleProvider } from "./context/ScheduleContext"; 

export default function ISALayout() {
 return (
  <ScheduleProvider>
     <Stack />
   </ScheduleProvider>
 );
}