import type { Node } from "posthtml-parser";
import { resolveHtmlElementNode } from "./resolveHtmlElementNode";
import { Content } from "posthtml-parser";
import * as MarkDownIt from "markdown-it";
import { normalizePath } from "vite";
import { parse } from "path";

export function resolveCodeBlock(
  html: Node[],
  wrapper: string,
  md: MarkDownIt,
  dir: string,
  data: Record<string, string>,
  suffixId: string,
  suffixArr: string[]
) {
  let i = 0;
  for (const htmlElement of html) {
    if (typeof htmlElement === "object") {
      // 首先判断当前是否需要生成代码块
      if (htmlElement.tag === wrapper) {
        // 这里处理demo
        if (
          htmlElement.attrs &&
          htmlElement.attrs.src &&
          typeof htmlElement.attrs.src === "string"
        ) {
          // 开始处理代码
          const resolveCode = resolveHtmlElementNode(
            md,
            htmlElement,
            wrapper,
            dir
          );
          // 判断最终处理出来的格式
          if (typeof resolveCode === "string") {
            html[i] = resolveCode;
            continue;
          }
          if (resolveCode) {
            // 自动生成id
            if (!htmlElement.attrs.id) {
              const parsePath = parse(htmlElement.attrs.src);
              let suffixLast = normalizePath(
                htmlElement.attrs.src
                  .replace("../", "")
                  .replace(parsePath.ext, "")
              ).replace("/", "-");
              if (suffixArr.includes(suffixLast)) {
                suffixLast = suffixLast + "-" + suffixArr.length;
              }
              suffixArr.push(suffixLast);
              htmlElement.attrs.id = `${suffixId}-${suffixLast}`;
            }
            // 生成需要写入的数据
            let codeBlockDemo$ =
              "codeBlockDemo" + (Object.keys(data).length + 1);
            if (!Object.keys(data).includes(htmlElement.attrs.src)) {
              // 存在
              data[htmlElement.attrs.src] = codeBlockDemo$;
            } else {
              codeBlockDemo$ = data[htmlElement.attrs.src];
            }
            // 判断数据是否存在;
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
      } else {
        // 判断是否存在子级content
        if (htmlElement.content && Array.isArray(htmlElement.content)) {
          resolveCodeBlock(
            htmlElement.content as Node[],
            wrapper,
            md,
            dir,
            data,
            suffixId,
            suffixArr
          );
        }
      }
    }
    i++;
  }
}
