import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { createCase, ApiError } from "@/lib/api";
import { Button, Card, ErrorBanner, Field, Screen, ScreenTitle } from "@/components/ui";

const RELATIONSHIPS = [
  { value: "SPOUSE", label: "Spouse" },
  { value: "CHILD", label: "Child" },
  { value: "PARENT", label: "Parent" },
  { value: "SIBLING", label: "Sibling" },
  { value: "OTHER", label: "Other" },
] as const;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function DeceasedDetailsScreen() {
  const [deceasedName, setDeceasedName] = useState("");
  const [deceasedDob, setDeceasedDob] = useState("");
  const [dateOfDemise, setDateOfDemise] = useState("");
  const [relationship, setRelationship] = useState<(typeof RELATIONSHIPS)[number]["value"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    deceasedName.trim().length > 0 && DATE_RE.test(deceasedDob) && DATE_RE.test(dateOfDemise) && relationship;

  async function onSubmit() {
    if (!relationship) return;
    setError(null);
    setLoading(true);
    try {
      const res = await createCase({
        deceasedName: deceasedName.trim(),
        deceasedDob,
        dateOfDemise,
        relationshipToClaimant: relationship,
      });
      router.push({ pathname: "/(app)/kyc-aadhaar", params: { caseId: res.caseId, deceasedName } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not save these details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenTitle
          title="Tell us who we're helping"
          subtitle="This starts a private case. Next you'll verify your own identity before we search for protection."
        />
        <ErrorBanner message={error} />

        <Field label="Full name of the deceased" placeholder="Rajesh Mehta" value={deceasedName} onChangeText={setDeceasedName} />
        <Field
          label="Date of birth"
          placeholder="YYYY-MM-DD"
          value={deceasedDob}
          onChangeText={setDeceasedDob}
          keyboardType="numbers-and-punctuation"
        />
        <Field
          label="Date of demise"
          placeholder="YYYY-MM-DD"
          value={dateOfDemise}
          onChangeText={setDateOfDemise}
          keyboardType="numbers-and-punctuation"
        />

        <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink/50">
          Their relationship to you
        </Text>
        <View className="mb-6 flex-row flex-wrap gap-2">
          {RELATIONSHIPS.map((r) => {
            const active = relationship === r.value;
            return (
              <Pressable
                key={r.value}
                onPress={() => setRelationship(r.value)}
                className={`rounded-full border px-4 py-2 ${active ? "border-accent bg-accent" : "border-black/10 bg-white"}`}
              >
                <Text className={`text-sm font-medium ${active ? "text-white" : "text-ink/70"}`}>{r.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Card className="mb-6 bg-accent-soft">
          <Text className="text-xs leading-5 text-ink/70">
            We'll never ask for bank passwords, PINs, CVVs or OTPs on their behalf. The next step verifies{" "}
            <Text className="font-semibold">your own</Text> identity, since the OTP has to go to your phone.
          </Text>
        </Card>

        <Button title="Continue" onPress={onSubmit} loading={loading} disabled={!canSubmit} />
      </ScrollView>
    </Screen>
  );
}
