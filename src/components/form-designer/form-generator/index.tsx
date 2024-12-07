import {computed, defineComponent, PropType, reactive, ref, watch} from 'vue';
import {
    ElCard,
    ElCol,
    ElDialog,
    ElDivider,
    ElForm,
    ElFormItem,
    ElIcon, ElImage,
    ElRow,
    ElUpload,
    UploadProps
} from 'element-plus';
import RendererComponent from "@/components/form-designer/form-panel/form-render/render-rendererComponent.tsx";
import {
    LAYOUT_ROW,
    LAYOUT_COL,
    LAYOUT_CARD,
    LAYOUT_TABLE,
    LAYOUT_TABLE_CELL, LAYOUT_TABLE_TH
} from "@/components/form-designer/config-hardcode";
import styles from "@/components/form-designer/form-panel/index.module.less";
import {extractConditions, reconstructExpression} from "@/components/form-designer/form-plugins/expressionEval.ts";
import {Parser} from "expr-eval";
import {Document, ZoomIn} from "@element-plus/icons-vue";

export default defineComponent({
    name: 'FormGenerator',
    props: {
        schemas: {
            type: String,
            required: true
        },
        formData: {
            type: Object,
            required: true,
            default: () => ({}),
        },
        componentData:{
            type: Object as PropType<any>,
            required:false
        },
        mode:{
            type:String,
            required:false,
            default:'edit'
        }
    },
    setup(props) {
        const { schemas ,formData,componentData} = props;
        const data = reactive<any>({});
        if(typeof schemas === 'undefined')return false;
        Object.assign(data, JSON.parse(schemas));
        const reactiveFormData = reactive({ ...formData });
        const handleUploadSuccess = (responseData:any,uploadFile:any) => {
            uploadFile.name = responseData.data.fileName;
            uploadFile.url  = responseData.data.filePath;
        };
        const dialogUploadVisible = ref(false);
        const dialogImageUrl = ref('');
        const handlePictureCardPreview : UploadProps['onPreview']= (uploadFile:any) => {
            dialogImageUrl.value = uploadFile.url!
            dialogUploadVisible.value = true
        }
        const initializeFormModel = (skipWidgets :string[] = []) => {
            const properties = data.properties || {};
            const processProperties = (props:any) => {
                Object.keys(props).forEach(key => {
                    const prop = props[key];
                    //跳过布局字段之类的控件
                    if (skipWidgets.includes(prop.widget)) {
                        if (prop.properties) {
                            processProperties(prop.properties);
                        }
                        return;
                    }
                    if (!(key in reactiveFormData)) {
                        if (prop.type === 'number') {
                            reactiveFormData[key] = Number(prop.value);
                        } else if(prop.widget === 'upload'|| prop.widget === 'uploadImg'){
                            reactiveFormData[key] = prop.fileList;
                        }else {
                            reactiveFormData[key] = prop.value;
                        }
                    }
                    if (prop.properties) {
                        processProperties(prop.properties);
                    }
                });
            };
            processProperties(properties);
            Object.assign(formData, reactiveFormData);
        };
        initializeFormModel([LAYOUT_ROW, LAYOUT_COL,LAYOUT_CARD,LAYOUT_TABLE,LAYOUT_TABLE_CELL,LAYOUT_TABLE_TH]);
        watch(reactiveFormData, (newVal) => {
            Object.assign(formData, newVal);
        }, { deep: true });
        const formDataComputed = computed(() => reactiveFormData);
        const widgets:any = ref([]);
        const renderProperties = (properties:any) => {
            return Object.entries(properties).map(([key, property]:any) => {
                widgets.value.push({
                    name:key,
                    property:property
                })
                const isComponentVisible = computed(() => {
                    if (property.hidden) {
                        if (typeof property.hidden !== 'boolean') {
                            const expression = ref('');
                            const hiddenExpression = extractConditions(property.hidden);
                            expression.value = reconstructExpression(hiddenExpression, widgets.value);
                            let scope = {};
                            hiddenExpression.forEach((expr) => {
                                let element = widgets.value.find(item => item.name === expr.variable);
                                scope[element.name] = String((formDataComputed.value[element.name]||''));
                            });
                            return Parser.evaluate(expression.value, scope);
                        } else {
                            return false;
                        }
                    }
                    return true;
                });
                if (property.widget === LAYOUT_ROW) {
                    return (
                        <ElRow key={key} gutter={property.gutter} justify={property.justify} align={property.align}>
                            {property.properties ? renderProperties(property.properties) : null}
                        </ElRow>
                    );
                }
                if (property.widget === LAYOUT_COL) {
                    return (
                        <ElCol key={key} span={property.span} offset={property.offset} push={property.push} pull={property.pull}>
                            {property.properties ? renderProperties(property.properties) : null}
                        </ElCol>
                    );
                }
                if(property.widget === LAYOUT_CARD){
                    return (
                        <ElCard header={property.hiddenHeader?'':property.header} shadow={property.shadow}  style={[{width: property.width},{'--eli-padding': property.padding},{borderWidth:property.borderWidth?0:{}}]}>
                            {property.properties ? renderProperties(property.properties) : null}
                        </ElCard>
                    )
                }
                if (property.widget === LAYOUT_TABLE) {
                    const totalRows = property.totalRows;
                    const totalThWidth =  property.totalThWidth;
                    const layoutCellKey = Object.keys(property.properties);
                    const resultKey = Array.from({ length: totalRows-1 }, (_, rowIndex) => {
                        return layoutCellKey.slice(rowIndex * totalThWidth.length, (rowIndex + 1) * totalThWidth.length);
                    });
                    return (
                        <table style={{
                            width: property.width,
                            borderTopWidth:property.borderWidth || '1px',
                            borderLeftWidth:property.borderWidth|| '1px',
                            borderLeftColor:property.borderColor,
                            borderTopColor:property.borderColor
                        }} class={styles['widget-table']}>
                            <thead>
                                <tr>
                                    {totalThWidth.map((thWidth, index) => (
                                        <th key={index} style={{
                                            width: thWidth,
                                            height: '0px',
                                            padding: '0px'
                                        }}>
                                            {/* 这里可以添加表头的内容 */}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                            {Array.from({ length: totalRows-1 }).map((_, rowIndex) => {
                                    return (
                                        <tr key={rowIndex}>
                                            {totalThWidth.map((_, colIndex) => {
                                                const prop = property.properties[resultKey[rowIndex][colIndex]];
                                                return (
                                                    !prop.isMerged && (
                                                        <td style={{
                                                            borderRightWidth: property.borderWidth,
                                                            borderBottomWidth: property.borderWidth,
                                                            borderBottomColor: property.borderColor,
                                                            borderRightColor: property.borderColor,
                                                            textAlign:property.textAlign,
                                                            verticalAlign:property.verticalAlign,
                                                            borderBottomStyle: 'solid',
                                                            borderRightStyle: 'solid',
                                                            padding: '5px',
                                                            height:prop.height
                                                        }}
                                                            colspan={prop.colspan}
                                                            rowspan={prop.rowspan}
                                                        >
                                                            {prop && prop.widget === LAYOUT_TABLE_CELL ? (
                                                                prop.properties ? renderProperties(prop.properties) : null
                                                            ) : (
                                                                <span>Empty</span>
                                                            )}
                                                        </td>
                                                    )

                                                )
                                            })}
                                        </tr>
                                    )
                            })}
                            </tbody>
                        </table>
                    );
                }
                if (property.widget === 'divider') {
                    return (
                        <ElDivider direction={property.direction} content-position={property.contentPosition}
                                   borderStyle={property.borderStyle}>
                            {property.label}
                        </ElDivider>
                    )
                }
                const modeRender = ()=>{
                    if(props.mode === 'read'){
                        if(property.widget === 'upload'){
                            const renderTrigger = (file:any)=> (
                                <div class='el-upload-list__item-info'>
                                    <a class='el-upload-list__item-name' target='_blank' style='text-decoration:none' download={file.file.name} href={file.file.url}>
                                        <ElIcon>
                                            <Document />
                                        </ElIcon>
                                        <span class='el-upload-list__item-file-name'>
                                            {file.file.name}
                                        </span>
                                    </a>
                                </div>
                            )
                            return (
                                <ElUpload class={styles['readHidden']}
                                          v-model:file-list={formData[key]}
                                          name={property.name}
                                          v-slots={{file:(file:any)=>renderTrigger(file)}}
                                >
                                </ElUpload>
                            )
                        }
                        if(property.widget === 'uploadImg'){
                            const renderTrigger = (file:any)=> (
                                <div>
                                    <img class="el-upload-list__item-thumbnail" src={file.file.url} alt=""/>
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview" onClick={()=>handlePictureCardPreview(file.file)}>
                                            <ElIcon size={30}>
                                                <ZoomIn/>
                                            </ElIcon>
                                        </span>
                                    </span>
                                </div>
                             )
                        return (
                                <ElUpload class={[['avatar-uploader'],styles['readHidden']]}
                                          v-model:file-list={formData[key]}
                                          listType='picture-card'
                                          name={property.name}
                                          v-slots={{file:(file:any)=>renderTrigger(file)}}
                                >
                                </ElUpload>
                            )

                        }
                        if(property.widget === 'html'){
                            return (
                                <div v-html={formData[key]}></div>
                            )
                        }
                        return(
                            formData[key]
                        )
                    }
                    if(props.mode === 'edit'){
                        return(
                            <RendererComponent
                                type={property.widget}
                                properties={property}
                                formData={formDataComputed.value}
                                formDataKey={key}
                                onUploadSuccess={(responseData:any,uploadFile:any) => handleUploadSuccess(responseData,uploadFile)}
                                onUploadPreview={(uploadFile:any)=>handlePictureCardPreview(uploadFile)}
                                componentData={componentData}
                            />
                        )
                    }
                }
                return (
                    isComponentVisible.value &&(<ElFormItem
                        class={property.labelHidden?'hidden-label':''}
                        key={key}
                        label={property.label}
                        labelWidth={property.labelWidth || ''}
                        required={property.required || false}
                        rules={property.rules}
                        prop={key}
                        labelPosition={property.labelPosition ? 'top' : ''}
                    >
                        {modeRender()}
                    </ElFormItem>)
                );
            });
        };
        return () => (
            <ElForm model={formDataComputed.value} labelWidth={data.labelWidth || ''}
                    labelSuffix={data.labelSuffix ? ':' : ''}
                    labelPosition={data.labelAlign}
                    size={data.size}
            >
                {renderProperties(data.properties || {})}
                <ElDialog v-model={dialogUploadVisible.value}  width={500} center>
                    <ElImage src={dialogImageUrl.value}/>
                </ElDialog>
            </ElForm>
        );
    }
});
