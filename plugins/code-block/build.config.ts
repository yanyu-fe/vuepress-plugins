import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    {
      builder: "mkdist",
      input: "src/client",
      outDir: "dist/client",
    },
    {
      builder: "rollup",
      input: "src/node/index",
    },
  ],
  outDir: "dist/node",
  declaration: true,
});
