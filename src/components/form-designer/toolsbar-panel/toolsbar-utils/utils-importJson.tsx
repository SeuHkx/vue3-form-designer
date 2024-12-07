import {defineComponent, PropType, ref} from 'vue';
import {ElButton, ElIcon, ElMessage} from "element-plus";
import {MessageBox} from "@element-plus/icons-vue";
import {importJson} from "@/components/form-designer/form-plugins/toolsBarUtils.ts";
import {initDefaultForm} from "@/components/form-designer/form-plugins/localStorageUtils.ts";
export default defineComponent({
    name:'UtilsImportJson',
    props:{
        widgets:{
            type: Object as PropType<any>,
            required: true
        },
        defaultForm:{
            type: Object as PropType<any>,
            required: true
        }
    },
    setup(props){
        const fileInput = ref<any>(null);
        const selectFile = ()=>{
            fileInput.value.click();
        }
        const callback = (data:any)=>{
            if(data.success){
                let state = initDefaultForm(JSON.stringify(data.data),props.widgets,props.defaultForm);
                if(state){
                    ElMessage({
                        message:data.message,
                        type: data.type,
                    });
                }else{
                    ElMessage({
                        message:'数据格式不符合',
                        type: 'error',
                    });
                }
            }else{
                ElMessage({
                    message:data.message,
                    type: data.type,
                });
            }
        }
        return ()=>(

                <ElButton onClick={selectFile} link style={{width: '40px'}}>
                    <ElIcon size={18}>
                        <MessageBox/>
                    </ElIcon>
                    <input type="file" ref={fileInput} onChange={(event:any)=>{importJson(event,callback)}} accept=".json" style="display: none;"/>
                </ElButton>

        )
    }
})
