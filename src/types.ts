export type LocalDate = { year: string | number; month: string | number };
export type Holiday = { occasion?: string };
export type Holidays = Record<string, Holiday>;
export type Output = { created_at: LocalDate; holidays: Holidays };

export type TEvent = { event: string; holiday: boolean };
export type TDateInfo = { date: string; events: TEvent[] };
export type ResponseBody = TDateInfo[];
