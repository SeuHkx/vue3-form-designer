import { defineComponent} from 'vue';
import {ElConfigProvider} from "element-plus";
import Home from "@/views/home";

const App = defineComponent({
  name:'App',
  setup() {

    return () => (
        <ElConfigProvider>
          <Home/>
        </ElConfigProvider>
    );
  }
});

export default App;