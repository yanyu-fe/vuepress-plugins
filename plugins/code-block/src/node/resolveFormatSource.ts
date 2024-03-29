import { createMarkdown } from "@vuepress/markdown";
import { resolveHighlighter } from "@vuepress/plugin-prismjs";
export const resolveFormatSource = (
  sourceData: string,
  ext?: string
): string => {
  if (ext) {
    // 高亮显示
    const code = "```" + ext + "\n" + sourceData + "\n" + "```";
    const Highlight = resolveHighlighter(ext);
    const md = createMarkdown({
      highlight: Highlight,
    } as any);
    return md.render(code);
  } else {
    const md = createMarkdown();
    return md.render(sourceData);
  }
};
