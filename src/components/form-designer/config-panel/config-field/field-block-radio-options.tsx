import {defineComponent, PropType, ref, watch,reactive} from "vue";
import Draggable from "vuedraggable";
import {ElButton, ElIcon, ElInput, ElRadioButton, ElRadioGroup} from "element-plus";
import {Delete, Rank} from "@element-plus/icons-vue";
import {generateRandomString} from "@/utils/generateRandomString.ts";

import styles from './../index.module.less';

export default defineComponent({
    name: 'ConfigFieldRadioOptions',
    props: {
        widgetProperties: {
            type: Object as PropType<any>,
            required: true
        },
        componentField: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const {widgetProperties} = props;
        const options = reactive(widgetProperties.value.enum.map((item: any, index: number) => ({
            key: item,
            name: widgetProperties.value.enumNames[index],
            id:'r'+generateRandomString()
        })));
        const updateWidgetProperties = () => {
            widgetProperties.value.enum = options.map((option: any) => option.key);
            widgetProperties.value.enumNames = options.map((option: any) => option.name);
        };

        watch(options, updateWidgetProperties, {deep: true});
        const deleteOptions = (index: number) => {
            options.value.splice(index, 1);
        };
        const addOptions = () => {
            options.value.push({key: '', name: '',id:'r'+generateRandomString()});
        }
        const defaultRadioData = ref('static');
        return () => (
            <>
                <div style={{marginBottom:'12px'}} >
                    <ElRadioGroup v-model={defaultRadioData.value}>
                        <ElRadioButton label='静态数据'  value='static' />
                    </ElRadioGroup>
                </div>
                <Draggable
                    list={options}
                    itemKey='id'
                    handle=".drag-handle"
                    animation='200'
                >
                    {{
                        item: ({element, index}) => {
                            return (
                                <div class={styles['options-item']} key={index}>
                                    <div class={[styles['options-item-icon'], styles['move'], 'drag-handle']}>
                                        <ElIcon size={16}>
                                            <Rank/>
                                        </ElIcon>
                                    </div>
                                    <div class={styles['flex-1']}>
                                        <ElInput placeholder='label' clearable v-model={element.name} />
                                    </div>
                                    <div class={styles['flex-1']}>
                                        <ElInput placeholder='value' clearable v-model={element.key}/>
                                    </div>
                                    <div class={styles['options-item-icon']} onClick={() => deleteOptions(index)}>
                                        <ElIcon size={16}>
                                            <Delete/>
                                        </ElIcon>
                                    </div>
                                </div>
                            )

                        }
                    }}
                </Draggable>
                <div class={styles['options-addBtn']}>
                    <ElButton class={styles['addBtn']} plain type='primary' onClick={addOptions}>添加选项</ElButton>
                </div>
            </>
        )
    }
})