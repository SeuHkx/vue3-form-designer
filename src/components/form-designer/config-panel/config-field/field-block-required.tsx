import {defineComponent, PropType, computed} from "vue";
import {ElForm, ElFormItem, ElInput, ElOption, ElSelect} from "element-plus";


export default defineComponent({
    name:'ConfigFieldRequired',
    props:{
        widgetProperties:{
            type: Object as PropType<any>,
            required: true
        },
        fieldState:{
            type:Boolean,
            required: true
        },
        componentField:{
            type:String,
            required: true
        }
    },
    setup(props){
        const rules = computed(() => {
            if (props.fieldState && !props.widgetProperties.value[props.componentField]) {
                props.widgetProperties.value[props.componentField] = [{
                    required: true,
                    message: '',
                    trigger: ''
                }];
            }
            return props.widgetProperties.value[props.componentField];
        });

        return ()=> (
            <div>
                <ElForm>
                    <ElFormItem label='校验信息' label-position='left'>
                        <ElInput
                            placeholder="自定义校验提示"
                            clearable
                            v-model={rules.value[0].message}
                        />
                    </ElFormItem>
                    <ElFormItem label='触发类型'>
                        <ElSelect placeholder='触发事件类型' v-model={rules.value[0].trigger}>
                            <ElOption value='blur'>blur</ElOption>
                            <ElOption value='change'>change</ElOption>
                        </ElSelect>
                    </ElFormItem>

                </ElForm>

            </div>
        )
    }
})