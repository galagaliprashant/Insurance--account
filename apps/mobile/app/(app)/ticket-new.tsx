import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { raiseTicket, ApiError } from "@/lib/api";
import { ProtectionType } from "@protection-passport/domain";
import { Button, ErrorBanner, Screen, ScreenTitle } from "@/components/ui";

function typeLabel(type: string): string {
  return type.replace(/_/g, " ").replace(/\w\S*/g, (w) => w[0] + w.slice(1).toLowerCase());
}

export default function TicketNewScreen() {
  const { caseId, deceasedName, missingItemType } = useLocalSearchParams<{
    caseId: string;
    deceasedName?: string;
    missingItemType: ProtectionType | "OTHER";
  }>();
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await raiseTicket({ caseId, missingItemType, description: description.trim() });
      router.replace({ pathname: "/(app)/ticket-confirmation", params: { ticketNumber: res.ticketNumber } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not raise this ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenTitle
        title={`Raise a ticket — ${typeLabel(missingItemType)}`}
        subtitle={`We couldn't confirm ${typeLabel(missingItemType).toLowerCase()} protection for ${deceasedName ?? "this case"}. Tell our team anything that might help.`}
      />
      <ErrorBanner message={error} />

      <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink/50">
        What do you already know? (optional but helpful)
      </Text>
      <TextInput
        className="mb-6 h-32 rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-ink"
        placeholder="e.g. a LIC agent's name, a bank branch, an employer, an old policy document…"
        placeholderTextColor="#9aa39d"
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Raise ticket" onPress={onSubmit} loading={loading} />

      <View className="mt-4">
        <Button title="Skip for now" variant="secondary" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
