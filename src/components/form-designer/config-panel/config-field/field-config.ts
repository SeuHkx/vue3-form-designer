//input
export const inputFieldConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'value', title: '默认值', widget: 'input'},
    {field: 'placeholder', title: '占位内容', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'maxlength', title: '最大输入长度', widget: 'inputNumber'},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'dynamicValue', title: '动态值', widget: 'switch'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},


];
//textarea
export const textareaFieldConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'value', title: '默认值', widget: 'input'},
    {field: 'placeholder', title: '占位内容', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'maxlength', title: '最大输入长度', widget: 'inputNumber'},
    {field: 'autosize', title: '高度自适应', widget: 'switch'},
    {field: 'rows', title: '输入框行数', widget: 'inputNumber'},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'dynamicValue', title: '动态值', widget: 'switch'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},


];
//input-number
export const inputNumberFieldConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'value', title: '默认值', widget: 'inputNumber'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'min', title: '最小值', widget: 'inputNumber'},
    {field: 'max', title: '最大值', widget: 'inputNumber'},
    {field: 'step', title: '步长', widget: 'inputNumber'},
    {field: 'precision', title: '精度', widget: 'inputNumber'},
    {field: 'controlsPosition', title: '按钮位置', widget: 'radioButton',enum:['','right'],enumNames:['默认','右侧']},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'dynamicValue', title: '动态值', widget: 'switch'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//radio
export const radioGroupConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'options', title: '选项管理', widget: 'block', component: 'ConfigFieldRadioOptions', componentField: ''},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'dynamicValue', title: '动态值', widget: 'switch'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
export const checkboxConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'options', title: '选项管理', widget: 'block', component: 'ConfigFieldRadioOptions', componentField: ''},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'dynamicValue', title: '动态值', widget: 'switch'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//select
export const selectConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'placeholder', title: '占位内容', widget: 'input'},
    {field: 'multiple', title: '是否多选', widget: 'switch'},
    {field: 'filterable', title: '是否搜索', widget: 'switch'},
    {field: 'options', title: '选项管理', widget: 'block', component: 'ConfigFieldRadioOptions', componentField: ''},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'dynamicValue', title: '动态值', widget: 'switch'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]

//switch
export const switchConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'value', title: '默认值', widget: 'switch'},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//slider
export const sliderConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'showInput', title: '是否显示输入框', widget: 'switch'},
    {field: 'min', title: '最小值', widget: 'inputNumber'},
    {field: 'max', title: '最大值', widget: 'inputNumber'},
    {field: 'step', title: '步长', widget: 'inputNumber'},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//datePicker
export const datePickerConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {   field: 'typeDatePicker',
        title: '日期类型',
        widget: 'select',
        enum:['date','week','month','year','datetime','daterange','datetimerange','monthrange'],
        enumNames:['日期','周','月','年','时间','日期范围','时间范围','月份范围'],
        eventBind:{
            widget:['placeholder','startPlaceholder','endPlaceholder'],
            prop:'hidden',
            callback:(value:any,props:any)=>{
                if(['datetimerange', 'daterange', 'monthrange'].includes(value)){
                    props['value'] = ['',''];
                }else{
                    props['value'] = '';
                }
            }
        }
    },
    {field: 'placeholder', title: '占位内容', widget: 'input',
        hidden:false,
        bind:true,
        conditions: {
            shouldHide: (value:any) => ['datetimerange', 'daterange', 'monthrange'].includes(value),
        }
    },
    {
        field: 'startPlaceholder',
        title: '开始占位内容',
        widget: 'input',
        hidden:true,
        bind:true,
        conditions: {
            shouldHide: (value:any) => ['date','week','month','year','datetime'].includes(value),
        },
    },
    {
        field: 'endPlaceholder',
        title: '结束占位内容',
        widget: 'input',
        hidden:true,
        bind:true,
        conditions: {
            shouldHide: (value:any) => ['date','week','month','year','datetime'].includes(value),
        },
    },

    {field: 'format', title: '显示格式', widget: 'input'},

    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//button
