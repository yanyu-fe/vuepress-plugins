import * as MarkDownIt from "markdown-it";

export const resolveFormatSource = (
  md: MarkDownIt,
  sourceData: string,
  ext: string
): string => {
  // 高亮显示
  const code = "```" + ext + "\n" + sourceData + "\n" + "```";
  return md.render(code);
};
