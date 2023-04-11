import { JSONSchemaType } from "ajv";
import { CliOptions } from "./types";

export const cliOptionsSchema: JSONSchemaType<CliOptions> = {
  type: "object",
  properties: {
    from: {
      type: "array",
      items: [{ type: "integer" }, { type: "integer", minimum: 1, maximum: 12 }],
      minItems: 2,
      additionalItems: false,
      default: [1350, 1],
    },
    to: {
      type: "array",
      items: [{ type: "integer" }, { type: "integer", minimum: 1, maximum: 12 }],
      minItems: 2,
      additionalItems: false,
      default: [1450, 12],
    },
    outputExt: { type: "string", enum: ["js", "json"], default: "js" },
    outputDir: { type: "string" },
  },
  required: ["outputDir"],
};
