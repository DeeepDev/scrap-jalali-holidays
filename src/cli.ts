import Ajv from "ajv";
import { Command, Option } from "commander";
import fs from "fs";
import { mergeAll } from "ramda";
import { extractHolidays } from "./core";
import { cliOptionsSchema } from "./schema";
import { CliOptions, Holidays, LocalDate, LocalDateTuple, Output } from "./types";
import { compareLocalDate, createDatesArr, createOutput, fileExists } from "./utils";

const ajv = new Ajv({ useDefaults: true, allErrors: true });
const validate = ajv.compile<CliOptions>(cliOptionsSchema);

const dateParser = (arg: string) => arg.split("-").map(parseFloat) as LocalDateTuple;

const program = new Command();

const parseArgsIntoOptions = (rawArgs: string[]) => {
  program
    .addOption(new Option("--from <from>", "from date").argParser(dateParser))
    .addOption(new Option("--to <to>", "to date").argParser(dateParser))
    .addOption(new Option("--force-update", "force update the json completely"))
    .addOption(new Option("--output-file <output-file>", "path of output file"))
    .parse(rawArgs);

  program.showHelpAfterError();
  program.showSuggestionAfterError();

  return program.opts();
};

const cli = async (args: string[]): Promise<void> => {
  let options = parseArgsIntoOptions(args);

  if (validate(options)) {
    const { forceUpdate, outputFile: path } = options;

    let oldHolidays: Holidays = {};
    let from: LocalDate = { year: options.from[0], month: options.from[1] },
      to: LocalDate = { year: options.to[0], month: options.to[1] };

    return fileExists(path)
      .then((exists) =>
        exists && !forceUpdate
          ? fs.promises.readFile(path, { encoding: "utf-8" }).then((json) => {
              // TODO: validate json file with ajv
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
  } else {
    throw Error(validate.errors?.map((err) => err.instancePath + " " + err.message).join(", "));
  }
};

cli(process.argv).catch((err) => {
  console.error(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
