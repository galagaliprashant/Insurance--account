import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useSession } from "@/lib/session";
import { Card, Screen } from "@/components/ui";

export default function HomeScreen() {
  const { user } = useSession();

  return (
    <Screen>
      <View className="mb-6 rounded-2xl bg-accent p-5">
        <Text className="text-xs font-medium uppercase tracking-wide text-white/70">Welcome back</Text>
        <Text className="mt-1 text-xl font-bold text-white">{user?.name}</Text>
        <Text className="mt-2 text-sm leading-5 text-white/90">
          If something has happened to a loved one, we'll help you find out what financial protection they
          had — and raise a ticket for anything we can't confirm.
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/(app)/deceased-details")}
        className="mb-4 rounded-2xl border-2 border-dashed border-accent/40 bg-accent-soft p-5"
      >
        <Text className="text-base font-bold text-ink">Start a claim for a loved one</Text>
        <Text className="mt-1 text-sm text-ink/60">
          Record who passed away, verify your identity, and we'll search for their insurance and bank
          protection.
        </Text>
        <Text className="mt-3 text-sm font-semibold text-accent">Get started →</Text>
      </Pressable>

      <Card className="mb-4">
        <Text className="text-sm font-semibold text-ink">Already raised a ticket?</Text>
        <Text className="mt-1 text-xs text-ink/60">Look up its status using your ticket number.</Text>
        <Pressable onPress={() => router.push("/(app)/ticket-lookup")} className="mt-3">
          <Text className="text-sm font-semibold text-accent">Track a ticket →</Text>
        </Pressable>
      </Card>

      <Pressable onPress={() => router.push("/(app)/profile")} className="mt-auto items-center py-3">
        <Text className="text-sm font-medium text-ink/50">Profile &amp; settings</Text>
      </Pressable>
    </Screen>
  );
}
