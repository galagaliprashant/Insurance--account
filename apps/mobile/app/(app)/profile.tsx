import { Text, View } from "react-native";
import { router } from "expo-router";
import { useSession } from "@/lib/session";
import { Button, Card, Screen, ScreenTitle } from "@/components/ui";

export default function ProfileScreen() {
  const { user, signOut } = useSession();

  async function onLogout() {
    await signOut();
    router.replace("/(auth)/login");
  }

  return (
    <Screen>
      <ScreenTitle title="Profile" />
      <Card className="mb-6">
        <Text className="text-xs font-semibold uppercase tracking-wide text-ink/40">Name</Text>
        <Text className="mb-3 mt-0.5 text-base text-ink">{user?.name}</Text>
        <Text className="text-xs font-semibold uppercase tracking-wide text-ink/40">Mobile number</Text>
        <Text className="mt-0.5 text-base text-ink">{user?.phone}</Text>
      </Card>

      <View className="mb-6 rounded-2xl bg-accent-soft p-4">
        <Text className="text-xs leading-5 text-ink/70">
          This is a demo build. Identity checks and protection discovery use simulated data — see the app's
          README for what a production version would need (licensed Aadhaar/PAN verification and Account
          Aggregator integration).
        </Text>
      </View>

      <Button title="Log out" variant="secondary" onPress={onLogout} />
    </Screen>
  );
}
