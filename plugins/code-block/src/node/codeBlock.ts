import { App, Plugin } from "@vuepress/core";
import { dirname, join, relative, resolve } from "path";
import { normalizePath } from "vite";
import { resolveHtmlBlock } from "./resolveHtmlBlock";
import codeBlockHMR from "./codeBlockHMR";
import { fileURLToPath } from "url";
export interface UserOptions {
  wrapper?: string;
  alias?: string;
  [key: string]: any;
}
const __dirname = dirname(fileURLToPath(new URL(import.meta.url)));
console.log(__dirname);
const codeBlockPlugin =
  (_?: UserOptions): Plugin =>
  (app: App) => {
    const fileData: Record<string, Record<string, string>> = {};
    const wrapper = _?.wrapper || "demo";
    const alias = _?.alias || "YANYU_FE_CODE_BLOCK";
    return {
      name: "vuepress-plugin-code-block",
      multiple: true,
      alias: {
        [`@${alias}`]: app.dir.source(),
      },
      clientConfigFile: normalizePath(
        resolve(__dirname, "../../dist/client/config.mjs")
      ),
      extendsMarkdown: (md) => {
        resolveHtmlBlock(md as any, fileData, wrapper);
      },
      extendsPage: (page, app) => {
        const filePath = page.filePath;
        if (Object.keys(fileData).includes(filePath as string)) {
          // 包含，拿到数据
          const importData: string[] = [];
          const imports = fileData[filePath as string];
          for (const importsKey in imports) {
            const dirName = dirname(filePath as string);
            const demoName = imports[importsKey];
            const demoPath = join(dirName, importsKey);
            const relativePath = relative(app.dir.source(), demoPath);
            importData.push(
              `import ${demoName} from "@${alias}/${normalizePath(
                relativePath
              )}";`
            );
          }
          const myData = `${importData.join("\n")}`;
          if (importData.length > 0) {
            if (page.sfcBlocks && page.sfcBlocks.scriptSetup) {
              const content = `${page.sfcBlocks.scriptSetup.tagOpen}
${myData}
${page.sfcBlocks.scriptSetup.contentStripped}
${page.sfcBlocks.scriptSetup.tagClose}`;
              page.sfcBlocks.scriptSetup = {
                ...page.sfcBlocks.scriptSetup,
                content,
                contentStripped:
                  myData + page.sfcBlocks.scriptSetup.contentStripped,
              };
            } else {
              const content = `<script setup>
${myData}
</script>`;
              page.sfcBlocks.scriptSetup = {
                type: "script",
                content,
                contentStripped: myData,
                tagOpen: `<script setup>`,
                tagClose: "</script>",
              };
            }
          }
        }
      },
      extendsBundlerOptions: (options, app) => {
        if (app.options.bundler.name.endsWith("vite")) {
          if (options.viteOptions?.plugins) {
            options.viteOptions.plugins.push(codeBlockHMR(app));
          } else {
            options.viteOptions = {
              plugins: [codeBlockHMR(app)],
            };
          }
        }
      },
    };
  };
export default codeBlockPlugin;
