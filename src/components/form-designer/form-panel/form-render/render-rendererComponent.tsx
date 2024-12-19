import {defineComponent, PropType,watch} from 'vue';
import {
    ElButton, ElCascader,
    ElCheckbox,
    ElCheckboxGroup, ElDatePicker, ElIcon, ElImage,
    ElInput,
    ElInputNumber, ElLink, ElOption,
    ElRadio,
    ElRadioGroup,
    ElSelect, ElSlider, ElSwitch, ElUpload
} from "element-plus";
import {Plus} from "@element-plus/icons-vue";

export default defineComponent({
    name: 'RendererComponent',
    props: {
        type: {
            type: String as PropType<string>,
            required: true
        },
        properties: {
            type: Object as PropType<any>,
            required: true
        },
        formData:{
            type:Object as PropType<any>,
            required:false
        },
        formDataKey:{
            type: String as PropType<string>,
            required:false
        },
        onUploadPreview:{
            type: Function as PropType<(event: any, widget: any) => void>,
            required:false
        },
        onUploadSuccess:{
            type: Function as PropType<(event: any, widget: any) => void>,
            required:false
        },
        componentData:{
            type:Object as PropType<any>,
            required:false
        }
    },
    setup(props){
        const renderComponent = () => {
            let { type, properties, formData, formDataKey = 'value' ,onUploadPreview,onUploadSuccess,componentData} = props;

            const modelValue = {
                properties,
                ...(formData !== undefined && { formData }),
            };
            const uploadHandleRemove = () => {}
            const uploadHandlePreview = (uploadFile:any)=>{
                window.open(uploadFile.url, '_blank');
            }
            const dynamicClick =(formData)=> {
                componentData?.dynamicClick?.(formData);
            }
            const key = formData ? 'formData' : 'properties';
            switch (type) {
                case 'button':
                    return (

                        <ElButton
                            type={properties.typeButton}
                            size={properties.size}
                            plain={properties.plain}
                            round={properties.round}
                            circle={properties.circle}
                                disabled={properties.disabled}
                                style={{width: properties.width}}
                            >
                                {properties.labelName}
                            </ElButton>


                    );
                case 'input':
                    return (
                            <ElInput
                                placeholder={properties.placeholder}
                                size={properties.size}
                                v-model={modelValue[key][formDataKey]}
                                style={{width: properties.width}}
                                disabled={properties.disabled}
                                maxlength={properties.maxlength}
                            />
                    )
                case 'textarea':
                    return (
                        <ElInput
                            placeholder={properties.placeholder}
                            size={properties.size}
                            v-model={modelValue[key][formDataKey]}
                            style={{width: properties.width}}
                            type='textarea'
                            rows={properties.rows}
                            autosize={properties.autosize}
                            disabled={properties.disabled}
                            maxlength={properties.maxlength}
                        />
                    );
                case 'inputNumber':
                    return (
                        <ElInputNumber
                            min={properties.min}
                            max={properties.max}
                            v-model={modelValue[key][formDataKey]}
                            step={properties.step}
                            precision={properties.precision}
                            disabled={properties.disabled}
                            style={{width: properties.width}}
                            controlsPosition={properties.controlsPosition}
                        />
                    );
                case 'radio':
                    return (
                        <ElRadioGroup v-model={modelValue[key][formDataKey]} disabled={properties.disabled}>
                            {properties.enum.map((value:any, index:number) => (
                                <ElRadio value={value}>
                                    {properties.enumNames[index]}
                                </ElRadio>
                            ))}
                        </ElRadioGroup>
                    );
                case 'checkbox':
                    return (
                        <ElCheckboxGroup v-model={modelValue[key][formDataKey]} disabled={properties.disabled}>
                            {properties.enum.map((value:any, index:number) => (
                                <ElCheckbox label={properties.enumNames[index]} value={value} />
                            ))}
                        </ElCheckboxGroup>

                    );
                case 'select':
                    return (
                        <ElSelect
                            v-model={modelValue[key][formDataKey]}
                            placeholder={properties.placeholder}
                            multiple={properties.multiple}
                            filterable={properties.filterable}
                            disabled={properties.disabled}
                            style={{width: properties.width}}

                        >
                            {properties.enum.map((value:any, index:number) => (
                                <ElOption key={value} value={value} label={properties.enumNames[index]}></ElOption>
                            ))}
                        </ElSelect>
                    )
                case 'switch':
                    return (
                        <ElSwitch
                            v-model={modelValue[key][formDataKey]}
                            disabled={properties.disabled}
                        />
                    )
                case 'slider':
                    return(
                        <ElSlider
                            v-model={modelValue[key][formDataKey]}
                            showInput={properties.showInput}
                            min={properties.min}
                            max={properties.max}
                            step={properties.step}
                            disabled={properties.disabled}
                            style={{width: properties.width}}

                        />

                    )
                case 'datePicker':
                    return(
                        <ElDatePicker
                            v-model={modelValue[key][formDataKey]}
                            disabled={properties.disabled}
                            style={{width: properties.width}}
                            type={properties.typeDatePicker}
                            format={properties.format}
                            value-format={properties.format}
                            placeholder={properties.placeholder}
                            start-placeholder={properties.startPlaceholder}
                            end-placeholder={properties.endPlaceholder}
                        />
                    )
                case 'upload':
                    return(
                        <div style={{width:properties.width}}>
                            <ElUpload
                                v-model:file-list={modelValue[key][formDataKey === 'value'?'fileList':formDataKey]}
                                multiple={properties.multiple}
                                disabled={properties.disabled}
                                accept={properties.accept}
                                action={properties.action}
                                name={properties.name}
                                onSuccess={onUploadSuccess}
                                onRemove = {uploadHandleRemove}
                                onPreview={uploadHandlePreview}
                                headers={componentData?.upload?.headers || {}}
                            >
                                <ElButton type='primary' disabled={properties.disabled}>点击上传</ElButton>
                            </ElUpload>
                        </div>
                    )
                case 'uploadImg':
                    return (
                        <div style={{width:properties.width}}>
                            <ElUpload class='avatar-uploader'
                                      v-model:file-list={modelValue[key][formDataKey === 'value'?'fileList':formDataKey]}
                                      listType='picture-card'
                                      multiple={properties.multiple}
                                      disabled={properties.disabled}
                                      accept='.jpeg,.png,.jpg,.bmp,.gif'
                                      action={properties.action}
                                      name={properties.name}
                                      onSuccess={onUploadSuccess}
                                      onRemove ={uploadHandleRemove}
                                      onPreview= {onUploadPreview}
                                      headers={componentData?.upload?.headers || {}}
                            >
                                <ElIcon>
                                    <Plus />
                                </ElIcon>
                            </ElUpload>
                        </div>
                    )
                case 'text':
                    return (
                        <span>{modelValue[key][formDataKey]}</span>
                    )
                case 'textLink':
                    return(
                        <ElLink
                            type={properties.typeTextLink}
                            underline={properties.underline}
                            disabled={properties.disabled}
                            href={properties.href}
                            target={properties.newWindow?'_blank':'_self'}
                        >
                            {modelValue[key][formDataKey]}
                        </ElLink>
                    )
                case 'html':
                    return (
                        <div v-html={modelValue[key][formDataKey]}></div>
                    )
                case 'cascader':
                    return (
                        <ElCascader
                            placeholder={properties.placeholder}
                            filterable={properties.filterable}
                            props={{
                                multiple:properties.multiple,
                                checkStrictly:properties.checkStrictly
                            }}
                            style={{width: properties.width}}
                            options={properties.options}
                            v-model={modelValue[key][formDataKey]}
                        />
                    )
                case 'img':
                    let renderError = ()=> (
                        <div class='image-slot'>
                            <span>{properties.errorPlaceholder}</span>
                        </div>
                    )
                    return (
                        <ElImage v-slots={{error:renderError}} onClick={properties.dynamicClick?()=>dynamicClick(formDataKey):undefined} style={{width:properties.width,height:properties.height}} fit={properties.fit} src={modelValue[key][formDataKey]}/>
                    )
                default:
                    return null;
            }
        };
        return () => renderComponent();
    }
})