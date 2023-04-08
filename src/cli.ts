import { Command, Option } from "commander";
import fs from "fs";
import { mergeAll } from "ramda";
import { extractHolidays } from "./core";
import { CliOptions, Holidays, LocalDate, Output } from "./types";
import { compareLocalDate, createDatesArr, createOutput, fileExists } from "./utils";

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

const cli = async (args: string[]): Promise<void> => {
  let options = parseArgsIntoOptions(args);

  const { forceUpdate, outputFile: path } = options;

  let oldHolidays: Holidays = {};
  let from: LocalDate = { year: +options.fromYear, month: +options.fromMonth },
    to: LocalDate = { year: +options.toYear, month: +options.toMonth };

  return fileExists(path)
    .then((exists) =>
      exists && !forceUpdate
        ? fs.promises.readFile(path, { encoding: "utf-8" }).then((json) => {
            const oldOutput = JSON.parse(json) as Output;
            oldHolidays = oldOutput.holidays;
            from = compareLocalDate(oldOutput.created_at, from) >= 0 ? oldOutput.created_at : from;
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

export { getHolidaysJsonKey } from "./utils";
