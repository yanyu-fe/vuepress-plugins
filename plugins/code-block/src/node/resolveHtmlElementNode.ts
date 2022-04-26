import { Node } from "posthtml-parser";
import { extname, join } from "path";
import { resolveFormatVue } from "./resolveFormatVue";
import { resolveSourceCode } from "./resolveSourceCode";
import { resolveFormatSource } from "./resolveFormatSource";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as MarkDownIt from "markdown-it";
export const resolveHtmlElementNode = (
  md: MarkDownIt,
  htmlElement: Node,
  wrapper: string,
  fileDir: string
) => {
  // 当前是一个对象
  if (typeof htmlElement === "object" && htmlElement.tag === wrapper) {
    // 判断当前是否存在src
    if (
      htmlElement.attrs &&
      htmlElement.attrs.src &&
      typeof htmlElement.attrs.src === "string"
    ) {
      const raw = Reflect.has(htmlElement.attrs, "raw");
      const src = htmlElement.attrs.src;
      const filePath = join(fileDir, src);
      // 需要对当前的代码进行解析
      const extName = extname(src);
      const sourceData = resolveSourceCode(filePath);
      if (sourceData) {
        if (/^\.(vue|jsx|tsx)$/.test(extName) && !raw) {
          // 需要对当前的vue文件进行处理
          const codeData = resolveFormatVue(sourceData, extName.slice(1));
          if (codeData) {
            htmlElement.attrs.highlightCode = encodeURIComponent(codeData);
            htmlElement.attrs.code = encodeURIComponent(sourceData);
            const desc = htmlElement.attrs.desc;
            if (desc && typeof desc === "string") {
              htmlElement.attrs.desc = encodeURIComponent(
                resolveFormatSource(htmlElement.attrs.desc as string)
              );
            }
          }
          return true;
        } else {
          return resolveFormatSource(sourceData, extName.slice(1));
        }
      }
    }
  }
  return false;
};
