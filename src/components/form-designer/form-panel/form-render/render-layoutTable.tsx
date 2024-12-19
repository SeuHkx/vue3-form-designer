import {defineComponent, PropType, reactive, ref, toRefs,watch,onBeforeUnmount} from 'vue';
import {ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon} from 'element-plus';
import DraggableNested from "@/components/form-designer/form-panel/form-draggable/draggable-nested.tsx"; // 确保路径正确
import {Tools} from '@element-plus/icons-vue';
import {generateRandomString} from "@/utils/generateRandomString.ts";
import _ from 'lodash';
import styles from "./../index.module.less";
import {saveToLocalStorage} from "@/components/form-designer/form-plugins/localStorageUtils.ts";

const LayoutTable = defineComponent({
    name: 'LayoutTable',
    props: {
        element: {
            type: Object as PropType<any>,
            required: true
        },
        widgets: {
            type: Object as PropType<any>,
            required: false
        },
        defaultForm: {
            type: Object as PropType<any>,
            required: true
        },
        selectedWidget: {
            type: Object as PropType<any>,
            required: true
        },
        copyWidgetHandle: {
            type: Function as PropType<(event: any, widget: any) => void>,
            required: true
        },
        deleteWidgetHandle: {
            type: Function as PropType<(event: any, widget: any) => void>,
            required: true
        },
        widgetViewHandle: {
            type: Function as PropType<(event: any, widget: any) => void>,
            required: true
        },
        addAction:{
            type: Function as PropType<(widgets: any[]) => void>, // 定义 addAction 函数的类型
            required: true
        }
    },
    setup(props) {
        const {properties,children} = toRefs(props.element);
        const rows = ref<any>([]);
        const reactiveChildren = reactive([...children.value]);
        const unwatchers:any[] = [];
        const createTh = ()=>{
            const thArr = [];
            properties.value.totalThWidth.map(width=>{
                const th = reactive({
                    name:'layoutTableTh_'+generateRandomString(),
                    type:'layoutTableTh',
                    label:'表头',
                    properties:{
                        width:width
                    }
                })
                const unwatch = watch(
                    () => th.properties.width,
                    () => {
                        updateTotalThWidth();
                    }
                );
                unwatchers.push(unwatch);
                thArr.push(th);
            })
            return thArr;
        }
        onBeforeUnmount(() => {
            unwatchers.forEach(unwatch => unwatch());
        });

        const trHeader = {
            name:'trHeader',
            children:createTh()
        }
        rows.value = [trHeader];
        const trBodyInit = ()=>{
            Array.from({ length: properties.value.totalRows-1 }).map((_, rowIndex) => {
                let trBody = {
                    name:'trBody',
                    children:[],
                    id:'trBody_'+generateRandomString()
                }
                properties.value.totalThWidth.map((_, colIndex) =>{
                    trBody.children.push(reactiveChildren[colIndex]);
                })
                rows.value.push(trBody);
            })
        }
        trBodyInit();
        const getBodyRow = (id: string) => {
            return rows.value.find((row:any) => row.name === 'trBody' && row.id === id);
        };
        const createCell = (td:any)=>{
            let properties =  _.cloneDeep(td.properties);  //td.properties.colspan
            // properties.colspan = 1;
            // properties.rowspan = 1;
            // properties.isMerged = false;
            return reactive({
                type: td.type,
                name: `${td.type}_${generateRandomString()}`,
                properties: properties,
                label: td.label,
                children: [] // 新单元格的 children 为空
            });
        }
        const createNewRow = (cellChildren: []) => {
            return {
                name: 'trBody',
                id:'trBody_'+generateRandomString(),
                children: Array.from({ length: cellChildren.length }, (_, index) => {
                    return createCell(cellChildren[index]);
                })
            };
        };
        const insertCell = (td: any, direction: string,bodyId: string) => {
            const bodyRow = getBodyRow(bodyId);
            if (!bodyRow) return; // 如果没有找到对应的 trBody，直接返回
            // 找到 td 所在的行
            const rowIndex = rows.value.findIndex((row: any) => row.name === 'trBody' && row.id === bodyId);
            if (rowIndex === -1) return; // 如果没有找到当前行，直接返回
            // 找到 td 所在的列
            const colIndex = bodyRow.children.findIndex((cell: any) => cell.name === td.name);
            if (colIndex === -1) return; // 如果没有找到当前列，直接返回
            //const newCell = createCell(td);
            if (direction === 'left') {
                // 在当前列的左侧插入新单元格
                rows.value.forEach((row: any) => {
                    if (row.name === 'trBody') {
                        row.children.splice(colIndex, 0, createCell(td));
                    }
                    if(row.name === 'trHeader'){
                        row.children.splice(colIndex, 0, createTh().shift());
                    }
                });
            } else if (direction === 'right') {
                // 在当前列的右侧插入新单元格
                rows.value.forEach((row: any) => {
                    if (row.name === 'trBody') {
                        row.children.splice(colIndex + 1, 0, createCell(td));
                    }
                    if(row.name === 'trHeader'){
                        row.children.splice(colIndex + 1, 0, createTh().shift());
                    }
                });
            } else if (direction === 'up') {
                // 在当前行的上方插入新行
                const cellCount = bodyRow.children.length;
                const newRow = createNewRow(cellCount);
                rows.value.splice(rowIndex, 0, newRow);
            } else if (direction === 'down') {
                // 在当前行的下方插入新行
                let nextRowIndex= rowIndex === rows.value.length - 1 ? rowIndex : rowIndex + 1;
                const cellChildren = _.cloneDeep(rows.value[nextRowIndex].children);
                const newRow = createNewRow(cellChildren);
                //需要判断一下
                const rowspan = td.properties.rowspan > 1 ? td.properties.rowspan: rowIndex;
                rows.value.splice(rowspan + 1, 0, newRow);
                console.log(rows.value)
            }
            updateChildren();
        };
        const updateChildren = () => {
            // 清空 children 并重新填充
            children.value = rows.value
                .filter((row: any) => row.name === 'trBody') // 过滤出 'trBody' 行
                .flatMap((row: any) => row.children);// 提取所有单元格
            properties.value.totalRows = rows.value.length;
            updateTotalThWidth();
            saveToLocalStorage(props.widgets,props.defaultForm);
        };
        const updateTotalThWidth = ()=>{
            // 如果需要，可以保留这一行以过滤未定义的宽度
            properties.value.totalThWidth = rows.value
                .filter((row:any) => row.name === 'trHeader') // 过滤出所有 trHeader 行
                .flatMap((row:any) => row.children) // 提取每个 trHeader 行的 children
                .map((th:any) => th.properties.width !== undefined ? th.properties.width : '') // 使用 0 作为默认值
                .filter((width:any) => width !== undefined);
        }
        //初始化一次
        updateChildren();
        const setWidth = (td:any,id:string)=>{
            const bodyRow = getBodyRow(id);
            if (!bodyRow) return; // 如果没有找到对应的 trBody，直接返回
            // 找到 td 所在的列
            const colIndex = bodyRow.children.findIndex((cell: any) => cell.name === td.name);
            if (colIndex === -1) return; // 如果没有找到当前列，直接返
            props.selectedWidget.value = rows.value[0].children[colIndex];
        }
        const canDeleteColumn = (td:any)=>{
            if(td.properties.colspan > 1)return false;
            return rows.value[1].children.length !== 1;
        }
        const deleteColumn = (td:any,id:string)=>{
            const bodyRow = getBodyRow(id);
            if (!bodyRow) return; // 如果没有找到对应的 trBody，直接返回
            // 找到 td 所在的列
            const colIndex = bodyRow.children.findIndex((cell: any) => cell.name === td.name);
            if (colIndex === -1) return; // 如果没有找到当前列，直接返回
            // 从所有行中删除该列
            rows.value.forEach((row: any) => {
                if (row.name === 'trBody' || row.name === 'trHeader') {
                    let cell = row.children[colIndex];
                    if(cell.properties.isMerged){
                        let previousIndex= colIndex - 1;
                        let previousCell = row.children[previousIndex];
                        let isMerged = previousCell.properties.isMerged;
                        while (isMerged && previousIndex >= 0){
                            previousIndex--;
                            previousCell = row.children[previousIndex];
                            isMerged = previousCell.properties.isMerged;
                        }
                        previousCell.properties.colspan -= cell.properties.colspan;
                    }else if(cell.properties.colspan > 1){
                        cell.properties.isMerged = true;
                        row.children[colIndex+1].properties.isMerged = false;
                        row.children[colIndex+1].properties.colspan  += 1;
                    }
                    row.children.splice(colIndex, 1); // 删除该列
                }
            });
            updateChildren(); // 更新 children
        }
        const canDeleteRow = ()=>{
            return rows.value.length > 2;
        }
        const deleteRow = (id:string)=>{
            const bodyRow = getBodyRow(id);
            if (!bodyRow) return;
            const rowIndex = rows.value.findIndex((row: any) => row.name === 'trBody' && row.id === id);
            if (rowIndex === -1) return;
            rows.value.splice(rowIndex, 1);
            updateChildren();
        }
        const canMergeDown = (td:any,bodyId: string)=>{
            const rowIndex =  rows.value.findIndex((row:any) => row.id === bodyId); // 找到当前单元格所在的行索引
            const rowSpanIndex = rowIndex + (td.properties.rowspan || 1);
            return !(rowSpanIndex === -1 || rowSpanIndex > rows.value.length - 1 || td.properties.colspan > 1);
        }
        const mergeDown = (td: any, bodyId: string)=>{
            const rowIndex = rows.value.findIndex((row: any) => row.id === bodyId); // 找到当前单元格所在的行索引
            const bodyRow = getBodyRow(bodyId);
            if (!bodyRow) return; // 如果没有找到对应的 trBody，直接返回
            // 找到 td 所在的列
            const colIndex = bodyRow.children.findIndex((cell: any) => cell.name === td.name);
            if (rowIndex === -1 || rowIndex === rows.value.length - 1) {
                return; // 如果当前行索引无效或是最后一行，直接返回
            }
            const nextRowIndex = rowIndex + (td.properties.rowspan || 1); // 下一个单元格所在的行索引
            const nextRow = rows.value[nextRowIndex]; // 获取下一个行
            if (!nextRow || nextRow.children.length === 0) {
                console.warn('No cell to merge down with.');
                return; // 如果下方行不存在或没有子元素，停止合并
            }

            const nextCell = nextRow.children[colIndex]; // 获取下方的单元格

            if (!nextCell) {
                console.warn('No corresponding cell found to merge down with.');
                return; // 如果没有找到对应的单元格，停止合并
            }

            // 更新合并单元格的标签内容
            td.label = `${td.label}` //`${td.label}>${nextCell.label}`; // 合并标签内容
            // 更新 rowspan 属性
            td.properties.rowspan = (td.properties.rowspan || 1) + nextCell.properties.rowspan; // 增加 rowspan
            // 删除下方单元格
            nextRow.children[colIndex].properties.isMerged = true; // 删除下方单元格

            console.log('Merged cell down with:', nextCell);
            updateChildren(); // 更新 children
        }
        const canMergeRight = (td:any,bodyId:string)=>{
            const bodyRow = getBodyRow(bodyId);
            if (!bodyRow) return; // 如果没有找到对应的 trBody，直接返回
            // 找到 td 所在的列
            if(td.properties.rowspan > 1)return false;
            const colIndex = bodyRow.children.findIndex((cell: any) => cell.name === td.name);
            const rightCell = bodyRow.children[colIndex + (td.properties.colspan||1)];
            if(!rightCell){
                return false;
            }
            if (rightCell.properties.isMerged || colIndex === -1 || colIndex === bodyRow.children.length - 1 || rightCell.properties.rowspan > 1) return; // 如果没有找到当前列或是最后一列，直接返回
            return rightCell;
        }
        const mergeRight = (td: any, bodyId: string) => {
            const bodyRow = getBodyRow(bodyId);
            if (!bodyRow) return; // 如果没有找到对应的 trBody，直接返回
            // 找到 td 所在的列
            const colIndex = bodyRow.children.findIndex((cell: any) => cell.name === td.name);
            if (colIndex === -1 || colIndex === bodyRow.children.length - 1) return; // 如果没有找到当前列或是最后一列，直接返回
            const rightCell = bodyRow.children[colIndex + (td.properties.colspan || 1)];
            if (!rightCell) return; // 确保右侧单元格存在
            // 获取右侧单元格
            if (rightCell.children && rightCell.children.length > 0) {
                td.children.push(...rightCell.children);
            } else {
                console.log('No children to merge from removed cell.');
            }
            rightCell.properties.isMerged = true;
            const rightColspan = rightCell.properties.colspan || 1; // 获取右侧单元格的 colspan
            td.properties.colspan = (td.properties.colspan || 1) + rightColspan; // 增加 colspan

            updateChildren(); // 更新 children
        };
        const canSplitCell = (td: any, bodyId: string)=>{
            const bodyRow = getBodyRow(bodyId);
            if (!bodyRow) return;
            return !(!td.properties.colspan || td.properties.colspan <= 1);
        }
        const splitCell = (td: any, bodyId: string)=>{
            const bodyRow = getBodyRow(bodyId);
            if (!bodyRow) return;
            if (!td.properties.colspan || td.properties.colspan <= 1) {
                return;
            }
            const colspan = td.properties.colspan; // 获取当前单元格的 colspan
            const originalWidth = parseFloat(td.properties.width) || 0; // 获取当前单元格的宽度
            const newWidth = originalWidth / colspan; // 计算拆分后每个单元格的宽度

            // 更新当前单元格的属性
            td.properties.colspan = 1; // 将当前单元格的 colspan 设置为 1
            td.properties.width = newWidth; // 更新当前单元格的宽度

            // 创建新的单元格并添加到当前行中
            for (let i = 1; i < colspan; i++) { // 从 1 开始，因为第一个单元格已经存在
                let cell = bodyRow.children[bodyRow.children.indexOf(td) + i];
                cell.properties.isMerged = false;
                cell.properties.colspan  = 1;
            }
            updateChildren();
        }
        const canSplitRowCell = (td: any, bodyId: string)=>{
            const bodyRow = getBodyRow(bodyId);
            if (!bodyRow) return;
            return !(!td.properties.rowspan || td.properties.rowspan <= 1);
        }
        const splitRowCell = (td:any,bodyId:string)=>{
            const rowIndex = rows.value.findIndex((row: any) => row.id === bodyId); // 找到当前单元格所在的行索引
            const bodyRow = getBodyRow(bodyId);
            if (!bodyRow) return;
            if (!td.properties.rowspan || td.properties.rowspan <= 1) {
                return;
            }
            const colIndex = bodyRow.children.findIndex((cell: any) => cell.name === td.name);

            const rowspan = td.properties.rowspan; // 获取当前单元格的 colspan
            const originalHeight = parseFloat(td.properties.height) || 0; // 获取当前单元格的宽度
            const newHeight = originalHeight / rowspan; // 计算拆分后每个单元格的宽度

            // 更新当前单元格的属性
            td.properties.rowspan = 1; // 将当前单元格的 colspan 设置为 1
            td.properties.height = newHeight; // 更新当前单元格的宽度

            // 创建新的单元格并添加到当前行中
            for (let i = 1; i < rowspan; i++) { // 从 1 开始，因为第一个单元格已经存在
                let cell = rows.value[rowIndex+i].children[colIndex];
                cell.properties.isMerged = false;
                cell.properties.rowspan  = 1;
            }
            updateChildren();

        }
        const renderDropdownSlots = (td:any,id:string)=>{
            return (
                <ElDropdownMenu>
                    <ElDropdownItem command='insertLeft'>向左插入列</ElDropdownItem>
                    <ElDropdownItem command='insertRight'>向右插入列</ElDropdownItem>
                    <ElDropdownItem command='insertUp'>向上插入行</ElDropdownItem>
                    <ElDropdownItem command='insertDown'>向下插入行</ElDropdownItem>
                    <ElDropdownItem divided command='mergeRight' disabled={!canMergeRight(td,id)}>向右合并</ElDropdownItem>
                    <ElDropdownItem command='mergeDown' disabled={!canMergeDown(td,id)}>向下合并</ElDropdownItem>
                    <ElDropdownItem divided command='splitCell' disabled={!canSplitCell(td,id)}>拆分成列</ElDropdownItem>
                    <ElDropdownItem command='splitRowCell' disabled={!canSplitRowCell(td,id)}>拆分成行</ElDropdownItem>
                    <ElDropdownItem divided disabled={!canDeleteColumn(td)} command='deleteColumn'>删除当前列</ElDropdownItem>
                    <ElDropdownItem command='deleteRow' disabled={!canDeleteRow()}>删除当前行</ElDropdownItem>
                    <ElDropdownItem divided command='setWidth'>设置宽度</ElDropdownItem>
                </ElDropdownMenu>
            )
        }
        const handleCommand = (command: string, td: any,id:string) => {
            switch (command) {
                case 'insertLeft':
                    insertCell(td, 'left',id);
                    break;
                case 'insertRight':
                    insertCell(td, 'right',id);
                    break;
                case 'insertUp':
                    insertCell(td, 'up',id);
                    break;
                case 'insertDown':
                    insertCell(td, 'down',id);
                    break;
                case 'mergeRight':
                    mergeRight(td,id);
                    break;
                case 'mergeDown':
                    mergeDown(td,id);
                    break;
                case 'splitCell':
                    splitCell(td,id);
                    break;
                case 'splitRowCell':
                    splitRowCell(td,id);
                    break;
                case 'deleteColumn':
                    deleteColumn(td,id);
                    break;
                case 'deleteRow':
                    deleteRow(id);
                    break;
                case 'setWidth':
                    setWidth(td,id);
                    break;
                default:
                    break;
            }
        };
        const renderTable = (child:any,id:string)=> {
            return (
                    <tr>
                        {child.map((td:any)=> (
                            !td.properties.isMerged&& (
                                <td
                                    colspan={td.properties.colspan}
                                    rowspan={td.properties.rowspan}
                                    style={{
                                        height: td.properties.height,
                                        borderRightWidth:  properties.value.borderWidth,
                                        borderBottomWidth: properties.value.borderWidth,
                                        borderBottomColor: properties.value.borderColor,
                                        borderRightColor:  properties.value.borderColor,
                                        borderBottomStyle: 'solid',
                                        borderRightStyle: 'solid',
                                        textAlign:td.properties.textAlign,
                                        verticalAlign:td.properties.verticalAlign
                                    }}
                                    onClick={(event: any) => props.widgetViewHandle(event, td)}
                                    class={[styles['widget-col'],[`w-td-${td.properties.justifyContent}`], {[styles['selected']]: props.defaultForm.activeWidget === td.name}]}
                                >
                                    <DraggableNested
                                        widgets={td.children}
                                        selectedWidget={props.selectedWidget}
                                        defaultForm={props.defaultForm}
                                        addAction={props.addAction}
                                        initClass=" "
                                        class={styles['widget-col-wrap']}
                                    />
                                    {props.defaultForm.activeWidget === td.name && (
                                        <div class={styles['pointer-wrapper']}>
                                            <ElDropdown onCommand={(command: any) => handleCommand(command, td, id)}
                                                        trigger='click'
                                                        v-slots={{dropdown: () => renderDropdownSlots(td, id)}}>
                                                <div class={styles['pointer']}>
                                                    <ElIcon>
                                                        <Tools/>
                                                    </ElIcon>
                                                </div>
                                            </ElDropdown>
                                        </div>
                                    )}
                                </td>
                            )

                        ))}
                    </tr>
            )
        }
        const renderTableHeader = (child: any) => (
            <tr>
                {child.map((tr: any) => (
                    <th style={{width: tr.properties.width}} class={[styles['widget-table-th-header'],tr.name === props.defaultForm.activeWidget?styles['selected-th-header']:'']}
                        onClick={(event: any) => props.widgetViewHandle(event, tr)}>
                        <div class={styles['widget-table-header']}><b>{tr.properties.width}</b></div>
                    </th>
                ))}
            </tr>
        )
        return () => (
            <table style={{
                width: properties.value.width,
                borderTopWidth:properties.value.borderWidth || '1px',
                borderLeftWidth:properties.value.borderWidth|| '1px',
                borderLeftColor:properties.value.borderColor,
                borderTopColor:properties.value.borderColor
            }} class={styles['widget-table']}>
                {rows.value.map((row: any) => {
                    if (row.name === 'trHeader') {
                        return renderTableHeader(row.children)
                    }
                    if (row.name === 'trBody') {
                        return renderTable(row.children, row.id)
                    }
                })}
            </table>
        );
    }
});

export default LayoutTable;