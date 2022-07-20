import { App, Plugin } from "@vuepress/core";
import { parser } from "posthtml-parser";
import { render } from "posthtml-render";
import { dirname, join, relative, resolve } from "path";
import { normalizePath } from "vite";
import { resolveHtmlBlock } from "./resolveHtmlBlock";
import codeBlockHMR from "./codeBlockHMR";
export interface UserOptions {
  wrapper?: string;
  alias?: string;
  [key: string]: any;
}
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
        resolve(__dirname, "../client/config.js")
      ),
      extendsMarkdown: (md) => {
        resolveHtmlBlock(md, fileData, wrapper);
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
          let flag = false;
          if (importData.length > 0) {
            if (page.sfcBlocks && page.sfcBlocks.length > 0) {
              let i = 0;
              for (const hoistedTag of page.sfcBlocks) {
                const html = parser(hoistedTag);
                for (const htmlElement of html) {
                  if (
                    typeof htmlElement === "object" &&
                    htmlElement.tag === "script"
                  ) {
                    flag = true;
                    // 定义当前的信息
                    if (htmlElement.content instanceof Array) {
                      htmlElement.content = [
                        ...importData,
                        ...htmlElement.content,
                      ];
                    } else {
                      if (htmlElement.content) {
                        htmlElement.content = [
                          ...importData,
                          htmlElement.content,
                        ];
                      } else {
                        htmlElement.content = importData;
                      }
                    }
                  }
                }
                page.sfcBlocks[i] = render(html);
                i++;
              }
              if (!flag) {
                const myData = `<script setup lang="ts">\n${importData.join(
                  "\n"
                )}\n</script>`;
                page.sfcBlocks.push(myData);
              }
            } else {
              const myData = `<script setup lang="ts">\n${importData.join(
                "\n"
              )}\n</script>`;
              page.sfcBlocks.push(myData);
            }
          }
        }
      },
      extendsBundlerOptions: (options, app) => {
        if (app.options.bundler.name.endsWith("vite")) {
          if (options.viteOptions.plugins) {
            options.viteOptions.plugins.push(codeBlockHMR(app));
          } else {
            options.viteOptions.plugins = [codeBlockHMR(app)];
          }
        }
      },
    };
  };
export default codeBlockPlugin;
