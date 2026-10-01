import { useState } from "react";
import { Text, View } from "react-native";
import { Link, router } from "expo-router";
import { useSession } from "@/lib/session";
import { ApiError } from "@/lib/api";
import { Button, ErrorBanner, Field, Screen, ScreenTitle } from "@/components/ui";

export default function SignupScreen() {
  const { signUp } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await signUp(name.trim(), phone.trim(), password);
      router.replace("/(app)/home");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenTitle title="Create your account" subtitle="You'll use this to sign in and track claims for your family." />
      <ErrorBanner message={error} />

      <Field label="Full name" placeholder="Priya Mehta" value={name} onChangeText={setName} />
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
        placeholder="At least 8 characters"
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Create account"
        onPress={onSubmit}
        loading={loading}
        disabled={!name || !phone || password.length < 8}
      />

      <View className="mt-6 flex-row justify-center gap-1">
        <Text className="text-sm text-ink/60">Already have an account?</Text>
        <Link href="/(auth)/login" className="text-sm font-semibold text-accent">
          Log in
        </Link>
      </View>
    </Screen>
  );
}
