import { Text, Alert, useToast } from "native-base";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { type ITask } from "@/types/task";
import { FormAddTodo } from "@/components/forms/addTodo";
import { router } from "expo-router";
import { TasksContext } from "@/context/tasks";

export default function AddTodo() {
  const insets = useSafeAreaInsets();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { fetchStorageTasks, saveTasksOnStorage } = useContext(TasksContext);

  const handleSubmit = async (dataSubmit: ITask) => {
    try {
      setIsSubmitting(true);
      await saveTasksOnStorage(dataSubmit);
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
            Tarefa criada com sucesso!
          </Alert>
        ),
      });
      return router.navigate("/");
    } catch (e) {
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
            Erro ao criar tarefa!
          </Alert>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView>
        <View>
          <Text bold fontSize="xl" mb="4" mt="10">
            Adicionar nova tarefa
          </Text>

          <FormAddTodo onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
});
