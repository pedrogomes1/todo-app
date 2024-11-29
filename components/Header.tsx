import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import { Avatar } from "./Avatar";

export function Header() {
  return (
    <View style={styles.container}>
      <Avatar />
      <View style={styles.identification}>
        <Text fontSize="md">Bem vindo,</Text>
        <Text fontSize="lg" bold>
          Usuário(a) 👋
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  identification: {
    flexDirection: "column",
    gap: 5,
  },
});
