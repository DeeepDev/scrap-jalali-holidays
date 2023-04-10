import axios from "axios";
import chalk from "chalk";
import { fromPairs, keys } from "ramda";
import { Holidays, LocalDate, ResponseBody } from "./types";

const findHoliday = (item: ResponseBody[number]) => item.events.find((event) => event.holiday);

const getUrl = (year: LocalDate["year"], month: LocalDate["year"]) =>
  `https://badesaba.ir/api/site/getDataCalendar/${month}/${year}`;

export const extractHolidays = async ({ year, month }: LocalDate): Promise<Holidays> =>
  axios<ResponseBody>({ method: "post", url: getUrl(year, month) })
    .then(({ data }) => {
      const holidays: Holidays = fromPairs(
        data.filter(findHoliday).map((item) => [item.date, findHoliday(item)!.event])
      );

      console.log(`${chalk.bold.green("Success")}: Extracted ${keys(holidays).length} holidays from ${year}/${month}`);
      return holidays;
    })
    .catch((err) => {
      console.log(`${chalk.bold.red("Failure")}: Error in extracting holidays from ${year}/${month}`);
      throw err;
    });
