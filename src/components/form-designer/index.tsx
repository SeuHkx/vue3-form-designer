import {defineComponent, onMounted, reactive, ref, watch} from 'vue';
import {ElAside, ElContainer, ElHeader, ElIcon, ElMain} from "element-plus";
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import ToolsBarPanel from "@/components/form-designer/toolsbar-panel/index.tsx";
import WidgetPanel from "@/components/form-designer/widget-panel";
import ConfigPanel from "@/components/form-designer/config-panel";
import FormPanel from "@/components/form-designer/form-panel";
import {useUndoRedo} from "@/components/form-designer/form-plugins/useUndoRedo.ts";
import {
    clearLocalStorage, getLocalCacheState,
    loadFromLocalStorage,
    saveToLocalStorage,
    initDefaultForm,
    saveForm
} from "@/components/form-designer/form-plugins/localStorageUtils.ts";
import {
    DEFAULT_FORM_NAME,
    PROPS_FORM
} from "@/components/form-designer/config-hardcode";
import _ from 'lodash';
import styles from './index.module.less';

const FormDesigner = defineComponent({
    name:'FormDesignerComponent',
    emits: ['save'],
    props:{
        schemas:{
            type: String,
            required: false,
            default:''
        }
    },
    setup(props,{emit}){
        const { addAction, undo, redo, canUndo, canRedo } = useUndoRedo();
        const initialFormState = reactive({
            type:'object',
            name:DEFAULT_FORM_NAME,
            activeTab:PROPS_FORM,
            activeWidget:'',//选中的状态
            labelWidth:'',
            labelAlign:'left',
            labelSuffix:false,
            size:'default',
            mode:0,
            localCache:getLocalCacheState('eLiFormLocalCache'),
        })
        const defaultForm = reactive(_.cloneDeep(initialFormState));
        const widgets = ref<any[]>([]);
        const selectedWidget = ref<any>(null);

        const clearDefaultForm = () => {
            Object.assign(defaultForm, _.cloneDeep(initialFormState));
        };
        const clearWidget =()=>{
            widgets.value = [];
            selectedWidget.value = null;
            clearDefaultForm();
            clearLocalStorage();
        }
        const updateWidgetInTree = (widgets, selectedWidget)=> {
            for (let widget of widgets) {
                if (widget.name === selectedWidget.name) {
                    Object.assign(widget, selectedWidget);
                    return true; // 找到并更新后立即返回
                }
                if (widget.children && updateWidgetInTree(widget.children, selectedWidget)) {
                    return true; // 如果在子节点中找到并更新
                }
            }
            return false;
        }
        watch([selectedWidget,defaultForm], () => {
            saveToLocalStorage(widgets.value,defaultForm);
        },{ deep: true });
        onMounted(() => {
            initDefaultForm(props.schemas,widgets,defaultForm);
            if(props.schemas === '' && defaultForm.localCache){
                loadFromLocalStorage(widgets,defaultForm);
            }
        });
        return () => (
            <ElContainer class={styles['my-el-container']}>
                <ElMain class={styles['my-el-main']}>
                    <ElContainer class="eli-form">
                        <ElAside width="260px">
                            <div class={[styles['eli-aside-arrow'],styles['arrow-left']]}>
                                <ElIcon size={20}>
                                    <ArrowLeft/>
                                </ElIcon>
                            </div>
                            <WidgetPanel
                                addAction={addAction}
                                widgets={widgets}
                                defaultForm={defaultForm}
                                selectedWidget={selectedWidget}
                            />
                        </ElAside>
                        <ElContainer class={styles['container-center']}>
                            <ElHeader class={styles['eli-form-header']}>
                                <ToolsBarPanel
                                    v-model={defaultForm.mode}
                                    onSaveForm={()=>saveForm(widgets.value,defaultForm,emit)}
                                    undo={undo}
                                    redo={redo}
                                    canUndo={canUndo}
                                    canRedo={canRedo}
                                    widgets={widgets}
                                    selectedWidget={selectedWidget}
                                    onClearWidget={clearWidget}
                                    defaultForm={defaultForm}
                                />
                            </ElHeader>
                            <ElMain class={styles['eli-components-wrap']}>
                                <div class={styles['eli-form-container']}>
                                    <div class={[styles['eli-form-container-box'], defaultForm.mode ? styles['eli-form-mobile'] : styles['eli-form-pc']]}>
                                        <FormPanel widgets={widgets} defaultForm={defaultForm} selectedWidget={selectedWidget} addAction={addAction} />
                                    </div>
                                </div>
                            </ElMain>
                        </ElContainer>
                        <ElAside width="300px">
                            <div class={[styles['eli-aside-arrow'],styles['arrow-right']]}>
                                <ElIcon size={20} >
                                    <ArrowRight/>
                                </ElIcon>
                            </div>
                            <ConfigPanel defaultForm={defaultForm} selectedWidget={selectedWidget}/>
                        </ElAside>
                    </ElContainer>
                </ElMain>
            </ElContainer>
        )
    }
})
export default FormDesigner;