import Ajv from "ajv";
import { Command, Option } from "commander";
import fs from "fs";
import path from "path";
import { mergeAll } from "ramda";
import { extractHolidays } from "./core";
import { cliOptionsSchema } from "./schema";
import { CliOptions, LocalDate, LocalDateTuple } from "./types";
import { createDatesArr, createOutput } from "./utils";

const ajv = new Ajv({ useDefaults: true, allErrors: true });
const validate = ajv.compile<CliOptions>(cliOptionsSchema);

const dateParser = (arg: string) => arg.split("-").map(parseFloat) as LocalDateTuple;

const program = new Command();

const parseArgsIntoOptions = (rawArgs: string[]) => {
  program
    .addOption(new Option("--from <from>", "from date").argParser(dateParser))
    .addOption(new Option("--to <to>", "to date").argParser(dateParser))
    .addOption(new Option("--scrap-occasions", "whether to scrap occasions or not"))
    .addOption(new Option("--output-ext <output-ext>", "extension of output file"))
    .addOption(new Option("--output-dir <output-dir>", "dir of output file"))
    .parse(rawArgs);

  program.showHelpAfterError();
  program.showSuggestionAfterError();

  return program.opts();
};

const cli = async (args: string[]): Promise<void> => {
  let options = parseArgsIntoOptions(args);

  if (validate(options)) {
    const { outputDir, outputExt, scrapOccasions } = options;

    const from: LocalDate = { year: options.from[0], month: options.from[1] },
      to: LocalDate = { year: options.to[0], month: options.to[1] };

    return Promise.all(createDatesArr({ from, to }).map((localDate) => extractHolidays(localDate, scrapOccasions)))
      .then((holidays) => createOutput(mergeAll(holidays)))
      .then((output) => {
        let outputString = "";

        if (outputExt === "js")
          outputString = `/*eslint-disable*/\n//prettier-ignore\nexport default ${JSON.stringify(output)}`;
        else if (outputExt === "json") outputString = JSON.stringify(output);

        return fs.promises.writeFile(path.join(outputDir, `jalali-holidays.${outputExt}`), outputString);
      });
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
