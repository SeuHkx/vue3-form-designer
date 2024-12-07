import {computed, defineComponent, PropType, ref} from 'vue';
import {
    ElCollapse,
    ElCollapseItem,
    ElEmpty,
    ElForm,
    ElFormItem,
    ElInput,
    ElRadioButton,
    ElRadioGroup,
    ElScrollbar,
    ElSwitch,
    ElTabPane,
    ElTabs
} from "element-plus";
import ConfigField from "@/components/form-designer/config-panel/config-field/index.tsx";
import {LAYOUT_TABLE_HIDE_FIELD} from "@/components/form-designer/config-hardcode";
import styles from './index.module.less';

interface DefaultForm {
    name: string;
    labelWidth: string;
    labelAlign: string;
    labelSuffix:boolean;
    activeTab: string;
    activeWidget:string;
    size: string;
}

export default defineComponent({
    name:'ConfigPanel',
    props:{
        defaultForm:{
            type: Object as PropType<DefaultForm>,
            required: true
        },
        selectedWidget: {
            type:Object as PropType<any>,
            required:true
        }
    },
    setup(props){
        const { defaultForm, selectedWidget } = props;
        const activePropsFiled = ref<string>('baseField');
        const filedErrorMessage = ref('');
        const createComputedProperty = (key: keyof NonNullable<typeof selectedWidget.value>) => {
            return computed({
                get: () => selectedWidget?.value?.[key] ?? '',
                set: (newValue) => {
                    if (selectedWidget?.value) {
                        selectedWidget.value[key] = newValue;
                    }
                }
            });
        };
        const hasData = computed(() => {
            return Object.keys(selectedWidget?.value?.properties || {}).length > 0;
        });
        const widgetName = createComputedProperty('name');
        const widgetProperties = createComputedProperty('properties');
        const widgetType = createComputedProperty('type');

        const configFieldKey = computed(() => {
            return selectedWidget?.value?.name || Math.random().toString();
        });
        const filedChange = (value:string)=>{
            if (value && /^\d/.test(value)) {
                widgetName.value = value.slice(1);
                filedErrorMessage.value = '字段名称的第一个字符不能为数字';
                console.log(widgetName.value)
            } else {
                filedErrorMessage.value = '';
                widgetName.value = value;
            }
            defaultForm.activeWidget = widgetName.value;
        }
        const renderBaseFields = () => {
            if (!hasData.value) {
                return <ElEmpty description="请添加控件" imageSize={50} />;
            }
            const label = selectedWidget.value.label;
            return (
                <>
                    <ElFormItem label='控件类型' labelPosition='top'>
                        <ElInput v-model={label} readonly disabled/>
                    </ElFormItem>
                    {!LAYOUT_TABLE_HIDE_FIELD.includes(widgetType.value)&& (
                        <ElFormItem label='字段名称' labelPosition='top' required={true} error={filedErrorMessage.value}>
                            <ElInput placeholder='请输入' v-model={widgetName.value} onInput={filedChange}/>
                        </ElFormItem>
                    )}
                    <ConfigField key={configFieldKey.value} componentType={widgetType.value} componentName={widgetName.value} widgetProperties={widgetProperties}/>
                </>
            );
        };
        return()=>(
            <ElTabs stretch={true} class={[styles['my-tab-item'], styles['eli-right-props']]}
                    v-model={defaultForm.activeTab}>
                <ElTabPane label="组件配置" name='propsFiled'>
                    <ElScrollbar>
                        <ElCollapse v-model={activePropsFiled.value}>
                            <ElCollapseItem title="配置属性" name="baseField">
                                <ElForm>
                                    {renderBaseFields()}
                                </ElForm>
                            </ElCollapseItem>
                        </ElCollapse>
                    </ElScrollbar>
                </ElTabPane>
                <ElTabPane label="表单设置" name='propsForm'>
                    <ElScrollbar>
                        <ElForm>
                            <ElFormItem label='表单名称' labelPosition='top'>
                                <ElInput placeholder='请输入' v-model={defaultForm.name} />
                            </ElFormItem>
                            <ElFormItem label='标签宽度' labelPosition='top'>
                                <ElInput placeholder='请输入' v-model={defaultForm.labelWidth} />
                            </ElFormItem>
                            <ElFormItem label='标签后缀' labelPosition='top'>
                                <ElSwitch v-model={defaultForm.labelSuffix}></ElSwitch>
                            </ElFormItem>
                            <ElFormItem label='标签位置' labelPosition='top'>
                                <ElRadioGroup v-model={defaultForm.labelAlign}>
                                    <ElRadioButton label='左对齐' value='left' />
                                    <ElRadioButton label='右对齐' value='right' />
                                    <ElRadioButton label='顶对齐' value='top' />
                                </ElRadioGroup>
                            </ElFormItem>
                            <ElFormItem label='控件尺寸' labelPosition='top'>
                                <ElRadioGroup v-model={defaultForm.size}>
                                    <ElRadioButton label='Large' value='large' />
                                    <ElRadioButton label='Default' value='default' />
                                    <ElRadioButton label='Small' value='small' />
                                </ElRadioGroup>
                            </ElFormItem>
                        </ElForm>
                    </ElScrollbar>
                </ElTabPane>
            </ElTabs>
        )
    }
})