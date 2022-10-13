import { Plugin, HmrContext, normalizePath } from "vite";
import { App } from "@vuepress/core";
import { handlePageChange } from "@vuepress/cli";
import fsExtra from "fs-extra";
const { existsSync } = fsExtra;

const codeBlockHMR = (app: App): Plugin => {
  return {
    name: "vite-plugin-code-block-hmr",
    enforce: "post",
    handleHotUpdate(ctx: HmrContext) {
      const temp = normalizePath(app.dir.temp());
      const source = normalizePath(app.dir.source());
      for (const module of ctx.modules) {
        for (const moduleElement of module.importers) {
          if (moduleElement.file?.endsWith(".html.vue")) {
            const filePath = moduleElement.file
              ?.replace(temp + "/pages", source)
              .replace(".html.vue", ".md");
            if (filePath && existsSync(filePath)) {
              handlePageChange(app, filePath);
            }
          }
        }
      }
    },
  };
};

export default codeBlockHMR;
