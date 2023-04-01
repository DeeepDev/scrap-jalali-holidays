import axios from "axios";
import fs from "fs";
import { fromPairs, keys } from "ramda";
import { Holidays, LocalDate, ResponseBody } from "./types";

const findHoliday = (item: ResponseBody[number]) => item.events.find((event) => event.holiday);

const getUrl = (year: LocalDate["year"], month: LocalDate["year"]) =>
  `https://badesaba.ir/api/site/getDataCalendar/${month}/${year}`;

export const extractHolidays = async ({ year, month }: LocalDate): Promise<Holidays> =>
  axios<ResponseBody>({ method: "post", url: getUrl(year, month) }).then(({ data }) => {
    const holidays: Holidays = fromPairs(
      data.filter(findHoliday).map((item) => [Date.parse(item.date), { occasion: findHoliday(item)!.event }])
    );

    console.log(`Extracted ${keys(holidays).length} holidays from ${year}/${month}`);
    return holidays;
  });

export const fileExists = async (path: string): Promise<boolean> =>
  fs.promises
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
