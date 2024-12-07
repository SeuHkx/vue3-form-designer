import {defineComponent, PropType, reactive} from "vue";
import {
    ElColorPicker,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElOption,
    ElRadioButton,
    ElRadioGroup,
    ElSelect,
    ElSwitch
} from "element-plus";
import ConfigFieldRequired from "@/components/form-designer/config-panel/config-field/field-block-required.tsx";
import ConfigFieldState from "@/components/form-designer/config-panel/config-field/field-block-state.tsx";
import ConfigFieldRadioOptions from "@/components/form-designer/config-panel/config-field/field-block-radio-options.tsx";
import ConfigFieldPopover from "@/components/form-designer/config-panel/config-field/field-block-html.tsx";
import ConfigFieldCascader from "@/components/form-designer/config-panel/config-field/field-block-cascader.tsx";

import {
    buttonFieldConfig, cascaderConfig,
    checkboxConfig,
    datePickerConfig, dividerConfig, htmlConfig,
    inputFieldConfig,
    inputNumberFieldConfig, layoutCardConfig, layoutColConfig,
    layoutRowConfig, layoutTableCellConfig, layoutTableConfig, layoutTableThConfig,
    radioGroupConfig,
    selectConfig,
    sliderConfig,
    switchConfig,
    textareaFieldConfig, textConfig, textLinkConfig,
    uploadConfig,
    uploadImgConfig
} from "@/components/form-designer/config-panel/config-field/field-config.ts";
const configComponentMap = {
    ConfigFieldRequired,
    ConfigFieldState,
    ConfigFieldRadioOptions,
    ConfigFieldPopover,
    ConfigFieldCascader
};
export default defineComponent({
    name:'ConfigField',
    props:{
        widgetProperties:{
            type: Object as PropType<any>,
            required: true
        },
        componentType: {
            type: String,
            required: true
        },
        componentName:{
            type:String,
            required:true
        }
    },
    setup(props){

        const getComponentByType = (type: string) => {
            return configComponentMap[type] || null;
        };

        const renderComponent = (prop: any) => {
            const renderSwitchComponent = (prop: any) => {
                const hasComponent = !!prop.component && prop.component !== '';
                const FieldRequired = getComponentByType(prop.component);
                const fieldState = props.widgetProperties.value[prop.field];
                if (FieldRequired && fieldState && hasComponent) {
                    return (
                        <FieldRequired
                            widgetProperties={props.widgetProperties}
                            componentField={prop.componentField}
                            fieldState={fieldState}
                        />
                    );
                } else {
                    delete props.widgetProperties.value[prop.componentField];
                    return null;
                }
            };
            const renderBlockComponent = (prop:any)=>{
                const FieldState = getComponentByType(prop.component);
                return (
                    <FieldState
                        widgetProperties={props.widgetProperties}
                        componentField={prop.componentField}
                    />
                )
            }
            const renderInput = (prop:any)=>{
                return (
                    <ElInput
                        v-model={props.widgetProperties.value[prop.field]}
                        clearable
                    />
                )
            }
            const renderInputNumber = (prop:any)=>{
                const changeInputNumber = (value: any, field: string)=>{
                    if (value === null || value <= 0) {
                        delete props.widgetProperties.value[field];
                    }
                }
                return (
                    <ElInputNumber controlsPosition='right' step={1} v-model={props.widgetProperties.value[prop.field]} onChange={(value:any) => changeInputNumber(value, prop.field)}/>
                )
            }
            const renderSwitch = (prop:any)=>{

                return (
                    <>
                        <div>
                            <ElSwitch v-model={props.widgetProperties.value[prop.field]}/>
                        </div>
                        {renderSwitchComponent(prop)}
                    </>
                )
            }
            const renderSelect = (prop:any)=> {
                const onChangeHandler = (prop:any) => {
                    return (value: any) => {
                        if (prop.eventBind) {
                            prop.eventBind.widget.forEach((name: any) => {
                                linkPropsMap[name][prop.eventBind.prop] = linkPropsMap[name].conditions.shouldHide(value);
                            });
                            prop.eventBind.callback(value,props.widgetProperties.value);
                        }
                    };
                };
                return (
                        <ElSelect
                            v-model={props.widgetProperties.value[prop.field]}
                            placeholder='请选择类型'
                            onChange={onChangeHandler(prop)}
                        >
                            {prop.enum.map((value: any, index: number) => (
                                <ElOption key={value} value={value} label={prop.enumNames[index]}></ElOption>
                            ))}
                        </ElSelect>
                )
            }
            const renderBlock = (prop:any)=>(
                renderBlockComponent(prop)
            )
            const renderRadioButton = (prop:any)=>(
                <ElRadioGroup v-model={props.widgetProperties.value[prop.field]}>
                    {prop.enum.map((value: any, index: number) => (
                        <ElRadioButton key={value} value={value} label={prop.enumNames[index]} />
                    ))}
                </ElRadioGroup>
            )
            const renderColorPicker = (prop:any)=>(
                <ElColorPicker v-model={props.widgetProperties.value[prop.field]}/>
            )
            const matchRenderFieldComponent = {
                input: renderInput,
                inputNumber: renderInputNumber,
                switch: renderSwitch,
                block: renderBlock,
                select:renderSelect,
                radioButton:renderRadioButton,
                colorPicker:renderColorPicker
            }
            return matchRenderFieldComponent[prop.widget] ? matchRenderFieldComponent[prop.widget](prop) : null;

        };
        const getPropsBaseFieldByType = (type: string) => {
            switch (type) {
                case 'input':
                    return inputFieldConfig;
                case 'textarea':
                    return textareaFieldConfig;
                case 'inputNumber':
                    return inputNumberFieldConfig;
                case 'radio':
                    return radioGroupConfig;
                case 'checkbox':
                    return checkboxConfig;
                case 'select':
                    return selectConfig;
                case 'switch':
                    return switchConfig;
                case 'slider':
                    return sliderConfig;
                case 'datePicker':
                    return datePickerConfig;
                case 'button':
                    return buttonFieldConfig;
                case 'upload':
                    return uploadConfig;
                case 'uploadImg':
                    return uploadImgConfig;
                case 'layoutRow':
                    return layoutRowConfig;
                case 'layoutCol':
                    return layoutColConfig;
                case 'layoutCard':
                    return layoutCardConfig;
                case 'layoutTable':
                    return layoutTableConfig;
                case 'layoutTableCell':
                    return layoutTableCellConfig;
                case 'layoutTableTh':
                    return layoutTableThConfig;
                case 'divider':
                    return dividerConfig;
                case 'text':
                    return textConfig;
                case 'textLink':
                    return textLinkConfig;
                case 'html':
                    return htmlConfig;
                case 'cascader':
                    return cascaderConfig;
                default:
                    return [];
            }
        };
        const propsField = getPropsBaseFieldByType(props.componentType);
        const linkPropsMap = reactive(
            propsField.reduce((acc, prop:any) => {
                if (prop.bind) {
                    acc[prop.field] = reactive({ ...prop });
                }
                return acc;
            }, {})
        );
        return ()=>(
            <>
                {propsField.map((prop:any) => {
                    if (linkPropsMap[prop.field]?.hidden) {
                        return null;
                    }
                    return (
                        <ElFormItem class={prop.component?'block-children':''} label={prop.title} labelPosition="top" key={prop.field} required={prop.required}>
                            {renderComponent(prop)}
                        </ElFormItem>
                    )
                })}
            </>
        )
    }
})