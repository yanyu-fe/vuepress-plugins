import { defineClientConfig } from "@vuepress/client";
import codeBlock from "./components/codeBlock.vue";
import "./styles/index.scss";

export default defineClientConfig({
  enhance({ app }) {
    app.component("demo", codeBlock);
  },
});
