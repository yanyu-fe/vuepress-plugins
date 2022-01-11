import { RollupOptions } from "rollup";
import { build } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";
import * as minimist from "minimist";
import { omit } from "lodash-es";
const rollupOptions: RollupOptions = {
  external: ["vite", "vite-plugin-vitepress-demo", "path", "fs"],
  output: {
    exports: "named",
    globals: {
      vite: "vite",
      "vite-plugin-vitepress-demo": "vitePluginVitepressDemo",
      path: "path",
    },
  },
};

const plugins = [
  vuePlugin(),
  vueJsx(),
  dts({
    include: ["src/**/*"],
    insertTypesEntry: true,
    beforeWriteFile: (filePath, content) => {
      return {
        filePath: filePath.replace("src", ""),
        content,
      };
    },
  }),
];

const run = async () => {
  const argv = minimist(process.argv.slice(2), {
    boolean: ["watch", "w"],
  });
  const argvOptions = omit(argv, ["_"]);
  const params = argv._;
  const isWatch = params.includes("dev") || argvOptions.watch || argvOptions.w;
  await build({
    build: {
      rollupOptions,
      lib: {
        entry: "src/index.ts",
        name: "index",
        fileName: "index",
      },
      watch: isWatch ? {} : null,
    },
    plugins: [...plugins],
  });
};

run()
  .then(() => {
    console.log("打包完成");
  })
  .catch((err) => {
    console.log(err);
    console.log("打包失败");
  });
