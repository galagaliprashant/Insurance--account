import { useState } from "react";
import { Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { submitPan, runDiscovery, ApiError } from "@/lib/api";
import { Button, Card, ErrorBanner, Field, Screen, ScreenTitle } from "@/components/ui";

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function KycPanScreen() {
  const { caseId, deceasedName } = useLocalSearchParams<{ caseId: string; deceasedName?: string }>();
  const [pan, setPan] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await submitPan(caseId, pan.toUpperCase());
      const run = await runDiscovery(caseId);
      router.push({ pathname: "/(app)/discovery", params: { caseId, deceasedName, discoveryId: run.discoveryId } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not verify this PAN. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenTitle title="Your PAN details" subtitle="The last identity check before we search for protection." />
      <ErrorBanner message={error} />

      <Field
        label="Your PAN"
        placeholder="ABCDE1234F"
        autoCapitalize="characters"
        maxLength={10}
        value={pan}
        onChangeText={setPan}
      />

      <Card className="mb-6">
        <Text className="text-xs leading-5 text-ink/60">
          DEMO MODE — format-checked only, not verified against NSDL/Protean.
        </Text>
      </Card>

      <Button title="Find protection" onPress={onSubmit} loading={loading} disabled={!PAN_RE.test(pan.toUpperCase())} />
    </Screen>
  );
}
