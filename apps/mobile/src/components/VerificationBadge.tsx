import { View, Text } from "react-native";
import { VerificationState, VERIFICATION_META } from "@protection-passport/domain";

const TONE_CLASSES: Record<string, { bg: string; text: string; dot: string }> = {
  verified: { bg: "bg-verified-bg", text: "text-verified", dot: "bg-verified" },
  userconfirmed: { bg: "bg-confirmed-bg", text: "text-confirmed", dot: "bg-confirmed" },
  needsverification: { bg: "bg-needs-bg", text: "text-needs", dot: "bg-needs" },
  unknown: { bg: "bg-unknown-bg", text: "text-unknown", dot: "bg-unknown" },
  notdetected: { bg: "bg-notdetected-bg", text: "text-notdetected", dot: "bg-notdetected" },
};

export function VerificationBadge({ state }: { state: VerificationState }) {
  const meta = VERIFICATION_META[state];
  const tone = TONE_CLASSES[meta.tone];
  return (
    <View className={`flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-1 ${tone.bg}`}>
      <View className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      <Text className={`text-xs font-semibold ${tone.text}`}>{meta.label}</Text>
    </View>
  );
}
