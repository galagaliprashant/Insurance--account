import { useState } from "react";
import { Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { verifyAadhaarOtp, ApiError } from "@/lib/api";
import { Button, Card, DemoBanner, ErrorBanner, Field, Screen, ScreenTitle } from "@/components/ui";

export default function KycOtpScreen() {
  const { caseId, deceasedName, maskedAadhaar, demoOtp } = useLocalSearchParams<{
    caseId: string;
    deceasedName?: string;
    maskedAadhaar: string;
    demoOtp: string;
  }>();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await verifyAadhaarOtp(caseId, otp);
      router.push({ pathname: "/(app)/kyc-pan", params: { caseId, deceasedName } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Incorrect OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenTitle title="Enter the OTP" subtitle={`Sent to the mobile number linked to Aadhaar ${maskedAadhaar}.`} />
      <ErrorBanner message={error} />

      <DemoBanner text={`DEMO MODE — no SMS was actually sent. Your OTP is ${demoOtp}.`} />

      <Field
        label="6-digit OTP"
        placeholder="000000"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <Card className="mb-6">
        <Text className="text-xs leading-5 text-ink/60">
          In production this OTP is generated and delivered by a licensed Aadhaar eKYC provider (AUA/KUA),
          never by our own servers.
        </Text>
      </Card>

      <Button title="Verify" onPress={onSubmit} loading={loading} disabled={otp.length !== 6} />
    </Screen>
  );
}
