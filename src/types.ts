export type LocalDateTuple = [number, number];

export type CliOptions = {
  from: LocalDateTuple;
  to: LocalDateTuple;
  scrapOccasions: boolean;
  outputExt: "js" | "json";
  outputDir: string;
};

export type LocalDate = { year: number; month: number };
export type Holiday = string | 1;
export type Holidays = Record<string, Holiday>;
export type Output = { created_at: LocalDate; holidays: Holidays };

export type TEvent = { event: string; holiday: boolean };
export type TDateInfo = { date: string; events: TEvent[] };
export type ResponseBody = TDateInfo[];
