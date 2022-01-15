import { defineComponent } from "vue";
import "./test.less";
export default defineComponent({
  setup() {
    return () => {
      return <button class="button">测试jsx</button>;
    };
  },
});
