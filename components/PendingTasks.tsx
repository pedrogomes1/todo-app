import { StyleSheet } from "react-native";
import { TaskStatus, type ITask } from "@/types/task";
import { FlatList, View } from "react-native";
import { CardTask } from "./CardTask";
import { Text } from "native-base";

export function PendingTasks({ tasks }: { tasks: ITask[] }) {
  const pendingTasks = tasks?.filter(
    (task) => task.status === TaskStatus.PENDING
  );

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const taksOrderedByPriority = pendingTasks?.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <View style={styles.container}>
      {taksOrderedByPriority?.length ? (
        <FlatList
          data={taksOrderedByPriority}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CardTask card={item} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text mt="32" fontWeight={"semibold"} fontSize={"md"} marginX="auto">
          Nenhuma tarefa pendente 😄
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
