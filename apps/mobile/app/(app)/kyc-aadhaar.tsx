import { useState } from "react";
import { Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { submitAadhaar, ApiError } from "@/lib/api";
import { Button, Card, ErrorBanner, Field, Screen, ScreenTitle } from "@/components/ui";

export default function KycAadhaarScreen() {
  const { caseId, deceasedName } = useLocalSearchParams<{ caseId: string; deceasedName?: string }>();
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await submitAadhaar(caseId, aadhaar.replace(/\s+/g, ""));
      router.push({
        pathname: "/(app)/kyc-otp",
        params: { caseId, deceasedName, maskedAadhaar: res.maskedAadhaar, demoOtp: res.demoOtp },
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not verify this Aadhaar number. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenTitle
        title="Verify your identity"
        subtitle={`This confirms it's really you helping with ${deceasedName ?? "this"}'s case — not the deceased.`}
      />
      <ErrorBanner message={error} />

      <Field
        label="Your Aadhaar number"
        placeholder="XXXX XXXX XXXX"
        keyboardType="number-pad"
        maxLength={14}
        value={aadhaar}
        onChangeText={setAadhaar}
      />

      <Card className="mb-6">
        <Text className="text-xs leading-5 text-ink/60">
          DEMO MODE — this build format-checks your Aadhaar number only. No request is sent to UIDAI. A
          production app would use a licensed eKYC provider for this step.
        </Text>
      </Card>

      <Button title="Send OTP" onPress={onSubmit} loading={loading} disabled={aadhaar.replace(/\s+/g, "").length !== 12} />
    </Screen>
  );
}
