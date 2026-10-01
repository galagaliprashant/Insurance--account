import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/lib/session";

export default function Index() {
  const { isLoading, user } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-paper">
        <ActivityIndicator color="#1f6f5c" />
      </View>
    );
  }

  return <Redirect href={user ? "/(app)/home" : "/(auth)/login"} />;
}
