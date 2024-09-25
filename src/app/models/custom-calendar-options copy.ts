import { CalendarOptions } from "@fullcalendar/core";

export interface CustomCalendarOptions extends CalendarOptions {
    dayClick?: (info: Date)=>void; 
    // date:Date;
  }