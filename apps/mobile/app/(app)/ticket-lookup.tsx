import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getTicket, ApiError } from "@/lib/api";
import { Ticket } from "@protection-passport/domain";
import { Button, Card, ErrorBanner, Field, Screen, ScreenTitle } from "@/components/ui";

const STATUS_LABEL: Record<Ticket["status"], string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export default function TicketLookupScreen() {
  const params = useLocalSearchParams<{ ticketNumber?: string }>();
  const [ticketNumber, setTicketNumber] = useState(params.ticketNumber ?? "");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(number: string) {
    setError(null);
    setTicket(null);
    setLoading(true);
    try {
      setTicket(await getTicket(number.trim().toUpperCase()));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not find this ticket.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.ticketNumber) lookup(params.ticketNumber);
  }, [params.ticketNumber]);

  return (
    <Screen>
      <ScreenTitle title="Track a ticket" subtitle="Enter the ticket number you received for reference." />
      <ErrorBanner message={error} />

      <Field
        label="Ticket number"
        placeholder="PP-2026-000123"
        autoCapitalize="characters"
        value={ticketNumber}
        onChangeText={setTicketNumber}
      />
      <Button title="Look up" onPress={() => lookup(ticketNumber)} loading={loading} disabled={!ticketNumber} />

      {ticket && (
        <Card className="mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-ink">{ticket.ticketNumber}</Text>
            <Text className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              {STATUS_LABEL[ticket.status]}
            </Text>
          </View>
          <Text className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
            {ticket.missingItemType.replace(/_/g, " ")}
          </Text>
          {ticket.description ? <Text className="mt-1 text-sm text-ink/70">{ticket.description}</Text> : null}
          <Text className="mt-3 text-xs text-ink/40">
            Raised {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </Text>
        </Card>
      )}
    </Screen>
  );
}
