import {defineComponent, PropType} from 'vue';
import {ElSwitch} from "element-plus";
import {
    setLocalCacheState,
    clearLocalStorage,
    saveToLocalStorage
} from "@/components/form-designer/form-plugins/localStorageUtils.ts";

export default defineComponent({
    name:'UtilsLocalCache',
    props: {
        widgets:{
            type: Object as PropType<any>,
            required: true
        },
        defaultForm: {
            type: Object as PropType<any>,
            required: true
        },
    },
    setup(props){
        const onChange = (value:any)=>{
            if(value){
                setLocalCacheState('eLiFormLocalCache',true);
                saveToLocalStorage(props.widgets.value,props.defaultForm)
            }else{
                setLocalCacheState('eLiFormLocalCache', false);
                clearLocalStorage();
            }
        }
        return()=>(
            <div style='margin-left:10px'>
                <ElSwitch v-model={props.defaultForm.localCache} onChange={onChange}/>
            </div>
        )
    }
})