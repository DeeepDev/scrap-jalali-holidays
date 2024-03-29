import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import shebang from "rollup-plugin-shebang-bin";

export default [
  {
    input: "src/cli.ts",
    output: {
      file: "dist/cli.mjs",
      format: "es",
      compact: true,
    },
    plugins: [typescript(), terser(), shebang({ include: ["**/*.ts"] })],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "es",
      compact: true,
    },
    plugins: [typescript({ declaration: true, declarationDir: "types", include: ["src/{index,utils}.ts"] }), terser()],
  },
];
