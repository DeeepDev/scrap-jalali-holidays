import { format } from "date-fns-jalali";
import fs from "fs";
import { Holidays, LocalDate, Output } from "./types";

export const addLeadingZeroIfSingle = (num: number): string => String(num).padStart(2, "0");

export const createOutput = (holidays: Holidays): Output => {
  const now = new Date();
  return { created_at: { year: +format(now, "yyyy"), month: +format(now, "MM") }, holidays };
};

export const compareLocalDate = (date1: LocalDate, date2: LocalDate): 1 | 0 | -1 => {
  const diff = date1.year * 12 + date1.month - (date2.year * 12 + date2.month);
  return diff > 0 ? 1 : diff < 0 ? -1 : 0;
};

export const createDatesArr = ({ from, to }: { from: LocalDate; to: LocalDate }): LocalDate[] => {
  const output: LocalDate[] = [];
  let totalMonths = from.year * 12 + from.month;
  let year, month;

  while (totalMonths <= to.year * 12 + to.month) {
    year = Math.floor(totalMonths / 12);
    month = totalMonths % 12;

    if (month === 0) {
      year = year - 1;
      month = 12;
    }

    output.push({ year, month });
    totalMonths++;
  }

  return output;
};

export const fileExists = async (path: string): Promise<boolean> =>
  fs.promises
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

/**
 *
 * @param date - JS Date object
 * @returns date in `YYYY/MM/DD` format, used for lookup in scrap-jalali-holidays output json
 */
export const getHolidaysJsonKey = (date: Date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(addLeadingZeroIfSingle).join("-");