export const buttonFieldConfig = [
    {field: 'labelName', title: '按钮名称', widget: 'input'},
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'typeButton', title: '按钮类型', widget: 'select',enum:['primary','success','warning','danger','info'],enumNames:['Primary','Success','Warning','Danger','Info']},


    {field: 'plain', title: '圆角按钮', widget: 'switch'},
    {field: 'round', title: '朴素按钮', widget: 'switch'},
    {field: 'circle', title: '圆形按钮', widget: 'switch'},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},


];
//upload
export const uploadConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},

    {field: 'multiple', title: '是否多选', widget: 'switch'},
    {field: 'limit', title: '允许最大上传数', widget: 'inputNumber'},
    {field: 'action', title: '上传地址', widget: 'input' ,required:true},
    {field: 'name', title: '上传文件字段', widget: 'input'},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},

]
//uploadImg
export const uploadImgConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},

    {field: 'multiple', title: '是否多选', widget: 'switch'},
    {field: 'limit', title: '允许最大上传数', widget: 'inputNumber'},
    {field: 'action', title: '上传地址', widget: 'input',required:true},
    {field: 'name', title: '上传文件字段', widget: 'input'},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},

]
//layoutGrid
export const layoutRowConfig = [
    {field: 'justify', title: '水平排列方式', widget: 'select',enum:['start','end','center','space-around','space-between'],enumNames:['左对齐','右对齐','居中','两侧间隔相等','两端对齐']},
    {field: 'align', title: '垂直对齐方式', widget: 'select',enum:['top','middle','bottom'],enumNames:['顶部对齐','居中','底部对齐']},
    {field: 'gutter', title: '栅格间距', widget: 'inputNumber'},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//col
export const layoutColConfig = [
    {field: 'span', title: '栅格占位格数', widget: 'inputNumber'},
    {field: 'offset', title: '栅格左侧的间隔格数', widget: 'inputNumber'},
    {field: 'push', title: '栅格向右移动格数', widget: 'inputNumber'},
    {field: 'pull', title: '栅格向左移动格数', widget: 'inputNumber'},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]

//card
export const layoutCardConfig = [
    {field: 'header', title: '标题', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'padding', title: '内边距', widget: 'input'},
    {field: 'hiddenHeader', title: '显示标题区域', widget: 'switch'},
    {field: 'borderWidth', title: '是否有边框', widget: 'switch'},
    {field: 'shadow', title: '阴影显示', widget: 'radioButton',enum:['always','never','hover'],enumNames:['always','never','hover']},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//text
export const textConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'value', title: '默认值', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//img
export const imgConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'fit', title: '图片适应类型', widget: 'select',enum:['fill','contain','cover','none','scale-down'],enumNames:['fill','contain','cover','none','scale-down']},
    {field: 'dynamicClick', title: '是否传递点击事件', widget: 'switch'},
    {field: 'errorPlaceholder', title: '占位提示', widget: 'input'},
    {field: 'value', title: '图片地址', widget: 'input'},
    {field: 'width', title: '图片宽度', widget: 'input'},
    {field: 'height', title: '图片高度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'required', title: '必填项', widget: 'switch', component: 'ConfigFieldRequired', componentField: 'rules'},
    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//text link
export const textLinkConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'link', title: '链接名称', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {field: 'typeTextLink', title: '链接类型', widget: 'select',enum:['default','primary','success','warning','danger','info'],enumNames:['Default','Primary','Success','Warning','Danger','Info']},
    {field: 'href', title: '链接地址', widget: 'input'},
    {field: 'underline', title: '下划线', widget: 'switch'},
    {field: 'newWindow', title: '是否在新窗口打开', widget: 'switch'},


    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//cascader
export const cascaderConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'placeholder', title: '占位内容', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},

    {field: 'options', title: '选项管理', widget: 'block', component: 'ConfigFieldCascader', componentField: 'options'},
    {field: 'multiple', title: '是否多选', widget: 'switch'},
    {field: 'filterable', title: '是否搜索', widget: 'switch'},
    {field: 'checkStrictly', title: '选择任意一级', widget: 'switch'},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]
//html
export const htmlConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'labelWidth', title: '标签宽度', widget: 'input'},
    {field: 'labelHidden', title: '隐藏标签', widget: 'switch'},
    {field: 'labelPosition', title: '标签换行', widget: 'switch'},
    {filed: 'defaultValue',title:'默认值',  widget:'block',component: 'ConfigFieldPopover', componentField: 'value'},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]

//divider
export const dividerConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'contentPosition', title: '文案位置', widget: 'radioButton',enum:['left','center','right'],enumNames:['左侧','居中','右侧']},
    {field: 'borderStyle', title: '虚线', widget: 'radioButton',enum:['none','solid','dashed','dotted'],enumNames:['隐藏','实线','虚线','点状']},
    {field: 'direction', title: '方向', widget: 'radioButton',enum:['horizontal','vertical'],enumNames:['水平','垂直']},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]

//table
export const layoutTableConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'width', title: '宽度', widget: 'input'},
    {field: 'borderWidth', title: '表格边框宽度', widget: 'input'},
    {field: 'borderColor', title: '表格边框颜色', widget: 'colorPicker'},

    {field: 'state', title: '状态', widget: 'block', component: 'ConfigFieldState', componentField: 'hidden|disabled'},
]

export const layoutTableCellConfig = [
    {field: 'label', title: '标题', widget: 'input'},
    {field: 'height', title: '高度', widget: 'input'},
    {field: 'justifyContent', title: '元素对齐方式', widget: 'radioButton',enum:['left','center','end'],enumNames:['居右','居中','居左']},
]

export const layoutTableThConfig = [
    {field: 'width', title: '宽度', widget: 'input'},
]