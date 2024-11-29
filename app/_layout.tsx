import * as SplashScreen from "expo-splash-screen";
import { NativeBaseProvider, extendTheme } from "native-base";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { useEffect } from "react";
import TasksContextProvider from "@/context/tasks";

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = extendTheme({
    components: {
      Text: {
        baseStyle: {
          color: "#FFF",
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <TasksContextProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="addTodo"
            options={{
              headerTitle: "",
              title: "",
              headerBackTitleVisible: false,
              headerTransparent: true,
            }}
          />
        </Stack>
      </TasksContextProvider>
    </NativeBaseProvider>
  );
}
