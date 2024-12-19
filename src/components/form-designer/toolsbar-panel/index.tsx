import {computed, defineComponent, PropType, ref} from 'vue';
import {ElButton, ElButtonGroup, ElIcon, ElTooltip} from 'element-plus';
import UtilsCheckData from "@/components/form-designer/toolsbar-panel/toolsbar-utils/utils-checkData.tsx";
import UtilsPreview from "@/components/form-designer/toolsbar-panel/toolsbar-utils/utils-preview.tsx";
import UtilsImportJson from "@/components/form-designer/toolsbar-panel/toolsbar-utils/utils-importJson.tsx";
import {
    ArrowLeft,
    ArrowRight,
    Brush,
    EditPen,
    Files,
    FullScreen,
    Iphone,
    Monitor, Pointer,
    View
} from '@element-plus/icons-vue';
import FormGenerator from "@/components/form-designer/form-generator";
import {saveForm, saveToLocalStorage} from "@/components/form-designer/form-plugins/localStorageUtils.ts";
import styles from './index.module.less';
import {fullScreen} from "@/components/form-designer/form-plugins/toolsBarUtils.ts";
import UtilsLocalCache from "@/components/form-designer/toolsbar-panel/toolsbar-utils/utils-localCache.tsx";
import {PROPS_FIELD, PROPS_FORM} from "@/components/form-designer/config-hardcode";


interface State {
    icon: string;
    type: string;
    text: string;
    mode: number;
}

