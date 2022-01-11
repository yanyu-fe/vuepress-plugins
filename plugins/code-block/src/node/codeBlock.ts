import { App, AppOptions, Plugin } from "@vuepress/core";
import { resolveHighlighter } from "@vuepress/plugin-prismjs";
import { parser, Node, Content } from "posthtml-parser";
import { render } from "posthtml-render";
import { dirname, join, extname, relative, resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { mergeConfig } from "vite";
const codeBlockPlugin = (_: AppOptions, app: App): Plugin => {
  const fileData: Record<string, Record<string, string>> = {};
  const wrapper = "demo";
  return {
    name: "vuepress-plugin-code-block",
    alias: {
      "@codeBlock": app.dir.source(),
    },
    clientAppEnhanceFiles: resolve(__dirname, "../client/clientAppEnhance.js"),
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
      md.renderer.rules.html_block = function (tokens, idx, options, env) {
        const data: Record<string, string> = {};
        const dir = dirname(env.filePath);
        const content = tokens[idx].content;
        const html: Node[] = parser(content);
        for (const htmlElement of html) {
          if (typeof htmlElement === "object") {
            if (htmlElement.tag === wrapper) {
              // 处理这个demo
              // 获取它里面的src中的信息
              if (
                htmlElement.attrs &&
                htmlElement.attrs.src &&
                typeof htmlElement.attrs.src === "string"
              ) {
                // 存在src
                const componentPath = join(
                  dir,
                  htmlElement.attrs.src as string
                );
                const extName = extname(htmlElement.attrs.src);
                const sourceData = srcCode(componentPath);
                const highlighter = resolveHighlighter(extName.slice(1));
                if (sourceData) {
                  const highCode = highlighter?.(sourceData.trim());
                  if (highCode) {
                    htmlElement.attrs.highlightCode = encodeURIComponent(
                      "<code>" + highCode + "</code>"
                    );
                  }
                  htmlElement.attrs.code = encodeURIComponent(sourceData);
                  // 对当前的代码进行格式化
                  let codeBlockDemo$ =
                    "codeBlockDemo" + (Object.keys(data).length + 1);
                  if (!Object.keys(data).includes(htmlElement.attrs.src)) {
                    // 存在
                    data[htmlElement.attrs.src] = codeBlockDemo$;
                  } else {
                    codeBlockDemo$ = data[htmlElement.attrs.src];
                  }
                  // 判断数据是否存在
                  if (
                    htmlElement.content &&
                    htmlElement.content instanceof Array
                  ) {
                    htmlElement.content.push({
                      tag: codeBlockDemo$,
                    });
                  } else {
                    if (htmlElement.content) {
                      const content: Content = [];
                      content.push(htmlElement.content);
                      content.push({ tag: codeBlockDemo$ });
                      htmlElement.content = content;
                    } else {
                      const content: Content = [];
                      content.push({ tag: codeBlockDemo$ });
                      htmlElement.content = content;
                    }
                  }
                }
                delete htmlElement.attrs.src;
              }
            }
          }
        }
        fileData[env.filePath] = data;
        return render(html);
      };
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
            `import ${demoName} from "@codeBlock/${relativePath}";`
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
              const myData = `<script setup lang="ts">${importData.join(
                "\n"
              )}</script>`;
              page.hoistedTags.push(myData);
            }
          } else {
            const myData = `<script setup lang="ts">${importData.join(
              "\n"
            )}</script>`;
            page.hoistedTags.push(myData);
          }
        }
      }
    },
  };
};

const srcCode = (path: string) => {
  if (existsSync(path)) {
    return readFileSync(path, { encoding: "utf-8" });
  } else {
    console.warn("not exists path:" + path);
  }
};
export default codeBlockPlugin;
