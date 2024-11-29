import { Center, VStack, Skeleton } from "native-base";

export function SkeletonLoading() {
  return (
    <Center w="100%">
      <VStack w="90%" mt="4" space={4} overflow="hidden">
        <Skeleton speed={0.7} h="24" rounded="sm" />
        <Skeleton.Text lines={1} speed={0.7} rounded="full" />
      </VStack>
    </Center>
  );
}
