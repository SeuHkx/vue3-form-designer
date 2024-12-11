import {defineComponent} from 'vue';
import FormDesigner from "@/components/form-designer/index.tsx";
//import {FormDesigner} from './../../../dist/formDesigner.es.js';
const Home = defineComponent({
    name:'Home',
    props:{

    },
    components: {
        FormDesigner
    },
    setup(){
        const onSave = (json:string)=>{
            console.log('保存结果',json)
        }
        const jsonData = ''
        return () => (

            <FormDesigner onSave={onSave} schemas={jsonData}/>
        )
    }
})
export default Home;