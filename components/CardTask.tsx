import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Badge, Text } from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useContext, useState } from "react";
import dayjs from "dayjs";
import Checkbox from "expo-checkbox";

import { Priority, TaskStatus, type ITask } from "@/types/task";
import { TasksContext } from "@/context/tasks";

export function CardTask({ card }: { card: ITask }) {
  const [isChecked] = useState(false);

  const { handleUpdateTaskStatusToDone, deleteTaskById } =
    useContext(TasksContext);

  const isPending = card.status === TaskStatus.PENDING;
  const isDone = card.status === TaskStatus.DONE;

  const getFormatPriorityName = () => {
    const name = {
      [Priority.LOW]: "BAIXA",
      [Priority.MEDIUM]: "MÉDIA",
      [Priority.HIGH]: "ALTA",
    };

    return name[card.priority];
  };

  const getPriorityColor = () => {
    const color = {
      [Priority.LOW]: "green",
      [Priority.MEDIUM]: "yellow",
      [Priority.HIGH]: "red",
    };

    return color[card.priority];
  };
  return (
    <View style={[styles.container, isDone ? styles.opacityContainer : []]}>
      <View style={styles.info}>
        <Text style={[styles.title, isDone ? styles.isDoneTitleStyle : []]}>
          {card.title}
        </Text>
        {isPending ? (
          <Checkbox
            color={isChecked ? "#00A800" : undefined}
            value={isChecked}
            style={{ borderRadius: 4 }}
            onValueChange={() => handleUpdateTaskStatusToDone(card.id)}
          />
        ) : (
          <Ionicons name="checkmark-circle" size={24} color="#5ce65c" />
        )}
      </View>
      <View style={styles.containerDescription}>
        {isPending && (
          <Text numberOfLines={2} w={"80%"} style={styles.description}>
            {card.description}
          </Text>
        )}
        <Badge colorScheme={getPriorityColor()} rounded="md" variant="outline">
          {getFormatPriorityName()}
        </Badge>
      </View>
      <View style={styles.separator} />

      <View style={styles.info}>
        <Text style={styles.time}>
          {dayjs(card.datetime).format("DD/MM/YYYY")} •{" "}
          {`${dayjs(card.datetime).format("HH")}h${dayjs(card.datetime).format(
            "mm"
          )}`}
        </Text>

        <TouchableOpacity onPress={() => deleteTaskById(card.id)}>
          <Feather name="trash-2" size={20} color="#C70000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderColor: "#252525",
    borderWidth: 2,
    borderRadius: 5,
    marginTop: 20,
  },
  containerDescription: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    justifyContent: "space-between",
  },
  opacityContainer: {
    opacity: 0.5,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    flex: 1,
    borderWidth: 0.4,
    marginTop: 15,
    borderColor: "#DFDDDD",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  isDoneTitleStyle: {
    textDecorationLine: "line-through",
  },
  description: {
    maxWidth: "100%",
    flexWrap: "wrap",
  },
  time: {
    fontSize: 12,
  },
});
