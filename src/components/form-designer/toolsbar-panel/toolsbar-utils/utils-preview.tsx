import {defineComponent, PropType, toRefs, reactive, toRaw,computed,ref} from 'vue';
import FormGenerator from "@/components/form-designer/form-generator";
import {ElButton, ElDialog} from "element-plus";
import {VAceEditor} from "vue3-ace-editor";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';

export default defineComponent({
    name:'UtilsPreview',
    components: {
        VAceEditor
    },
    props:{
        previewState:{
            type: Object as PropType<any>,
            require:true
        },
        data:{
            type: String,
            require:true
        }
    },
    setup(props){
        const {previewState} = toRefs(props);
        const isEditing = ref(true);
        const formDataState = ref(false);
        const formDataString = ref('');
        const mode = ref('edit');
        let formData:any = reactive({});
        const componentData = {
            upload:{
                headers:{

                }
            },
            dynamicClick:(key)=>{
                
            }
        }
        const closePreviewFormHandle = ()=>{
            previewState.value = false;
            Object.keys(formData).forEach(key => {
                delete formData[key];
            })
        }
        const data = computed(() => (props.data));
        const onClosed = ()=>{
            formData = reactive({});
        }
        const getFormData = ()=>{
            formDataState.value = true;
            formDataString.value = JSON.stringify(toRaw(formData),null, 2);
        }
        const modeSwitch = ()=>{
            if(!isEditing.value){
                isEditing.value = true;
                mode.value = 'edit';
            }else{
                isEditing.value = false;
                mode.value = 'read';
            }
        }
        const renderDialogFooterSlots = ()=>(
            <div class='dialog-footer'>
                <ElButton onClick={closePreviewFormHandle}>关闭</ElButton>
                <ElButton type='primary' onClick={modeSwitch}>
                    {isEditing.value?'只读模式':'编辑模式'}
                </ElButton>
                <ElButton type='primary' onClick={getFormData}>表单数据</ElButton>
            </div>
        )
        return ()=>(
            <>
                <ElDialog destroy-on-close onClose={onClosed} v-model={previewState.value} title='预览' v-slots={{footer: renderDialogFooterSlots}} width={1100}>
                    <FormGenerator schemas={data.value} mode={mode.value} formData={formData} componentData={componentData}/>
                </ElDialog>
                <ElDialog destroy-on-close v-model={formDataState.value} title='查看表单数据' width={500}>
                    <VAceEditor
                        v-model:value={formDataString.value}
                        lang='json'
                        theme='chrome'
                        options={{
                            showPrintMargin:false,
                            readOnly: true,
                        }}
                        style={{ height: '450px' }}
                    />
                </ElDialog>
            </>

        )
    }
})