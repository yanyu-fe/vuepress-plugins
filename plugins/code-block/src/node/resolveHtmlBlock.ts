import * as MarkDownIt from "markdown-it";
import { dirname } from "path";
import { Node, parser } from "posthtml-parser";
import { render } from "posthtml-render";
import { resolveCodeBlock } from "./resolveCodeBlock";
export const resolveHtmlBlock = (
  md: MarkDownIt,
  fileData: Record<string, Record<string, string>>,
  wrapper = "demo",
  suffixId = "components"
) => {
  let data: Record<string, string> = {};
  const suffixArr: string[] = [];
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
    resolveCodeBlock(html, wrapper, md, dir, data, suffixId, suffixArr);
    fileData[env.filePath] = Object.assign({}, data);
    tokens[idx].content = render(html);
    return rawRule(tokens, idx, options, env, self);
  };
};
