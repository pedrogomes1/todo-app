import { Box, Text } from "native-base";
import {
  TouchableOpacity,
  View,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import Animated from "react-native-reanimated";
import { TabView } from "react-native-tab-view";
import { useContext, useState } from "react";
import { TaskStatus } from "@/types/task";
import type { IRoute } from "@/types/route";
import { PendingTasks } from "./PendingTasks";
import { DoneTasks } from "./DoneTasks";
import { TasksContext } from "@/context/tasks";
import { SkeletonLoading } from "./Skeleton";

const routes = [
  { key: TaskStatus.PENDING, title: "Pendentes" },
  { key: TaskStatus.DONE, title: "Finalizado" },
];

export default function TabViewExample() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const { tasks, isLoading } = useContext(TasksContext);

  const renderTabBar = (_: { navigationState: { routes: IRoute[] } }) => {
    const totalPending =
      tasks?.filter(({ status }) => status === TaskStatus.PENDING).length || 0;

    const totalDone =
      tasks?.filter(({ status }) => status === TaskStatus.DONE).length || 0;

    return (
      <Box flexDirection="row">
        {routes.map(({ key, title }: IRoute, i: number) => {
          const color = index === i ? "#e5e5e5" : "#a1a1aa";
          const borderColor = index === i ? "cyan.500" : "coolGray.200";
          return (
            <Box
              borderBottomWidth="3"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="4"
              key={i}
            >
              <TouchableOpacity
                style={styles.tabButton}
                activeOpacity={0.7}
                onPress={() => setIndex(i)}
              >
                <Animated.Text style={{ color }}>{title}</Animated.Text>

                <View style={styles.containerTab}>
                  <Text fontSize="xs" color="black">
                    {key === TaskStatus.DONE ? totalDone : totalPending}
                  </Text>
                </View>
              </TouchableOpacity>
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderScene = ({ route }: { route: IRoute }) => {
    switch (route.key) {
      case TaskStatus.PENDING:
        return isLoading ? <SkeletonLoading /> : <PendingTasks tasks={tasks} />;
      case TaskStatus.DONE:
        return isLoading ? <SkeletonLoading /> : <DoneTasks tasks={tasks} />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

const styles = StyleSheet.create({
  containerTab: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e5e5e5",
    alignItems: "center",
    justifyContent: "center",
  },
  tabButton: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
