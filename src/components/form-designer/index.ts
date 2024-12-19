import type {App} from "vue";
import FormDesignerComponent from "@/components/form-designer/index.tsx";
import FormGeneratorComponent from "@/components/form-designer/form-generator/index.tsx"

const components: any[] = [FormDesignerComponent, FormGeneratorComponent];
export const install = (app:App) => {
    components.forEach(component => app.component((component.name,component)))
    // app.provide('params', options)
}
const FormDesigner = FormDesignerComponent;
const FormGenerator= FormGeneratorComponent
export {FormDesigner,FormGenerator}
export default {
    install,
    FormDesigner,
    FormGenerator
}