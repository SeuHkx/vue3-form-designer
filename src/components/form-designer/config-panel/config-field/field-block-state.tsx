import { defineComponent, PropType, computed,ref} from "vue";
import {ElButton, ElDialog, ElInput, ElRadio, ElRadioGroup, ElSwitch} from "element-plus";
import {VAceEditor} from "vue3-ace-editor";
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-chrome';
import {initGetDataExpressionValue} from "@/utils/generateRandomString.ts";
import styles from "./../index.module.less";

export default defineComponent({
    name: 'ConfigFieldState',
    components: {
        VAceEditor
    },
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
        const { widgetProperties, componentField } = props;
        const [hidden, disabled] = componentField.split('|');
        const setDataState = ref(false);
        const dataExpressionValue = ref(widgetProperties.value[hidden]);
        const editorValue = ref(initGetDataExpressionValue(widgetProperties.value[hidden]));
        const editorRef = ref<any>(null);

        const onEditorReady = (editor:any)=>{
            editorRef.value = editor;
        }
        const hiddenState = computed({
            get: () => widgetProperties.value[hidden] !== undefined,
            set: (value) => {
                //console.log('Setting hidden state:', value);
                if (value) {
                    widgetProperties.value[hidden] = hiddenRadioState.value === true ? true : hiddenDataExpression.value;
                } else {
                    delete widgetProperties.value[hidden];
                }
                //console.log('Hidden state set to:', widgetProperties.value[hidden]);
            }
        });

        const hiddenRadioState = computed({
            get: () => {
                if (widgetProperties.value[hidden] === true) {
                    return true;
                } else if (widgetProperties.value[hidden] !== undefined) {
                    return 'dataExpression';
                }
                return true; // 默认值
            },
            set: (value) => {
                //console.log('Setting hidden radio state:', value);
                if (value === true) {
                    widgetProperties.value[hidden] = true;
                } else {
                    widgetProperties.value[hidden] = hiddenDataExpression.value;
                    editorValue.value = ''
                    dataExpressionValue.value = '';
                }
               //console.log('Hidden radio state set to:', widgetProperties.value[hidden]);
            }
        });

        const hiddenDataExpression = computed(() => {
            const value = widgetProperties.value[hidden];
            return value === true || value === undefined ? '' : value;
        });

        const disabledDataExpression = computed(()=>{
            const value = widgetProperties.value[disabled];
            return value === true || value === undefined ? '' : value;
        })
        const disabledRadioState = computed({
            get: () => {
                if (widgetProperties.value[disabled] === true) {
                    return true;
                } else if (widgetProperties.value[disabled] !== undefined) {
                    return 'dataExpression';
                }
                return true; // 默认值
            },
            set: (value) => {
                //console.log('Setting hidden radio state:', value);
                widgetProperties.value[disabled] = value === true ? true : disabledDataExpression.value || '';
                //console.log('Hidden radio state set to:', widgetProperties.value[disabled]);
            }
        });
        const disabledState = computed({
            get: () => widgetProperties.value[disabled] !== undefined,
            set: (value) => {
                if(value){
                    widgetProperties.value[disabled] = disabledRadioState.value === true ? true : disabledDataExpression.value || '';
                }else{
                    delete widgetProperties.value[disabled];
                }
                //console.log('Setting disabled state:', value);
                widgetProperties.value[disabled] = value ? true : undefined;
                //console.log('Disabled state set to:', widgetProperties.value[disabled]);
            }
        });

        const renderDataExpression = ()=>{
            return(
                <ElInput style={{cursor: 'pointer'}} readonly placeholder='{{点击设置表达式}}' v-model={dataExpressionValue.value}/>
            )
        }
        const sureDataExpression = ()=>{
            dataExpressionValue.value = `{{${editorValue.value}}}`;
            widgetProperties.value[hidden] = dataExpressionValue.value;
            //console.log(editorRef.value.session.insert(editorRef.value.getCursorPosition(),`<span class="tag">tag</span>`));
            setDataState.value = false
        }
        const renderDialogFooter = ()=> (
            <div class='dialog-footer'>
                <ElButton onClick={() => {
                    setDataState.value = false
                }}>关闭</ElButton>
                <ElButton type='primary' onClick={() => sureDataExpression()}>
                    确定
                </ElButton>
            </div>
        )
        const renderSettingDataExpression = () => {
            return (
                <ElDialog destroy-on-close v-model={setDataState.value} title='编写表达式'
                          v-slots={{footer: renderDialogFooter}} width={1100}>
                    <VAceEditor
                        v-model:value={editorValue.value}
                        lang='javascript'
                        theme='chrome'
                        options={{
                            showPrintMargin:false,
                            readOnly: false,
                        }}
                        style={{ height: '550px' }}
                        ref={editorRef}
                        onInit={onEditorReady}
                    />
                </ElDialog>
            )
        }
        const clickDataExpression = ()=>{
            setDataState.value = true;
        }
        return () => (
            <>
                {renderSettingDataExpression()}
                <div class={styles['state-filed-wrap']}>
                    <div class={styles['state-filed-switch']}>
                        <span class={styles['state-filed-text']}>隐藏</span>
                        <ElSwitch v-model={hiddenState.value}></ElSwitch>
                    </div>
                    {hiddenState.value && (
                        <div class={styles['state-filed-show']}>
                            <ElRadioGroup v-model={hiddenRadioState.value}>
                                <ElRadio value={true}>静态</ElRadio>
                                <ElRadio value='dataExpression'>表达式</ElRadio>
                            </ElRadioGroup>
                            {hiddenRadioState.value !== true && <div onClick={clickDataExpression} style='margin-bottom:10px;cursor: pointer;'>{renderDataExpression()}</div>}
                        </div>
                    )}
                </div>
                <div class={styles['state-filed-wrap']}>
                    <div class={styles['state-filed-switch']}>
                        <span class={styles['state-filed-text']}>禁用</span>
                        <ElSwitch v-model={disabledState.value}></ElSwitch>
                    </div>
                    {disabledState.value && (
                        <div class={styles['state-filed-show']}>
                            <ElRadioGroup v-model={disabledRadioState.value}>
                                <ElRadio value={true}>静态</ElRadio>
                                {/*<ElRadio value='dataExpression'>表达式</ElRadio>*/}
                            </ElRadioGroup>
                            {disabledRadioState.value !== true && <div>{disabledDataExpression.value}</div>}
                        </div>
                    )}
                </div>
            </>
        );
    }
});
