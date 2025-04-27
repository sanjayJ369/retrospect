export interface CalendarDay {
  day: number;
  score: number;
}

export interface CalendarMonth {
  month: number; // 1-jan, 2-feb, ...
  days: CalendarDay[];
}

export interface CalendarYear {
  year: number;
  months: CalendarMonth[];
}
