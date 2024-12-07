import {defineComponent, PropType, toRefs,computed} from 'vue';
import {VAceEditor} from "vue3-ace-editor";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import {ElButton, ElDialog} from "element-plus";
import {exportJson} from "@/components/form-designer/form-plugins/toolsBarUtils.ts";
import {saveForm} from "@/components/form-designer/form-plugins/localStorageUtils.ts";
export default defineComponent({
    name: 'UtilsCheckData',
    components: {
        VAceEditor
    },
    props: {
        checkDataState:{
            type: Object as PropType<any>,
            required: true
        },
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
        const { checkDataState } = toRefs(props);
        const jsonData = computed(() => {
            const data = saveForm(props.widgets.value,props.defaultForm);
            return JSON.stringify(JSON.parse(data), null, 2);
        });
        const renderDialogFooterEditor = ()=> (
            <div class='dialog-footer'>
                <ElButton onClick={()=>{checkDataState.value = false}}>关闭</ElButton>
                <ElButton type='primary' onClick={()=>exportJson(jsonData)}>
                    导出数据
                </ElButton>
            </div>
        )
        return ()=>(
            <ElDialog destroy-on-close v-model={checkDataState.value} title='查看数据' v-slots={{footer: renderDialogFooterEditor}} width={1100}>
                <VAceEditor
                    v-model:value={jsonData.value}
                    lang='json'
                    theme='chrome'
                    options={{
                        showPrintMargin:false,
                        readOnly: true,
                    }}
                    style={{ height: '550px' }}
                />
            </ElDialog>
        )
    }
})