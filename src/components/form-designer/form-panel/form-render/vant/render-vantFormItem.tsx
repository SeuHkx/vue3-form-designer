import {defineComponent, PropType, ref,computed} from 'vue';
import {Empty} from 'vant';
import {extractConditions,reconstructExpression} from "@/components/form-designer/form-plugins/expressionEval.ts";
import {Parser} from 'expr-eval';
import styles from "./../../index.module.less";

const VantFormItem = defineComponent({
    name: 'VantFormItem',
    props: {
        element: {
            type: Object as PropType<any>,
            required: true
        },
        widgets: {
            type: Array as PropType<any[]>,
            required: true,
            default: () => []
        },
    },
    setup(props) {
        const expression = ref('');
        const isComponentVisible = computed(() => {
            let hiddenExpression:any = [];
            if(props.element.properties.hasOwnProperty('hidden')){
                if (typeof props.element.properties.hidden !== 'boolean') {
                    hiddenExpression = extractConditions(props.element.properties.hidden);
                    expression.value = reconstructExpression(hiddenExpression,props.widgets);
                }
            }
            if(props.element.properties.hasOwnProperty('hidden')){
                if (typeof props.element.properties.hidden !== 'boolean') {
                    try {
                        let scope = {};
                        hiddenExpression.forEach((expr:any)=>{
                            let element = props.widgets.find(item => item.name === expr.variable);
                            scope[element.name] = String(element.properties.value);
                        })
                        if(expression.value === '')return true;
                        return Parser.evaluate(expression.value, scope)
                    } catch (error) {
                        console.error('表达式解析错误:', error);
                        return false;
                    }
                }
            }else{
                return true;
            }
        });

        return () => (
            isComponentVisible.value?(
                <Empty description="暂无对应控件"/>
            ):(
                <div class={styles['isComponentVisible']}>
                    HIDE
                </div>
            )
        );
    }
});

export default VantFormItem;