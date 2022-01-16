import * as MarkDownIt from "markdown-it";
import { dirname } from "path";
import { Content, Node, parser } from "posthtml-parser";
import { render } from "posthtml-render";
import { resolveHtmlElementNode } from "./resolveHtmlElementNode";
export const resolveHtmlBlock = (
  md: MarkDownIt,
  fileData: Record<string, Record<string, string>>,
  wrapper = "demo"
) => {
  let data: Record<string, string> = {};
  let oldFile = "";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const rawRule = md.renderer.rules.html_block!;
  md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
    if (oldFile !== env.filePath) {
      data = {};
      oldFile = env.filePath;
    }
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
            const resolveCode = resolveHtmlElementNode(
              md,
              htmlElement,
              wrapper,
              dir
            );
            if (typeof resolveCode === "string") return resolveCode;
            if (resolveCode) {
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
              if (htmlElement.content && htmlElement.content instanceof Array) {
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
    fileData[env.filePath] = Object.assign({}, data);
    tokens[idx].content = render(html);
    return rawRule(tokens, idx, options, env, self);
  };
};
