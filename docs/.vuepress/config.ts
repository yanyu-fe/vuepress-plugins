import { defineUserConfig } from "vuepress";
import { ViteBundlerOptions } from "vuepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { DefaultThemeOptions } from "@yanyu-fe/vuepress-theme-dumi";
export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  title: "文档中心",
  // theme: "@yanyu-fe/vuepress-theme-dumi",
  lang: "zh-CN",
  themeConfig: {
    lastUpdatedText: "最后更新时间",
    contributorsText: "贡献者",
    locales: {
      "/": {
        navbar: [
          {
            text: "介绍",
            link: "/",
          },
          {
            text: "测试写一下",
            link: "/hello",
          },
        ],
        sidebar: {
          "/": [
            {
              text: "介绍",
              children: ["/"],
            },
          ],
          "/hello": [
            {
              text: "测试",
              children: ["/hello"],
            },
          ],
        },
      },
    },
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
