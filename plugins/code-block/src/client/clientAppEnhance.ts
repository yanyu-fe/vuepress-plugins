import { defineClientAppEnhance } from "@vuepress/client";
import codeBlock from "./components/codeBlock.vue";
import "./styles/index.scss";
export default defineClientAppEnhance(({ app }) => {
  app.component("demo", codeBlock);
});
