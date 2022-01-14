import { App, AppOptions, Plugin } from "@vuepress/core";
import { parser } from "posthtml-parser";
import { render } from "posthtml-render";
import { dirname, join, relative, resolve } from "path";
import { mergeConfig,normalizePath } from "vite";
import { resolveHtmlBlock } from "./resolveHtmlBlock";
const codeBlockPlugin = (_: AppOptions, app: App): Plugin => {
  const fileData: Record<string, Record<string, string>> = {};
  const wrapper = "demo";
  return {
    name: "vuepress-plugin-code-block",
    multiple: true,
    alias: {
      "@codeBlock": app.dir.source(),
    },
    clientAppEnhanceFiles: normalizePath(
      resolve(__dirname, "../client/clientAppEnhance.js")
    ),
    onInitialized: (app) => {
      if (app.options.bundler.endsWith("vite")) {
        // 当前是vite的情况下
        app.options.bundlerConfig.viteOptions = mergeConfig(
          app.options.bundlerConfig.viteOptions,
          {
            plugins: [],
          }
        );
      }
    },
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
            `import ${demoName} from "@codeBlock/${normalizePath(
              relativePath
            )}";`
          );
        }
        let flag = false;
        if (importData.length > 0) {
          if (page.hoistedTags && page.hoistedTags.length > 0) {
            let i = 0;
            for (const hoistedTag of page.hoistedTags) {
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
              page.hoistedTags[i] = render(html);
              i++;
            }
            if (!flag) {
              const myData = `<script setup lang="ts">\n${importData.join(
                "\n"
              )}\n</script>`;
              page.hoistedTags.push(myData);
            }
          } else {
            const myData = `<script setup lang="ts">\n${importData.join(
              "\n"
            )}\n</script>`;
            page.hoistedTags.push(myData);
          }
        }
      }
    },
  };
};
export default codeBlockPlugin;
