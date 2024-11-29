import type { ITask } from "@/types/task";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'tasks'

export const getTasksOnStorage = async () => {
    const tasks = await AsyncStorage.getItem(STORAGE_KEY);
    return tasks != null ? JSON.parse(tasks) : null;
};

export const updateTaskOnStorage = async (items: ITask) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const deleteTasksOnStorage = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
}

export const deleteTask = async (id: string) => {
    const allItems = await AsyncStorage.getItem(STORAGE_KEY);

     if (allItems) {
        const parsedItems: ITask[] = JSON.parse(allItems);
        const updatedItems = parsedItems.filter(item => item.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    }
};