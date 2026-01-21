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

              <Stack.Screen
                  name={"guest/home_guest"}
                  options={{ headerShown: false }}
                  />
              <Stack.Screen
                name="guest/[id]"
              options={{ headerShown: false }}
              />
              <Stack.Screen
              name="guest/booking/date_room_time"
              options={{ headerShown: false }}/>
              <Stack.Screen
                  name="guest/booking/seat"
                  options={{ headerShown: false }}/>
              <Stack.Screen
                  name="guest/booking/snack"
                  options={{ headerShown: false }}/>
              <Stack.Screen
                  name={"guest/purchased_guest"}
              options={{ headerShown: false }}/>
              <Stack.Screen
                  name={"guest/profile_guest"}
                  options={{ headerShown: false }}/>

          </Stack>
  )
}
