import {defineComponent, PropType, toRefs} from 'vue';
import { ElTable} from 'element-plus';

const DataTable = defineComponent({
    name: 'DataTable',
    props: {
        element: {
            type: Object as PropType<any>,
            required: true
        }
    },
    setup(props) {
        const {properties} = toRefs(props.element);
        console.log(properties);
        return () => (
            <ElTable>

            </ElTable>
        );
    }
});

export default DataTable;