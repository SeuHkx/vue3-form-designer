import {defineComponent, PropType, ref, computed} from "vue";
import {ElButton, ElPopover, ElRadioButton, ElRadioGroup} from "element-plus";
import {VAceEditor} from "vue3-ace-editor";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';

export default defineComponent({
    name:'ConfigFieldCascader',
    props:{
        widgetProperties: {
            type: Object as PropType<any>,
            required: true
        },
        componentField: {
            type: String,
            required: true
        }
    },
    setup(props){
        const renderReferenceSlots = ()=>(
            <ElButton type='primary' plain style={{width:'100%',fontSize:'13px'}}>
                设置
            </ElButton>
        )
        const editorValue = ref(JSON.stringify(props.widgetProperties.value[props.componentField], null, 2));
        const editorValueComputed = computed({
            get: () => editorValue.value,
            set: (newValue) => {
                editorValue.value = newValue;
                props.widgetProperties.value[props.componentField] = JSON.parse(newValue);
            },
        });
        const defaultRadioData = ref('static');
        return ()=>(
            <>
                <div style={{marginBottom: '12px'}}>
                    <ElRadioGroup v-model={defaultRadioData.value}>
                        <ElRadioButton label='静态数据' value='static'/>
                    </ElRadioGroup>
                </div>
                <ElPopover
                    placement='left'
                    width='600px'
                    trigger='click'
                    v-slots={{reference: renderReferenceSlots}}
                >
                    <VAceEditor
                        v-model:value={editorValueComputed.value}
                        lang='json'
                        theme='chrome'
                        options={{
                            showPrintMargin:false,
                            showLineNumbers:true,
                            showGutter:true,
                            highlightActiveLine:true
                        }}
                        style={{ height: '420px' }}
                    />
                </ElPopover>
            </>
        )
    }
})