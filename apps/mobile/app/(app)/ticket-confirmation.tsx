import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Card, Screen } from "@/components/ui";

export default function TicketConfirmationScreen() {
  const { ticketNumber } = useLocalSearchParams<{ ticketNumber: string }>();

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-verified-bg">
          <Text className="text-2xl">✓</Text>
        </View>
        <Text className="text-xl font-bold text-ink">Ticket raised</Text>
        <Text className="mt-1 text-center text-sm text-ink/60">
          Our team will review this and update the status. Keep this number for reference:
        </Text>

        <Card className="mt-6 items-center px-8 py-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-ink/40">Ticket number</Text>
          <Text className="mt-1 text-2xl font-bold tracking-wide text-accent">{ticketNumber}</Text>
        </Card>

        <View className="mt-8 w-full gap-3">
          <Button title="Track this ticket" onPress={() => router.replace({ pathname: "/(app)/ticket-lookup", params: { ticketNumber } })} />
          <Button title="Back to home" variant="secondary" onPress={() => router.replace("/(app)/home")} />
        </View>
      </View>
    </Screen>
  );
}
