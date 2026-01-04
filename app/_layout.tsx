import { Stack } from "expo-router";
import "./globals.css";


export default function RootLayout() {
  return (
      <Stack>
        {/* Login Screen (Default) */}
        <Stack.Screen
            name="App"
            options={{ headerShown: false }} // Usually hide header on login
        />

        <Stack.Screen
            name="sign_up"
            options={{ headerShown: false }}
        />

        {/* Admin Flow */}
        <Stack.Screen
            name="admin/home_admin"
            options={{ headerShown: false }}
        />


          <Stack.Screen
         name="admin/[id]"
         options={{ headerShown: false }}
         />

          <Stack.Screen
              name="admin/add_film/add_to_schedule"
              options={{ headerShown: false }}
              />
      </Stack>
  )
}
