import {defineComponent, PropType, toRefs} from 'vue';
import {ElDivider} from 'element-plus';

const LayoutCard = defineComponent({
    name: 'Divider',
    props: {
        element: {
            type: Object as PropType<any>,
            required: true
        }
    },
    setup(props) {
        const {properties} = toRefs(props.element);
        return () => (
            <ElDivider direction={properties.value.direction}  content-position={properties.value.contentPosition} borderStyle={properties.value.borderStyle}>
                {properties.value.label}
            </ElDivider>
        );
    }
});

export default LayoutCard;