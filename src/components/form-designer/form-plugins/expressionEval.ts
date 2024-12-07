export const extractConditions = (input:any)=> {
    const regex = /{{\s*(.+?)\s*}}/;
    const match = input.match(regex);

    if (match) {
        const expression = match[1].trim(); // 提取表达式
        const conditions = expression.split(/(\s*&&\s*|\s*\|\|\s*)/); // 按逻辑运算符分割
        // 过滤掉无效的条件
        return conditions.map((condition:any) => {
            const trimmedCondition = condition.trim();
            if (trimmedCondition) {
                const parts = trimmedCondition.match(/([^=><!]+)\s*([=><!]+)\s*(.+)/);
                if (parts) {
                    return {
                        variable: parts[1].trim(),
                        operator: parts[2].trim(),
                        value: parts[3].trim()
                    };
                }
            }
            return null;
        }).filter(Boolean); // 返回提取的条件
    }
    return []; // 如果没有匹配，返回空数组
}

export const reconstructExpression = (conditions:any,widgets:any) =>{
    return conditions.map((cond, index) => {
        let element = widgets.find(item => item.name === cond.variable)
        const conditionStr = `${element.name} ${cond.operator} ${cond.value}`;
        return index > 0 ? `${cond.logicalOperator} ${conditionStr}` : conditionStr;
    }).join(' ');
}