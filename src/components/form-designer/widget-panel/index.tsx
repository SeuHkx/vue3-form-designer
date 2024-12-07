import {defineComponent, PropType, watch, ref,onMounted,nextTick} from 'vue';
import {
    ElCollapse,
    ElCollapseItem,
    ElEmpty,
    ElIcon, ElInput,
    ElScrollbar,
    ElTabPane,
    ElTabs,
    ElTooltip,
    ElTree
} from "element-plus";
import {Box, Operation} from "@element-plus/icons-vue";
import Draggable from "vuedraggable";
import _ from 'lodash';
import PanelConfig from "@/components/form-designer/widget-panel/panel-config.ts";
import {generateRandomString} from "@/utils/generateRandomString.ts";
import {saveToLocalStorage,findWidgetIndex} from "@/components/form-designer/form-plugins/localStorageUtils.ts";
import {LAYOUT_ROW, LAYOUT_CHILDREN, LAYOUT_TABLE, PROPS_FIELD} from "@/components/form-designer/config-hardcode";
import {useTreeStore} from "@/stores/treeStore.ts";
import styles from "./index.module.less";

interface Tree {
    [key: string]: any
}
export default defineComponent({
    name: 'WidgetPanel',
    props:{
        addAction: {
            type: Function as PropType<(p: any[]) => string>,
            required: true
        },
        widgets:{
            type: Object,
            required: true,
        },
        selectedWidget:{
            type: Object,
            required: true,
        },
        defaultForm:{
            type: Object as PropType<any>,
            required: true,
        }
    },
    setup(props) {
        const createComponent = (widget: any, type: string,children?:any)=>{
            const properties = _.cloneDeep(widget.properties[type]);
            const component:any = {
                type: type,
                name: `${type}_${generateRandomString()}`,
                properties: properties,
                label: properties.label,
                id:`${type}_${generateRandomString()}`
            };
            if(children){
                component.children = [];
            }
            return component;
        }
        const updateSelection = (component: any)=>{
            props.selectedWidget.value = component;
            props.defaultForm.activeTab = PROPS_FIELD;
            props.defaultForm.activeWidget = component.name;
            props.addAction([...props.widgets.value]);
            saveToLocalStorage(props.widgets.value, props.defaultForm);
        }
        const addWidget = (widget:any) => {
            const component:any = createComponent(widget, widget.componentType);
            if (LAYOUT_ROW === component.type || LAYOUT_TABLE === component.type) {
                component.children = [];
                const childWidget = widget.children[0];
                component.children.push(createComponent(childWidget.widget, childWidget.widget.componentType,true));
            }
            if(LAYOUT_CHILDREN.includes(component.type)){
                component['children'] = []
            }
            props.widgets.value.push(component);
            updateSelection(component);
            nextTick(() => {
                treeStore.treeInstance.setCurrentKey(component.id);
            });
        };
        const cloneWidget = (original: any) => {
            const clonedOriginal = _.cloneDeep(original);
            const component:any = createComponent(clonedOriginal.widget, clonedOriginal.widget.componentType);
            if (LAYOUT_ROW === component.type || LAYOUT_TABLE === component.type) {
                component.children = [];
                const childWidget = clonedOriginal.widget.children[0];
                component.children.push(createComponent(childWidget.widget, childWidget.widget.componentType,true));
            }
            if(LAYOUT_CHILDREN.includes(component.type)){
                component['children'] = []
            }
            return component;
        };
        const onEnd = (evt:any)=>{
            if(typeof evt.pullMode !== 'undefined'){
                let component = evt.item._underlying_vm_;
                props.selectedWidget.value = component;
                props.defaultForm.activeTab = PROPS_FIELD;
                props.defaultForm.activeWidget = component.name;
                props.addAction([...props.widgets.value]);
                saveToLocalStorage(props.widgets.value,props.defaultForm);
                nextTick(() => {
                    treeStore.treeInstance.setCurrentKey(component.id);
                });
            }
        }
        const renderTabPaneLabel = (icon: any, text: string) => (
            <ElTooltip class="box-item" effect="dark" content={text} placement="bottom" offset={16}>
                <span class={styles['my-tabs-label']}>
                    <ElIcon class={styles['el-icon']} size="16">
                        {icon}
                    </ElIcon>
                    <span>{text}</span>
                </span>
            </ElTooltip>
        );
        const tabPaneLabelSlots = () => renderTabPaneLabel(<Box />, '组件库');
        const tabPaneLabelTreeSlots = () => renderTabPaneLabel(<Operation />, '大纲树');
        const ElCollapseItemSlots = (widgets: any) => (
            widgets.length === 0 ? (
                <ElEmpty description='暂无控件' imageSize={50}></ElEmpty>
            ) : (
                <Draggable
                    list={widgets}
                    group={{name: 'widgets', pull: 'clone', put: false}}
                    itemKey="name"
                    clone={cloneWidget}
                    sort={false}
                    disabled={false}
                    tag='ul'
                    ghostClass='ghost'
                    class={styles['eli-components-list']}
                    onEnd={onEnd}
                >
                    {{
                        item: ({element, index}) => (
                            <li class={styles['eli-components-list-label']}
                                onClick={() => addWidget(element.widget)}>
                                <a key={index}><i class='icon'></i><span>{element.text}</span></a>
                            </li>
                        )
                    }}
                </Draggable>
            )
        )
        const renderTreeEmpty = ()=>{
            return(
                <ElEmpty description='没有查询到数据' imageSize={50}></ElEmpty>
            )
        }
        const activeElCollapseName = ref(PanelConfig.map(w => w.name));
        const activeTabPaneName = ref('component');
        const filterText = ref('');
        const treeRef = ref<any>(null)
        const treeStore = useTreeStore();

        const filterNode = (value: string, data: Tree) => {
            if (!value) return true
            return data.label.includes(value)
        }
        const onTreeNodeClick = (data:any)=>{
            const result = findWidgetIndex(props.widgets.value,data.name);
            if (result) {
                const { index, parentPath } = result;
                const targetList = parentPath.length ? parentPath[parentPath.length - 1].children! : props.widgets.value;
                props.selectedWidget.value = targetList[index];
                props.defaultForm.activeWidget = targetList[index].name;
            }
        }
        watch(filterText, (val) => {
            treeRef.value!.filter(val)
        })
        onMounted(() => {
            nextTick(() => {
                treeStore.setTreeInstance(treeRef.value);
            });
        });
        return () => (
            <ElTabs class={styles['my-tab-item']} v-model={activeTabPaneName.value}>
                <ElTabPane v-slots={{label: tabPaneLabelSlots}} name='component'>
                    <ElScrollbar>
                        <div class='eli-form-components'>
                            {PanelConfig.map((widget, index) => (
                                <ElCollapse v-model={activeElCollapseName.value} key={index}>
                                    <ElCollapseItem title={widget.text} name={widget.name}
                                                    v-slots={{default: () => ElCollapseItemSlots(widget.widgets)}}></ElCollapseItem>
                                </ElCollapse>
                            ))
                            }
                        </div>
                    </ElScrollbar>
                </ElTabPane>
                <ElTabPane v-slots={{label: tabPaneLabelTreeSlots}} name='componentTree'>
                    <ElScrollbar>
                        <div class={styles['eli-form-tree']}>
                            <ElInput
                                placeholder='搜索节点'
                                v-model={filterText.value}
                                clearable
                                style={{fontSize: '13px'}}
                            />
                            <ElTree
                                v-slots={{empty: renderTreeEmpty}}
                                node-key='id'
                                expand-on-click-node={false}
                                ref={treeRef}
                                default-expand-all={true}
                                filter-node-method={filterNode}
                                data={props.widgets.value}
                                highlight-current={true}
                                onNodeClick={onTreeNodeClick}
                                style={{marginTop: '4px'}}
                            />
                        </div>
                    </ElScrollbar>
                </ElTabPane>
            </ElTabs>
        )
    }
})