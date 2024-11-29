import { Priority, TaskStatus, type ITask } from "@/types/task";
import RNDateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  Badge,
  Box,
  Button,
  FormControl,
  Input,
  Skeleton,
  Spinner,
  Text,
  TextArea,
} from "native-base";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { genAI } from "@/utils/genai";

interface IFormAddTodo {
  onSubmit: (data: ITask) => Promise<void>;
  isSubmitting: boolean;
}

export function FormAddTodo({ isSubmitting, onSubmit }: IFormAddTodo) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVisibleDatePickerOnAndroid, setIsVisibleDatePickerOnAndroid] =
    useState(false);
  const [isVisibleHourPickerOnAndroid, setIsVisibleHourPickerOnAndroid] =
    useState(false);
  const [timeEstimatedSuggestion, setTimeEstimatedSuggestion] = useState("");
  const [datetime, setDatetime] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | "">("");

  const submitIsDisabled =
    !title || !description || !datetime || !selectedPriority || isLoading;

  const handleSubmit = async () => {
    const dataSubmit: ITask = {
      id: Math.random().toString(36).substring(2, 10),
      title,
      description,
      datetime,
      status: TaskStatus.PENDING,
      priority: selectedPriority || Priority.LOW,
    };

    await onSubmit(dataSubmit);
  };

  async function completion() {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
      });
      const description = await model.generateContent(
        `Com base no título da tarefa: ${title}, crie uma descrição simples e objetiva para a ação que será realizada. A descrição deve ser clara, sem usar o título diretamente, e destacar os benefícios ou a atividade principal, de forma amigável e encorajadora. Exemplo: Título jogar futebol. Resposta: Organizar um jogo de futebol com amigos ou participar de uma partida para se divertir e praticar exercícios. A resposta deve estar em 1º pessoa do singular (eu)`
      );
      const taskDescription = description.response.text();

      const time = await model.generateContent(
        `Com base na descrição da tarefa: ${String(
          taskDescription
        )}, me retorne uma estimativa de tempo coerente, com a resposta seguindo nesse formato, mas ajustando o tempo correto: Estimativa de duração da tarefa: 2 horas. Caso o tempo for com vírgulas, formate seguindo o exemplo: 2h30`
      );

      const estimatedTime = time.response.text();
      setTimeEstimatedSuggestion(String(estimatedTime));
      setDescription(String(taskDescription));
    } catch (error) {
      console.log("Something Went Wrong", error);
    } finally {
      setIsLoading(false);
    }
  }

  const onAndroidDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed" || event.type === "set") {
      setIsVisibleDatePickerOnAndroid(false);
    }

    if (date) {
      const updatedDateTime = new Date(datetime);
      updatedDateTime.setFullYear(date.getFullYear());
      updatedDateTime.setMonth(date.getMonth());
      updatedDateTime.setDate(date.getDate());
      setDatetime(updatedDateTime);
    }
  };

  const onAndroidHourChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed" || event.type === "set") {
      setIsVisibleHourPickerOnAndroid(false);
    }

    if (date) {
      const updatedDateTime = new Date(datetime);
      updatedDateTime.setHours(date.getHours());
      updatedDateTime.setMinutes(date.getMinutes());
      setDatetime(updatedDateTime);
    }
  };

  return (
    <FormControl>
      <FormControl.Label>Título</FormControl.Label>
      <Input
        color="#FFF"
        autoCapitalize="none"
        onChangeText={setTitle}
        backgroundColor="transparent"
        focusOutlineColor={"#C5C5C5"}
        variant={"outline"}
        height={"12"}
        fontSize="sm"
        mb="4"
      />

      <FormControl.Label>Descrição</FormControl.Label>

      <View style={styles.containerInputArea}>
        <TextArea
          onChangeText={setDescription}
          autoCompleteType={false}
          color="#FFF"
          autoCapitalize="none"
          focusOutlineColor={"#C5C5C5"}
          backgroundColor="transparent"
          fontSize="sm"
          h={"32"}
          mb="4"
          value={description}
          isDisabled={isLoading}
        />
        <TouchableOpacity
          onPress={completion}
          style={styles.buttonGenerateText}
          disabled={isLoading || !title}
        >
          <MaterialCommunityIcons
            name="robot-excited-outline"
            size={16}
            color="#1A66FF"
          />
          <Text fontSize="sm" style={styles.generateText}>
            Clique para gerar
          </Text>
        </TouchableOpacity>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Spinner color="indigo.500" />
          </View>
        )}
      </View>
      <FormControl.Label mb="2">Selecione a prioridade</FormControl.Label>
      <Box flexDirection="row" justifyContent="space-between" mb="2">
        <Button
          onPress={() => setSelectedPriority(Priority.LOW)}
          width={"24"}
          variant={selectedPriority === Priority.LOW ? "solid" : "outline"}
          backgroundColor={
            selectedPriority === Priority.LOW ? "#1A66FF" : "transparent"
          }
        >
          <Text fontWeight={"semibold"} color="#FFF">
            Baixa
          </Text>
        </Button>
        <Button
          onPress={() => setSelectedPriority(Priority.MEDIUM)}
          width={"24"}
          variant={selectedPriority === Priority.MEDIUM ? "" : "outline"}
          backgroundColor={
            selectedPriority === Priority.MEDIUM ? "#1A66FF" : "transparent"
          }
        >
          <Text fontWeight={"semibold"} color="#FFF">
            Média
          </Text>
        </Button>
        <Button
          onPress={() => setSelectedPriority(Priority.HIGH)}
          width={"24"}
          variant={selectedPriority === Priority.HIGH ? "" : "outline"}
          backgroundColor={
            selectedPriority === Priority.HIGH ? "#1A66FF" : "transparent"
          }
        >
          <Text fontWeight={"semibold"} color="#FFF">
            Alta
          </Text>
        </Button>
      </Box>

      <FormControl.Label>Data e Horário</FormControl.Label>
      {Platform.OS === "ios" ? (
        <RNDateTimePicker
          style={styles.dateTimePicker}
          mode="datetime"
          textColor="white"
          value={datetime}
          display={"spinner"}
          onChange={(_, selectedDate) => setDatetime(selectedDate as Date)}
        />
      ) : (
        <>
          <Button
            width={"40"}
            marginX={"auto"}
            marginY={"3"}
            backgroundColor={"blue.500"}
            onPress={() => setIsVisibleDatePickerOnAndroid(true)}
          >
            Selecionar data
          </Button>
          <Button
            width={"40"}
            marginX={"auto"}
            marginY={"3"}
            backgroundColor={"blue.500"}
            onPress={() => setIsVisibleHourPickerOnAndroid(true)}
          >
            Selecionar horário
          </Button>
          {isVisibleDatePickerOnAndroid && (
            <RNDateTimePicker
              style={styles.dateTimePicker}
              mode="date"
              textColor="white"
              value={datetime}
              display={"default"}
              onChange={onAndroidDateChange}
            />
          )}
          {isVisibleHourPickerOnAndroid && (
            <RNDateTimePicker
              style={styles.dateTimePicker}
              mode="time"
              textColor="white"
              value={datetime}
              display={"default"}
              onChange={onAndroidHourChange}
            />
          )}
        </>
      )}

      {isLoading ? (
        <Skeleton h="3" mt="3" width="64" rounded="full" />
      ) : timeEstimatedSuggestion ? (
        <Badge
          colorScheme="info"
          mt="3"
          marginRight={"auto"}
          variant={"outline"}
        >
          {timeEstimatedSuggestion}
        </Badge>
      ) : null}

      <Button
        onPress={handleSubmit}
        isLoadingText="Cadastrando..."
        isLoading={isSubmitting}
        isDisabled={submitIsDisabled}
        backgroundColor={"#1A66FF"}
        marginTop="10"
      >
        <Text fontSize="md">Cadastrar</Text>
      </Button>
    </FormControl>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  dateTimePicker: {
    borderRadius: 10,
    borderColor: "#C5C5C5",
    borderWidth: 1,
  },
  containerInputArea: {
    position: "relative",
  },
  buttonGenerateText: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    bottom: 20,
    right: 10,
  },
  generateText: {
    color: "#1A66FF",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
