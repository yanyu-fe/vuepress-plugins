import { resolveHighlighter } from "@vuepress/plugin-prismjs";
/**
 * 处理vue文件
 * @param sourceData
 * @param lang
 */
export const resolveFormatVue = (sourceData: string, lang = "vue") => {
  const highlighter = resolveHighlighter(lang);
  const highCode = highlighter?.(sourceData.trim());
  if (highCode) {
    return "<code>" + highCode + "</code>";
  }
};
