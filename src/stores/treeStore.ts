import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTreeStore = defineStore('tree', () => {
    const treeInstance:any = ref(null);

    const setTreeInstance = (instance:any)=> {
        treeInstance.value = instance;
    }
    return { treeInstance, setTreeInstance };
});