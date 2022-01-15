import { defineUserConfig } from "vuepress";
import { DefaultThemeOptions, ViteBundlerOptions } from "vuepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { codeBlockPlugin } from "@yanyu-fe/vuepress-plugin-code-block";
export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  title: "文档中心",
  bundlerConfig: {
    viteOptions: {
      server: {
        fs: {
          strict: false,
        },
      },
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
          },
        },
      },
      plugins: [vueJsx()],
    },
  },
  plugins: [[codeBlockPlugin, {}]],
});
