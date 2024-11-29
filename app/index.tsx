import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Badge, Skeleton, Text } from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { Link } from "expo-router";

import { Header } from "@/components/Header";
import StatusTaskList from "@/components/StatusTaskList";
import { useContext } from "react";
import { TasksContext } from "@/context/tasks";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { tasks, motivationalPhrase, isLoadingPhrase } =
    useContext(TasksContext);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar style="light" />
      <Header />

      {isLoadingPhrase ? (
        <Skeleton.Text lines={2} mt={"12"} />
      ) : (
        <>
          <Text
            fontSize="md"
            alignContent={"center"}
            mt="12"
            mb="2"
            fontWeight={"semibold"}
          >
            Hora de brilhar! 🫵
          </Text>
          <Badge
            variant={"outline"}
            colorScheme="info"
            rounded="md"
            p={"1.5"}
            _text={{ fontSize: "sm" }}
          >
            {motivationalPhrase}
          </Badge>
        </>
      )}

      <View style={styles.addTask}>
        <Text fontSize="2xl" bold>
          Suas tarefas
        </Text>

        <Link href="/addTodo" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text fontSize="md">Nova Tarefa</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Text
        fontSize="sm"
        style={{ marginLeft: "auto" }}
        marginTop="4"
        marginBottom="2"
      >
        Total de {tasks?.length ?? 0} tarefa(s)
      </Text>
      <StatusTaskList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  addTask: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A66FF",
    gap: 5,
    padding: 6,
    borderRadius: 5,
  },
});
