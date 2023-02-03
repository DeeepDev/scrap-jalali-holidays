import axios from "axios";
import { load } from "cheerio";
import { months } from "./months";

const getParams = (year: number, month: number) =>
  new URLSearchParams(`Year=${year}&Month=${month}&Base1=0&Base2=1&Base3=2&Responsive=true`);

const extractHolidays = async (year: number, month: number): Promise<string[]> => {
  const res = axios({
    method: "post",
    url: "https://www.time.ir/",
    data: getParams(year, month),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.then((body) => {
    const $ = load(body.data);

    const holidays = $(".holiday", ".eventCalendar")
      .not(".disabled .holiday")
      .children(".miladi")
      .get()
      .map((el) => $(el).text());

    const dates = $(".miladi", ".dates").text().replace("- ", "").split(" ");
    const range =
      dates.length === 3
        ? [
            [dates[0], dates[2]],
            [dates[1], dates[2]],
          ]
        : [
            [dates[0], dates[1]],
            [dates[2], dates[3]],
          ];

    let rangeIndex = 0;

    const isoHolidays = holidays.map((h, index) => {
      if (h < holidays[index - 1]) rangeIndex = 1;
      return `${range[rangeIndex][1]}-${months[range[rangeIndex][0]]}-${h}T00:00:00.000Z`;
    });

    console.log(`Extracted holidays successfully from month: ${month}, year: ${year}.`);

    return isoHolidays;
  });
};

extractHolidays(1401, 7).then(console.log);
