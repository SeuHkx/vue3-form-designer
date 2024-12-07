import LayoutRow from "@/components/form-designer/form-panel/form-render/render-layoutRow.tsx";
import LayoutTable from "@/components/form-designer/form-panel/form-render/render-layoutTable.tsx";
import LayoutCard from "@/components/form-designer/form-panel/form-render/render-layoutCard.tsx";
import FormItem from "@/components/form-designer/form-panel/form-render/render-formItem.tsx";
import Divider from "@/components/form-designer/form-panel/form-render/render-divider.tsx";
//vant
import VantFormItem from "@/components/form-designer/form-panel/form-render/vant/render-vantFormItem.tsx";
const mobile = 'vant';
export const typeMappings: Record<string, any> = {
    layoutRow: LayoutRow,
    layoutCard: LayoutCard,
    layoutTable: LayoutTable,
    formItem: FormItem,
    divider:Divider,
    // vant
    vantFormItem:VantFormItem
};
export const getComponentByType = (type: string,mode: number) => {
    if (mode === 1) {
        return typeMappings[`${mobile}${type.charAt(0).toUpperCase() + type.slice(1)}`] || VantFormItem;
    }
    return typeMappings[type] || FormItem;
};