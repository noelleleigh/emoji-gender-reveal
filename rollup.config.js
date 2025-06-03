import clear from "rollup-plugin-clear";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";

// Both inputs will use the same output settings
const commonOutput = {
  dir: "dist",
  format: "esm",
  sourcemap: true,
};

// Both inputs use these plugin settings
const commonPlugins = [clear({ targets: ["dist"] }), json(), resolve()];

// Return the arguments for `rollup-plugin-copy`
const copyArgs = (filename) => {
  return {
    targets: [
      { src: `src/${filename}.html`, dest: "dist" },
      { src: `src/${filename}.css`, dest: "dist" },
    ],
  };
};

export default [
  {
    // Output for the user-facing page
    input: "src/client.js",
    output: commonOutput,
    plugins: [...commonPlugins, copy(copyArgs("client"))],
  },
];
