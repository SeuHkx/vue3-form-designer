import { ref } from 'vue';

export function useUndoRedo() {
    const history = ref<any[]>([]);
    const historyIndex = ref(0);
    const lastAction = ref<any>(null); // 用于跟踪上一次操作

    const addAction = (value: any) => {
        // 如果当前索引小于历史长度，清除未来的历史记录
        if (historyIndex.value < history.value.length) {
            history.value.splice(historyIndex.value);
        }

        // 仅在状态变化时添加新的历史记录
        if (JSON.stringify(value) !== JSON.stringify(lastAction.value)) {
            history.value.push(value);
            historyIndex.value++; // 增加索引
            lastAction.value = value; // 更新最后一次操作
        }
    };

    const undo = (): any | null => {
        if (canUndo()) {
            historyIndex.value--; // 减少索引
            return historyIndex.value === 0 ? null : history.value[historyIndex.value - 1];
        }
        return null;
    };

    const redo = (): any | null => {
        if (canRedo()) {
            const value = history.value[historyIndex.value];
            historyIndex.value++; // 增加索引
            return value;
        }
        return null;
    };

    const canUndo = () => historyIndex.value > 0;
    const canRedo = () => historyIndex.value < history.value.length;

    return {
        addAction,
        undo,
        redo,
        canUndo,
        canRedo,
        history,
        historyIndex,
    };
}
