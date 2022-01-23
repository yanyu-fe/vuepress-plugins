import { defineUserConfig } from "vuepress";
import { ViteBundlerOptions } from "vuepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { DefaultThemeOptions } from "@yanyu-fe/vuepress-theme-dumi";
export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  title: "文档中心",
  theme: "@yanyu-fe/vuepress-theme-dumi",
  themeConfig: {
    navbar: [
      {
        text: "介绍",
        link: "/",
      },
    ],
    sidebar: [
      {
        text: "介绍",
        link: "/",
      },
    ],
  },
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
  plugins: [["@yanyu-fe/vuepress-plugin-code-block", {}]],
});