export default defineComponent({
    name: 'ToolsBarPanel',
    components: {
        FormGenerator,
    },
    props: {
        states: {
            type: Array as PropType<State[]>,
            default: () => [
                { icon: 'Monitor', type: 'primary', text: 'PC', mode: 0 },
                { icon: 'Iphone', type: 'default', text: '手机', mode: 1 },
            ],
        },
        modelValue: {
            type: Number,
            default: 0,
        },
        canUndo: {
            type: Function as PropType<() => string>,
            required: true
        },
        canRedo:{
            type: Function as PropType<() => string>,
            required: true
        },
        undo:{
            type: Function as PropType<() => string>,
            required: true
        },
        redo:{
            type: Function as PropType<() => string>,
            required: true
        },
        widgets:{
            type: Object as PropType<any>,
            required: true
        },
        selectedWidget:{
            type: Object as PropType<any>,
            required: true
        },
        defaultForm:{
            type: Object as PropType<any>,
            required: true
        }
    },
    emits: ['previewForm', 'clearWidget', 'saveForm', 'update:modelValue'],
    setup(props, { emit }) {
        const headerBarIconMap = {
            Monitor,
            Iphone,
        };
        const previewState = ref<Boolean>(false)
        const checkDataState   = ref<Boolean>(false);

        const localStates = ref(props.states);
        const previewData = ref('');
        const computedStates = computed(() =>
            localStates.value.map(state => ({
                ...state,
                type: state.mode === props.modelValue ? 'primary' : 'default',
            }))
        );
        const updateSelectedMode = (index: number) => {
            emit('update:modelValue', index);
        };
        const headerBarToggleButton = (index: number) => {
            updateSelectedMode(index);
        };

        const saveFormHandle = () => emit('saveForm');
        const clearWidgetsHandle = () => emit('clearWidget');
        const previewFormHandle = ()=>{
            previewData.value = saveForm(props.widgets.value, props.defaultForm);
            previewState.value = true;
        }
        const undoHandle = ()=>{
            const previousState = props.undo(); // 获取撤销的状态
            props.widgets.value = previousState ? [...previousState] : [];
            saveToLocalStorage(props.widgets.value,props.defaultForm);
            props.selectedWidget.value = null;
            props.defaultForm.activeTab = PROPS_FORM;
            props.defaultForm.activeWidget = '';
        }
        const redoHandle = ()=>{
            const nextState = props.redo();
            props.widgets.value = nextState?[...nextState]:[];
            saveToLocalStorage(props.widgets.value,props.defaultForm);
        }
        const onCheckData = ()=>{
            checkDataState.value = true;
        }
        const onFullScreen = ()=>{
            fullScreen();
        }
        const onCancelSelect = ()=>{
            props.selectedWidget.value = null;
            props.defaultForm.activeTab = PROPS_FORM;
            props.defaultForm.activeWidget = '';
        }
        const renderButton = (state: State, index: number) => {
            const IconComponent = headerBarIconMap[state.icon];
            return (
                <ElTooltip
                    key={index}
                    class="box-item"
                    effect="dark"
                    content={state.text}
                    placement="bottom"
                    offset={12}
                >
                    <ElButton type={state.type} onClick={() => headerBarToggleButton(index)}>
                        <ElIcon size={18}>
                            {IconComponent && <IconComponent />}
                        </ElIcon>
                    </ElButton>
                </ElTooltip>
            );
        };
        const renderUndoRedo = ()=>{
            return (
                <ElButtonGroup>
                    <ElTooltip
                        class="box-item"
                        effect="dark"
                        content='撤销'
                        placement="bottom"
                        offset={12}
                    >

                        <ElButton onClick={undoHandle} link style={{width: '32px'}} disabled={!props.canUndo()}>
                            <ElIcon size={18}>
                                <ArrowLeft />
                            </ElIcon>
                        </ElButton>
                    </ElTooltip>
                    <ElTooltip
                        class="box-item"
                        effect="dark"
                        content='重做'
                        placement="bottom"
                        offset={12}
                    >
                        <ElButton onClick={redoHandle} link style={{width: '32px'}} disabled={!props.canRedo()}>
                            <ElIcon size={18}>
                                <ArrowRight />
                            </ElIcon>
                        </ElButton>
                    </ElTooltip>

                </ElButtonGroup>
            )
        }
        const renderImportCheck = ()=>{
            return(
                <ElButtonGroup>
                    <ElTooltip
                        class="box-item"
                        effect="dark"
                        content='查看数据'
                        placement="bottom"
                        offset={12}
                    >
                        <ElButton onClick={onCheckData} link  style={{width: '40px'}}>
                            <ElIcon size={18}>
                                <EditPen/>
                            </ElIcon>
                        </ElButton>
                    </ElTooltip>
                    <ElTooltip
                        class="box-item"
                        effect="dark"
                        content='导入数据'
                        placement="bottom"
                        offset={12}

                    >
                        <UtilsImportJson widgets={props.widgets} defaultForm={props.defaultForm}/>
                    </ElTooltip>
                    <ElTooltip
                        class="box-item"
                        effect="dark"
                        content='全屏'
                        placement="bottom"
                        offset={12}
                    >
                        <ElButton onClick={onFullScreen} link style={{width: '40px'}}>
                            <ElIcon size={18}>
                                <FullScreen/>
                            </ElIcon>
                        </ElButton>
                    </ElTooltip>
                    <ElTooltip
                        class="box-item"
                        effect="dark"
                        content='取消选择'
                        placement="bottom"
                        offset={12}
                    >
                        <ElButton onClick={onCancelSelect} link style={{width: '40px'}}>
                            <ElIcon size={18}>
                                <Pointer/>
                            </ElIcon>
                        </ElButton>
                    </ElTooltip>
                </ElButtonGroup>
            )
        }
        return () => (
            <>
                <UtilsPreview data={previewData.value} previewState={previewState}/>
                <UtilsCheckData checkDataState={checkDataState} widgets={props.widgets} defaultForm={props.defaultForm}/>
                <div class={styles['header-bar']}>
                    <div class={styles['eli-form-header-bar--left']}>
                        <ElButtonGroup>
                            {computedStates.value.map(renderButton)}
                        </ElButtonGroup>
                    </div>
                    <div class={styles['eli-form-header-bar--left']}>
                        <div class={styles['icon-wrap']}>
                            {renderUndoRedo()}
                        </div>
                    </div>
                    <div class={styles['eli-form-header-bar--left']}>
                        <div class={styles['icon-wrap']}>
                            {renderImportCheck()}
                        </div>
                    </div>
                    <div class={styles['eli-form-header-bar--left']}>
                        <div class={styles['icon-wrap']}>
                            <ElTooltip
                                class="box-item"
                                effect="dark"
                                content='开启本地缓存'
                                placement="bottom"
                                offset={12}
                            >
                                <UtilsLocalCache widgets={props.widgets} defaultForm={props.defaultForm}/>
                            </ElTooltip>
                        </div>
                    </div>
                    <div class={styles['eli-form-header-bar--right']}>
                        <ElButton link type="primary" onClick={previewFormHandle}>
                            <ElIcon class={styles['el-icon']}>
                                <View/>
                            </ElIcon>
                            预览
                        </ElButton>
                        <ElButton link type="primary" onClick={saveFormHandle}>
                            <ElIcon class={styles['el-icon']}>
                                <Files/>
                            </ElIcon>
                            保存
                        </ElButton>
                        <ElButton link type="primary" onClick={clearWidgetsHandle}>
                            <ElIcon class={styles['el-icon']}>
                                <Brush/>
                            </ElIcon>
                            清空
                        </ElButton>
                    </div>
                </div>
            </>
        );
    },
});
