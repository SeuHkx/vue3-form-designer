import {defineComponent, PropType, ref, computed} from "vue";
import {ElButton, ElPopover} from "element-plus";
import {VAceEditor} from "vue3-ace-editor";
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-chrome';

export default defineComponent({
    name:'ConfigFieldPopover',
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
                设置默认值
            </ElButton>
        )
        const editorValue = ref(props.widgetProperties.value[props.componentField]);
        const editorValueComputed = computed({
            get: () => editorValue.value,
            set: (newValue) => {
                editorValue.value = newValue;
                props.widgetProperties.value[props.componentField] = newValue;
            },
        });
        return ()=>(
            <ElPopover
                placement='left'
                width='500px'
                trigger='click'
                v-slots={{reference:renderReferenceSlots}}
            >
                <VAceEditor
                    v-model:value={editorValueComputed.value}
                    lang='html'
                    theme='chrome'
                    options={{
                        showPrintMargin:false,
                        showLineNumbers:true,
                        showGutter:true,
                        highlightActiveLine:true
                    }}
                    style={{ height: '320px' }}
                />
            </ElPopover>

        )
    }
})