import {defineComponent} from 'vue';
import FormDesigner from "@/components/form-designer";
const Home = defineComponent({
    name:'Home',
    props:{

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