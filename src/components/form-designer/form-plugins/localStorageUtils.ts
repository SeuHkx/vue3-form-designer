import {toRaw} from "vue";
import {
    LAYOUT_CHILDREN,
    LAYOUT_COL,
    LAYOUT_TABLE_CELL,
    PROPS_FORM
} from "@/components/form-designer/config-hardcode";
import {generateRandomString} from "@/utils/generateRandomString.ts";

type Widget = {
    type: string;
    name: string;
    label: string;
    id:string;
    properties: Record<string, any>;
    children?: Widget[];
};
export const initDefaultForm = (json: string, widgets: any, defaultForm: any) => {
    if (!json) return false;
    const convertPropertiesToWidgets = (properties: Record<string, any>): Widget[] => {
        return Object.entries(properties).map(([name, prop]) => {
            const widgetType = prop.widget || '';
            const {properties: _, ...rest} = prop;
            const widget: Widget = {
                type: widgetType,
                name,
                properties: rest,
                label: rest.label,
                id:`${widgetType}_${generateRandomString()}`
            };
            if (LAYOUT_COL === widgetType || LAYOUT_TABLE_CELL === widgetType) {
                widget.children = [];
            }
            if(LAYOUT_CHILDREN.includes(widgetType)){
                widget['children'] = []
            }
            if (prop.properties) {
                widget.children = convertPropertiesToWidgets(prop.properties);
            }
            return widget;
        });
    };
    try {
        const parsedData = JSON.parse(json);
        Object.assign(defaultForm, {
            ...defaultForm,
            ...parsedData,
            properties: new Map(Object.entries(parsedData.properties || {}))
        });
        widgets.value = convertPropertiesToWidgets(parsedData.properties);
        defaultForm.activeWidget = '';
        defaultForm.activeTab = PROPS_FORM;
        return true;
    } catch (error) {
        console.error("Failed to load form data:", error);
        return false;
    }
};

export const loadFromLocalStorage = (widgets: any, defaultForm: any) => {
    const savedWidgets = localStorage.getItem('eLiFormJson');
    if (savedWidgets) {
        initDefaultForm(savedWidgets, widgets, defaultForm);
    }
    return []; // 返回空数组如果没有数据
};
export const saveForm = (widgets: any, defaultForm: any, emit?: any) => {
    const transformWidgets = (widgetList: any[]): Record<string, any> => {
        return widgetList.reduce((acc: any, widget: any) => {
            const {name, properties, children} = widget;
            const widgetData: Record<string, any> = {...properties};
            if (children && children.length > 0) {
                widgetData.properties = transformWidgets(children);
            }
            acc[name] = widgetData;
            return acc;
        }, {} as Record<string, any>);
    };
    const widgetProperties = transformWidgets(widgets);
    const serializedForm = JSON.stringify({
        ...toRaw(defaultForm),
        properties: widgetProperties
    });
    if (emit) {
        emit('save', serializedForm);
    }
    return serializedForm
}
export const findWidgetIndex = (
    widgetList: Widget[],
    widgetName: string,
    path: Widget[] = []
): { index: number; parentPath: Widget[] } | null => {
    for (let i = 0; i < widgetList.length; i++) {
        const currentPath = [...path, widgetList[i]];
        if (widgetList[i].name === widgetName) {
            return {index: i, parentPath: path};
        }
        if (widgetList[i].children) {
            const result = findWidgetIndex(widgetList[i].children!, widgetName, currentPath);
            if (result) {
                return result;
            }
        }
    }
    return null;
};
export const saveToLocalStorage = (widgets: any, defaultForm: any): any => {
    if (!defaultForm.localCache) {
        return false;
    }
    const json = saveForm(widgets, defaultForm);
    localStorage.setItem('eLiFormJson', json);
};

export const clearLocalStorage = (): void => {
    localStorage.removeItem('eLiFormJson');
};

export const setLocalCacheState = (key: string, value: boolean) => {
    localStorage.setItem(key, value ? 'true' : 'false');
}
export const getLocalCacheState = (key: string) => {
    const value = localStorage.getItem(key);
    return value === 'true'; //
}