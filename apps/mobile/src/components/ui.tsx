import React from "react";
import { ActivityIndicator, Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top", "bottom"]}>
      <View className={`flex-1 px-5 py-4 ${className}`}>{children}</View>
    </SafeAreaView>
  );
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="mb-6">
      <Text className="text-2xl font-bold text-ink">{title}</Text>
      {subtitle ? <Text className="mt-1 text-sm text-ink/60">{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <View className={`rounded-2xl border border-black/5 bg-white p-4 shadow-sm ${className}`}>{children}</View>;
}

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Field({ label, error, ...props }: FieldProps) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</Text>
      <TextInput
        className={`rounded-xl border bg-white px-4 py-3 text-base text-ink ${
          error ? "border-needs" : "border-black/10"
        }`}
        placeholderTextColor="#9aa39d"
        {...props}
      />
      {error ? <Text className="mt-1 text-xs text-needs">{error}</Text> : null}
    </View>
  );
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({ title, onPress, loading, disabled, variant = "primary" }: ButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center rounded-xl px-4 py-3.5 ${
        isPrimary ? "bg-accent" : "border border-accent bg-transparent"
      } ${disabled || loading ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#ffffff" : "#1f6f5c"} />
      ) : (
        <Text className={`text-base font-semibold ${isPrimary ? "text-white" : "text-accent"}`}>{title}</Text>
      )}
    </Pressable>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View className="mb-4 rounded-xl bg-needs-bg px-4 py-3">
      <Text className="text-sm text-needs">{message}</Text>
    </View>
  );
}

export function DemoBanner({ text }: { text: string }) {
  return (
    <View className="mb-4 rounded-xl bg-accent-soft px-4 py-3">
      <Text className="text-xs font-medium text-accent">{text}</Text>
    </View>
  );
}
