import {defineComponent, PropType, toRefs} from 'vue';
import {ElCard} from 'element-plus';
import DraggableNested from "@/components/form-designer/form-panel/form-draggable/draggable-nested.tsx"; // 确保路径正确
import styles from "./../index.module.less";

const LayoutCard = defineComponent({
    name: 'LayoutCard',
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
        const {properties} = toRefs(props.element); // properties 仍然是响应式的
        return () => (
            <ElCard header={properties.value.hiddenHeader?'':properties.value.header}  shadow={properties.value.shadow}  style={[{'--eli-padding': properties.value.padding},{width: properties.value.width},properties.value.borderWidth?{borderWidth:0}:{}]}>
                <DraggableNested
                    widgets={props.element.children}
                    selectedWidget={props.selectedWidget}
                    defaultForm={props.defaultForm}
                    addAction={props.addAction}
                    initClass=" "
                    class={styles['widget-col-wrap']}
                />
            </ElCard>
        );
    }
});

export default LayoutCard;