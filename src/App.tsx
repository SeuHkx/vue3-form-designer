import { defineComponent} from 'vue';
import {ElConfigProvider} from "element-plus";
import {FormDesigner} from "@/components/form-designer/index.ts";
const App = defineComponent({
  name:'App',
  setup() {
    return () => (
        <ElConfigProvider>
            <FormDesigner />
        </ElConfigProvider>
    );
  }
});

export default App;