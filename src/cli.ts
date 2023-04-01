import { Command, Option } from "commander";
import { format } from "date-fns-jalali";
import fs from "fs";
import { mergeAll, range, xprod } from "ramda";
import { extractHolidays, fileExists } from "./core";
import { Holidays, LocalDate, Output } from "./types";

type CliOptions = {
  fromYear: string;
  fromMonth: string;
  toYear: string;
  toMonth: string;
  forceUpdate: boolean;
  scrapOccasions: boolean;
  outputFile: string;
};

const program = new Command();

const parseArgsIntoOptions = (rawArgs: string[]) => {
  program
    .addOption(new Option("--from-year <from-year>", "from year").default("1300").makeOptionMandatory())
    .addOption(new Option("--from-month <from-month>", "from month").default("1").makeOptionMandatory())
    .addOption(new Option("--to-year <to-year>", "to year").default("1450").makeOptionMandatory())
    .addOption(new Option("--to-month <to-month>", "to month").default("12").makeOptionMandatory())
    .addOption(new Option("--force-update", "force update the json completely").default(false).makeOptionMandatory())
    .addOption(new Option("--output-file <output-file>", "path of output file").makeOptionMandatory())
    .parse(rawArgs);

  program.showHelpAfterError();
  program.showSuggestionAfterError();

  return program.opts<CliOptions>();
};

const createOutput = (holidays: Holidays): Output => {
  const now = new Date();
  return { created_at: { year: format(now, "yyyy"), month: format(now, "MM") }, holidays };
};

const substituteLocalDate = (date1: LocalDate, date2: LocalDate): LocalDate => ({
  year: Math.max(+date1.year, +date2.year),
  month:
    +date1.year > +date2.year || (+date1.year === +date2.year && +date1.month >= +date2.month)
      ? +date1.month
      : +date2.month,
});

const createDatesArr = ({ from, to }: { from: LocalDate; to: LocalDate }): LocalDate[] => {
  const yearRange = range(+from.year, +to.year + 1);
  const monthRange = range(+from.month, +to.month + 1);
  return xprod(yearRange, monthRange).map(([year, month]) => ({ year, month }));
};

const cli = async (args: string[]): Promise<void> => {
  let options = parseArgsIntoOptions(args);

  const { forceUpdate, outputFile: path } = options;

  let oldHolidays: Holidays = {};
  let from: LocalDate = { year: options.fromYear, month: options.fromMonth },
    to: LocalDate = { year: options.toYear, month: options.toMonth };

  return fileExists(path)
    .then((exists) =>
      exists && !forceUpdate
        ? fs.promises.readFile(path, { encoding: "utf-8" }).then((json) => {
            const oldOutput = JSON.parse(json) as Output;
            oldHolidays = oldOutput.holidays;
            from = substituteLocalDate(oldOutput.created_at, from);
            return createDatesArr({ from, to });
          })
        : createDatesArr({ from, to })
    )
    .then((datesArr) => Promise.all(datesArr.map(extractHolidays)))
    .then((holidays) => createOutput({ ...oldHolidays, ...mergeAll(holidays) }))
    .then((output) => fs.promises.writeFile(path, JSON.stringify(output)));
};

cli(process.argv).catch((err) => {
  console.error(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
