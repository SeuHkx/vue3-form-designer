import {defineComponent, nextTick, PropType} from 'vue';
import Draggable from 'vuedraggable';
import {ElIcon} from "element-plus";
import {CopyDocument, Delete,Plus, Rank} from "@element-plus/icons-vue";
import {getComponentByType} from "@/components/form-designer/form-panel/form-render/typeMappings.ts";
import {generateRandomString} from "@/utils/generateRandomString.ts";
import {saveToLocalStorage,findWidgetIndex} from "@/components/form-designer/form-plugins/localStorageUtils.ts";
import {CellGroup, Form} from 'vant';
import {
    LAYOUT_ROW,
    LAYOUT_COL,
    PROPS_FIELD,
    LAYOUT_FIELDS_CLASS,
    LAYOUT_TABLE
} from "@/components/form-designer/config-hardcode";
import _ from 'lodash';
import {useTreeStore} from "@/stores/treeStore.ts";
import styles from "./../index.module.less";
interface Widget {
    name: string;
    type: string;
    properties: any;
    children?: Widget[];
}
const DraggableNested = defineComponent({
    name: 'NestedDraggable',
    props: {
        widgets: {
            type: Array as PropType<any[]>,
            required: true,
            default: () => []
        },
        defaultForm:{
            type: Object as PropType<any>,
            required: true
        },
        selectedWidget: {
            type: Object as PropType<any>,
            required: true
        },
        initClass:{
            type: String,
            required: false
        },
        addAction:{
            type: Function as PropType<(widgets: Widget[]) => void>, // 定义 addAction 函数的类型
            required: true
        }
    },
    components: {
        Draggable,
    },
    setup(props) {
        const treeStore = useTreeStore();
        const getClass = (element: any) => {
            const baseClass =  LAYOUT_FIELDS_CLASS.includes(element.type)  ? styles['widget-layout'] : styles['widget-item'];
            const mobile = props.defaultForm.mode ? styles['mobile']:'';
            return [baseClass, mobile,{ [styles['selected']]: props.defaultForm.activeWidget === element.name }];
        };
        const deleteWidgetHandle = (event: any, widget: any) => {
            event.stopPropagation();
            const result = findWidgetIndex(props.widgets, widget.name);
            if (result) {
                const { index, parentPath } = result;
                const targetList = parentPath.length ? parentPath[parentPath.length - 1].children! : props.widgets;
                targetList.splice(index, 1);
                const newSelectedWidget = index > 0 ? targetList[index - 1] : targetList[0];
                props.selectedWidget.value = newSelectedWidget;
                props.defaultForm.activeWidget = newSelectedWidget ? newSelectedWidget.name : '';
                saveToLocalStorage(props.widgets,props.defaultForm);
                nextTick(()=>{
                    treeStore.treeInstance.setCurrentKey(newSelectedWidget.id);
                })
            }
        }
        const copyWidgetHandle = (event: any, widget: any) => {
            event.stopPropagation();
            const result = findWidgetIndex(props.widgets, widget.name);
            if (result) {
                const { index, parentPath } = result;
                const targetList = parentPath.length ? parentPath[parentPath.length - 1].children! : props.widgets;
                const newWidget = _.cloneDeep(widget);
                const updateNamesRecursively = (widget: any) => {
                    widget.name += '_' + generateRandomString();
                    widget.id += '_' + generateRandomString();
                    if (widget.children) {
                        widget.children.forEach((child: any) => {
                            updateNamesRecursively(child);
                        });
                    }
                };
                updateNamesRecursively(newWidget);
                targetList.splice(index + 1, 0, newWidget);
                props.selectedWidget.value = newWidget;
                props.defaultForm.activeWidget = newWidget.name;
                saveToLocalStorage(props.widgets,props.defaultForm);
                nextTick(()=>{
                    treeStore.treeInstance.setCurrentKey(newWidget.id);
                })
            }
        }
        const addWidgetColHandle = (event: any, widget: any)=>{
            event.stopPropagation();
            const newWidget = {
                name:LAYOUT_COL+'_'+ generateRandomString(),
                type:LAYOUT_COL,
                properties:_.cloneDeep(widget.children[0].properties),
                children:[],
                id:LAYOUT_COL+'_'+ generateRandomString(),
            }
            widget.children.push(newWidget);
            props.selectedWidget.value = newWidget;
            props.defaultForm.activeWidget = newWidget.name;
            saveToLocalStorage(props.widgets,props.defaultForm);
            nextTick(()=>{
                treeStore.treeInstance.setCurrentKey(newWidget.id);
            })
        }
        const widgetViewHandle = (event:any,widget: any) => {
            event.stopPropagation();
            props.defaultForm.activeTab = PROPS_FIELD;
            props.defaultForm.activeWidget = widget.name;
            props.selectedWidget.value = widget;
            nextTick(()=>{
                treeStore.treeInstance.setCurrentKey(widget.id);
            });
        }
        const renderActionButtons = (element: Widget) => {
            return (
                <>
                    <div class={[styles['pointer-move'], 'drag-handle']}>
                        <ElIcon>
                            <Rank />
                        </ElIcon>
                    </div>
                    <div class={styles['pointer-wrapper']}>
                        {element.type === LAYOUT_ROW && (
                            <div
                                class={styles['pointer']}
                                onClick={(event:any) => addWidgetColHandle(event, element)}
                            >
                                <ElIcon>
                                    <Plus />
                                </ElIcon>
                            </div>
                        )}
                        <div
                            class={styles['pointer']}
                            onClick={(event: any) => copyWidgetHandle(event, element)}
                        >
                            <ElIcon>
                                <CopyDocument/>
                            </ElIcon>
                        </div>
                        <div
                            class={styles['pointer']}
                            onClick={(event:any) => deleteWidgetHandle(event, element)}
                        >
                            <ElIcon>
                                <Delete />
                            </ElIcon>
                        </div>
                    </div>
                </>
            );
        };
        const renderDraggableContent = ()=>(
            <Draggable
                tag="div"
                list={props.widgets}
                group={{ name: 'widgets' }}
                itemKey="name"
                animation='200'
                ghostClass='ghost'
                swapThreshold={0.2}
                handle=".drag-handle"
                class={styles[props.initClass || 'eli-form-widgets']}
                onStart={onStart}
                onEnd={onEnd}
            >
                {{
                    item: ({ element }: { element: any }) => {
                        const ComponentToRender = getComponentByType(element.type,props.defaultForm.mode);
                        return (
                            <div style={layoutPadding(element.type)} class={getClass(element)} onClick={(event:any) => widgetViewHandle(event, element)}>
                                <ComponentToRender
                                    element={element}
                                    widgets={props.widgets}
                                    defaultForm={props.defaultForm}
                                    selectedWidget={props.selectedWidget}
                                    addAction={props.addAction}
                                    copyWidgetHandle={copyWidgetHandle}
                                    deleteWidgetHandle={deleteWidgetHandle}
                                    widgetViewHandle={widgetViewHandle}
                                />
                                {props.defaultForm.activeWidget === element.name && renderActionButtons(element)}
                            </div>
                        )
                    }
                }}
            </Draggable>
        )
        const onStart = ()=>{
            props.addAction([...props.widgets]);
        }
        const onEnd = ()=>{
            props.addAction([...props.widgets]);
            saveToLocalStorage(props.widgets,props.defaultForm)
        }
        const layoutPadding = (type:string)=>{
            if(type === LAYOUT_ROW){
                return {
                    padding:'8px 0 8px'
                }
            }else if(type === LAYOUT_TABLE){
                return {
                    padding:'8px 0 8px'
                }
            }else{
                return {}
            }
        }
        const renderDraggable = ()=>{
            if(!props.defaultForm.mode){
                return (
                    renderDraggableContent()
                )
            }else {
                return (
                    <Form>
                        <CellGroup>
                            {renderDraggableContent()}
                        </CellGroup>
                    </Form>
                )
            }
        }
        return () => (
            renderDraggable()
        );
    },
});
export default DraggableNested;
