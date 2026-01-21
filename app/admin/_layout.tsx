// import { Tabs } from 'expo-router';
// import Ionicons from '@expo/vector-icons/Ionicons';
//
// export default function TabLayout() {
//     return (
//         <Tabs screenOptions={{ tabBarActiveTintColor: 'tomato' }}>
//
//             {/* 1. Home Tab (points to index.tsx) */}
//             <Tabs.Screen
//                 name="home_admin"
//                 options={{
//                     headerShown: false,
//                     tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
//                 }}
//             />
//
//             {/* 2. Schedule Tab (points to schedule.tsx) */}
//             <Tabs.Screen
//                 name="schedule"
//                 options={{
//                     headerShown: false,
//                     tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
//                 }}
//             />
//
//             <Tabs.Screen
//                 name="[id]"
//                 options={{
//                     href: null
//                 }}
//             />
//
//             <Tabs.Screen
//                 name="render_poster_admin"
//                 options={{
//                     href: null
//                 }}
//             />
//
//             <Tabs.Screen
//                 name="add_film/add_to_schedule"
//                 options={{
//                     href: null
//                 }}
//             />
//
//         </Tabs>
//     );
// }