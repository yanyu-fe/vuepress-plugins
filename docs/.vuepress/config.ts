import { defineUserConfig } from "vuepress";
import { ViteBundlerOptions } from "vuepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { DefaultThemeOptions } from "@yanyu-fe/vuepress-theme-dumi";
export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  title: "文档中心",
  theme: "@yanyu-fe/vuepress-theme-dumi",
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
            text: "指南",
            link: "/guide/",
          },
          {
            text: "开源",
            children: [
              {
                text: "vuepress",
                children: [
                  {
                    text: "代码块插件",
                    link: "/plugins/vuepress/code-block",
                  },
                ],
              },
            ],
          },
          {
            text: "博客",
            children: [
              {
                text: "vue",
                link: "/blog/vue/",
              },
              {
                text: "taro",
                link: "/blog/taro/",
              },
            ],
          },
          {
            text: "UI库",
            children: [
              {
                text: "介绍",
                link: "/mist/introduce",
              },
              {
                text: "脚手架",
                link: "/mist/cli/",
              },
              {
                text: "组件库",
                link: "/mist/ui/",
              },
            ],
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
  plugins: [
    ["@yanyu-fe/vuepress-plugin-code-block", {}],
    [
      "@vuepress/plugin-search",
      {
        locales: {
          "/": {
            placeholder: "搜索",
          },
        },
      },
    ],
  ],
});
