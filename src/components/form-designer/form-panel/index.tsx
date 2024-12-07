import {defineComponent, PropType} from 'vue';
import {
    ElEmpty,
    ElForm,
    ElScrollbar
} from "element-plus";
import styles from './index.module.less';
import DraggableNested from "@/components/form-designer/form-panel/form-draggable/draggable-nested.tsx";

export default defineComponent({
    name: 'FormPanel',
    props: {
        widgets: {
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
        addAction:{
            type: Function as PropType<() => string>,
            required: true
        },
    },
    setup(props) {
        return () => (
            <ElForm class={styles['eli-form']} labelSuffix={props.defaultForm.labelSuffix ? ':' : ''}
                    labelPosition={props.defaultForm.labelAlign} labelWidth={props.defaultForm.labelWidth}
                    size={props.defaultForm.size}>
                {props.widgets.value.length === 0 && (
                    <div class={styles['empty-tips']}>
                        <ElEmpty description='从左侧拖拽或点击来添加控件' imageSize={120}></ElEmpty>
                    </div>
                )}
                <ElScrollbar>
                    <DraggableNested widgets={props.widgets.value} defaultForm={props.defaultForm}
                                     selectedWidget={props.selectedWidget} addAction={props.addAction}/>
                </ElScrollbar>
            </ElForm>
        )
    }
})