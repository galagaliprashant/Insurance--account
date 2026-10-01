import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/lib/session";

export default function AppLayout() {
  const { isLoading, user } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-paper">
        <ActivityIndicator color="#1f6f5c" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: "#1f6f5c",
        headerTitleStyle: { color: "#142019", fontWeight: "600" },
        headerStyle: { backgroundColor: "#f5f6f3" },
        headerShadowVisible: false,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="home" options={{ title: "Protection Passport" }} />
      <Stack.Screen name="deceased-details" options={{ title: "Who are we helping?" }} />
      <Stack.Screen name="kyc-aadhaar" options={{ title: "Verify your identity" }} />
      <Stack.Screen name="kyc-otp" options={{ title: "Enter OTP" }} />
      <Stack.Screen name="kyc-pan" options={{ title: "PAN details" }} />
      <Stack.Screen name="discovery" options={{ title: "Protection found" }} />
      <Stack.Screen name="ticket-new" options={{ title: "Raise a ticket" }} />
      <Stack.Screen name="ticket-confirmation" options={{ title: "Ticket raised", headerBackVisible: false }} />
      <Stack.Screen name="ticket-lookup" options={{ title: "Track a ticket" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
    </Stack>
  );
}
