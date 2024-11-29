import { ITask, TaskStatus } from "@/types/task";
import {
  deleteTask,
  getTasksOnStorage,
  updateTaskOnStorage,
} from "@/utils/storage";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useToast, Alert } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert as AlertConfirm } from "react-native";
import { genAI } from "@/utils/genai";

interface TasksContextProps {
  children: ReactNode;
}

interface TasksContextData {
  tasks: ITask[];
  handleUpdateTaskStatusToDone: (cardId: string) => void;
  fetchStorageTasks: () => Promise<void>;
  saveTasksOnStorage: (value: ITask) => Promise<void>;
  deleteTaskById: (taskId: string) => Promise<void>;
  isLoading: boolean;
  isLoadingPhrase: boolean;
  motivationalPhrase: string;
}

export const TasksContext = createContext<TasksContextData>(
  {} as TasksContextData
);

export default function TasksContextProvider({ children }: TasksContextProps) {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPhrase, setIsLoadingPhrase] = useState(false);
  const [motivationalPhrase, setMotivationalPhrase] = useState("");

  const toast = useToast();

  const fetchStorageTasks = async () => {
    const storageTasks: ITask[] = await getTasksOnStorage();
    setTasks(storageTasks);
  };

  useEffect(() => {
    fetchStorageTasks();
  }, []);

  useEffect(() => {
    async function generateMotivationalPhrase() {
      try {
        setIsLoadingPhrase(true);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro",
        });
        const prompt = await model.generateContent(
          `Crie uma frase motivacional curta e inspiradora com até 20 palavras e focada em produtividade voltadas para aumentar a produtividade e manter o bem-estar ao realizar tarefas. A frase deve ser amigável, direta e positiva, com um tom encorajador. Exemplos:
        Não se esqueça de fazer pausas! Concluir uma tarefa é mais fácil quando você está descansado.
        Pequenos passos levam a grandes conquistas. Continue avançando!`
        );
        const phrase = prompt.response.text();
        setMotivationalPhrase(phrase);
      } catch (error) {
        console.log("Something Went Wrong", error);
      } finally {
        setIsLoadingPhrase(false);
      }
    }
    generateMotivationalPhrase();
  }, []);

  const handleUpdateTaskStatusToDone = async (cardId: string) => {
    try {
      setIsLoading(true);
      const tasks = await getTasksOnStorage();

      const updatedTasks = tasks.map((item: ITask) =>
        item.id === cardId ? { ...item, status: TaskStatus.DONE } : item
      );

      await updateTaskOnStorage(updatedTasks);
      await fetchStorageTasks();

      toast.show({
        placement: "top-right",
        render: () => (
          <Alert
            bg="emerald.500"
            status="success"
            variant=""
            py="3"
            mx={"3"}
            rounded="sm"
          >
            Tarefa finalizada com sucesso!
          </Alert>
        ),
      });
    } catch (error) {
      toast.show({
        placement: "top-right",
        render: () => (
          <Alert
            bg="emerald.500"
            status="success"
            variant=""
            py="3"
            mx={"3"}
            rounded="sm"
          >
            Erro ao atualizar tarefa!
          </Alert>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasksOnStorage = async (value: ITask) => {
    const existingTasks = await AsyncStorage.getItem("tasks");
    const tasks = existingTasks ? JSON.parse(existingTasks) : [];
    tasks.push(value);
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const deleteTaskById = async (taskId: string) => {
    AlertConfirm.alert(
      "Confirmar deleção",
      "Você tem certeza de que deseja deletar este item?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await deleteTask(taskId);
              toast.show({
                placement: "top-right",
                render: () => (
                  <Alert bg="emerald.500" status="success" py="3" mx={"3"}>
                    Tarefa removida com sucesso!
                  </Alert>
                ),
              });
              await fetchStorageTasks();
            } catch (error) {
              toast.show({
                placement: "top-right",
                render: () => (
                  <Alert bg="emerald.500" status="success" py="3" mx={"3"}>
                    Erro ao remover!
                  </Alert>
                ),
              });
            }
          },
        },
      ]
    );
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoading,
        isLoadingPhrase,
        motivationalPhrase,
        handleUpdateTaskStatusToDone,
        fetchStorageTasks,
        saveTasksOnStorage,
        deleteTaskById,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
