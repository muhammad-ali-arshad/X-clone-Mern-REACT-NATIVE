import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Stack } from "expo-router";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

export default function RootLayout() {
  return (
  <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache} >
      <Stack>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
      </Stack>
  </ClerkProvider>
  )
}
