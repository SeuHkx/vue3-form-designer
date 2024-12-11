import FormDesignerComponent from "@/components/form-designer/index.tsx";
export const install = (app, options) => {
    app.config.globalProperties.$vue3Plugin = (str) => {
        return '全局函数打印的内容：' + str
    }
    app.component(FormDesignerComponent.name, FormDesignerComponent)
    app.provide('params', options)
}
export const FormDesigner = FormDesignerComponent
export default {
    FormDesigner,
    install
}