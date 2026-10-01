import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getDiscovery, ApiError } from "@/lib/api";
import { DiscoveryResult, ProtectionItem } from "@protection-passport/domain";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button, Card, ErrorBanner, Screen, ScreenTitle } from "@/components/ui";

function formatInr(amount: number): string {
  if (amount <= 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function typeLabel(type: string): string {
  return type.replace(/_/g, " ").replace(/\w\S*/g, (w) => w[0] + w.slice(1).toLowerCase());
}

function ProtectionRow({ item }: { item: ProtectionItem }) {
  return (
    <Card className="mb-3">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className="text-[10px] font-semibold uppercase tracking-wide text-ink/40">{typeLabel(item.type)}</Text>
          <Text className="mt-0.5 text-sm font-bold text-ink">{item.productName}</Text>
          <Text className="text-xs text-ink/60">{item.provider}</Text>
        </View>
        <VerificationBadge state={item.verification.state} />
      </View>
      <Text className="mt-2 text-lg font-bold text-ink">{formatInr(item.coverage.amountInr)}</Text>
    </Card>
  );
}

export default function DiscoveryScreen() {
  const { caseId, deceasedName, discoveryId } = useLocalSearchParams<{
    caseId: string;
    deceasedName?: string;
    discoveryId: string;
  }>();
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDiscovery(discoveryId)
      .then(setResult)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load discovery results."));
  }, [discoveryId]);

  if (error) {
    return (
      <Screen>
        <ErrorBanner message={error} />
      </Screen>
    );
  }

  if (!result) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#1f6f5c" />
          <Text className="mt-3 text-sm text-ink/60">Searching known sources for {deceasedName}…</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
      <ScreenTitle
        title={`What we found for ${deceasedName ?? "this case"}`}
        subtitle="Evidence-backed only — a weak signal is never shown as confirmed coverage."
      />

      {result.matched.length > 0 && (
        <FlatList
          data={result.matched}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProtectionRow item={item} />}
          scrollEnabled={false}
        />
      )}
      {result.matched.length === 0 && (
        <Card className="mb-4">
          <Text className="text-sm text-ink/60">No protection records matched this name yet.</Text>
        </Card>
      )}

      {result.missingTypes.length > 0 && (
        <View className="mt-2">
          <Text className="mb-2 text-sm font-bold text-ink">Nothing conclusive found for:</Text>
          {result.missingTypes.map((type) => (
            <Card key={type} className="mb-3 border-needs/30 bg-needs-bg">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-needs">{typeLabel(type)}</Text>
                <Button
                  title="Raise a ticket"
                  variant="secondary"
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/ticket-new",
                      params: { caseId, deceasedName, missingItemType: type },
                    })
                  }
                />
              </View>
            </Card>
          ))}
        </View>
      )}

      {result.missingTypes.length === 0 && (
        <Card className="mt-2 bg-verified-bg">
          <Text className="text-sm text-verified">
            We have some finding for every protection category we checked. Open each item above for evidence
            and claim details.
          </Text>
        </Card>
      )}
      </ScrollView>
    </Screen>
  );
}
