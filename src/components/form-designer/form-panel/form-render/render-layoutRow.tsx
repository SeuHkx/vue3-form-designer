import {defineComponent, PropType, toRefs} from 'vue';
import {ElRow, ElCol, ElIcon} from 'element-plus';
import DraggableNested from "@/components/form-designer/form-panel/form-draggable/draggable-nested.tsx"; // 确保路径正确
import {CopyDocument, Delete} from '@element-plus/icons-vue';
import styles from "./../index.module.less";

const LayoutRow = defineComponent({
    name: 'LayoutRow',
    props: {
        element: {
            type: Object as PropType<any>,
            required: true
        },
        defaultForm: {
            type: Object as PropType<any>,
            required: true
        },
        selectedWidget: {
            type: Object as PropType<any>,
            required: true
        },
        copyWidgetHandle: {
            type: Function as PropType<(event: any, widget: any) => void>,
            required: true
        },
        deleteWidgetHandle: {
            type: Function as PropType<(event: any, widget: any) => void>,
            required: true
        },
        widgetViewHandle: {
            type: Function as PropType<(event: any, widget: any) => void>,
            required: true
        },
        addAction:{
            type: Function as PropType<(widgets: any[]) => void>, // 定义 addAction 函数的类型
            required: true
        }
    },
    setup(props) {
        const {properties} = toRefs(props.element);

        return () => (
            <ElRow gutter={properties.value.gutter} justify={properties.value.justify} align={properties.value.align}>
                {props.element.children.map((child: any) => {
                        return (
                            <ElCol span={child.properties.span}
                                   offset={child.properties.offset}
                                   push={child.properties.push}
                                   pull={child.properties.pull}
                                   key={child.name}
                                   class={[styles['widget-col'], {[styles['selected']]: props.defaultForm.activeWidget === child.name}]}
                                   onClick={(event: any) => props.widgetViewHandle(event, child)}>
                                <DraggableNested
                                    widgets={child.children}
                                    selectedWidget={props.selectedWidget}
                                    defaultForm={props.defaultForm}
                                    addAction={props.addAction}
                                    initClass=" "
                                    class={styles['widget-col-wrap']}
                                />
                                {props.defaultForm.activeWidget === child.name && (
                                    <div class={styles['pointer-wrapper']}>
                                        <div class={styles['pointer']}
                                             onClick={(event: any) => props.copyWidgetHandle(event, child)}>
                                            <ElIcon>
                                                <CopyDocument/>
                                            </ElIcon>
                                        </div>
                                        {props.element.children.length > 1 && (
                                            <div class={styles['pointer']}
                                                 onClick={(event: any) => props.deleteWidgetHandle(event, child)}>
                                                <ElIcon>
                                                    <Delete/>
                                                </ElIcon>
                                            </div>
                                        )}

                                    </div>
                                )}
                            </ElCol>
                        )
                    }
                )
                }
            </ElRow>
        );
    }
});

export default LayoutRow;