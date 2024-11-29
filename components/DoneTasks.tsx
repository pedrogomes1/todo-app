import { TaskStatus, type ITask } from "@/types/task";
import { FlatList, View, StyleSheet } from "react-native";
import { Text } from "native-base";
import { CardTask } from "./CardTask";

export function DoneTasks({ tasks }: { tasks: ITask[] }) {
  const doneTasks = tasks?.filter((task) => task.status === TaskStatus.DONE);
  return (
    <View style={styles.container}>
      {doneTasks?.length ? (
        <FlatList
          data={doneTasks}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CardTask card={item} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text mt="32" fontWeight={"semibold"} fontSize={"md"} marginX="auto">
          Nenhuma tarefa finalizada 😱
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
