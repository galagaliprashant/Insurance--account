import { useState } from "react";
import { Text, View } from "react-native";
import { Link, router } from "expo-router";
import { useSession } from "@/lib/session";
import { ApiError } from "@/lib/api";
import { Button, ErrorBanner, Field, Screen, ScreenTitle } from "@/components/ui";

export default function LoginScreen() {
  const { signIn } = useSession();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await signIn(phone.trim(), password);
      router.replace("/(app)/home");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="mt-10 mb-8 items-center">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-accent">
          <Text className="text-xl font-bold text-white">PP</Text>
        </View>
        <Text className="mt-3 text-xl font-bold text-ink">Protection Passport</Text>
        <Text className="text-sm text-ink/60">Claim assist for your family</Text>
      </View>

      <ScreenTitle title="Log in" subtitle="Use the phone number you signed up with." />
      <ErrorBanner message={error} />

      <Field
        label="Mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="98765 43210"
        value={phone}
        onChangeText={setPhone}
      />
      <Field
        label="Password"
        secureTextEntry
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Log in" onPress={onSubmit} loading={loading} disabled={!phone || !password} />

      <View className="mt-6 flex-row justify-center gap-1">
        <Text className="text-sm text-ink/60">New here?</Text>
        <Link href="/(auth)/signup" className="text-sm font-semibold text-accent">
          Create an account
        </Link>
      </View>
    </Screen>
  );
}
