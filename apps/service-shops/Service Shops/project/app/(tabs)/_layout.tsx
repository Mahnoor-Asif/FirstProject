// import { Tabs } from 'expo-router';
// import { Home, Package, MessageSquare, ShoppingCart, History } from 'lucide-react-native';
// import { theme } from '@/constants/theme';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: theme.colors.secondary,
//         tabBarInactiveTintColor: theme.colors.textLight,
//         tabBarStyle: {
//           backgroundColor: theme.colors.background,
//           borderTopColor: theme.colors.border,
//         },
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Dashboard',
//           tabBarIcon: ({ size, color }) => (
//             <Home size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="inventory"
//         options={{
//           title: 'Inventory',
//           tabBarIcon: ({ size, color }) => (
//             <Package size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="requests"
//         options={{
//           title: 'Requests',
//           tabBarIcon: ({ size, color }) => (
//             <MessageSquare size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="orders"
//         options={{
//           title: 'Orders',
//           tabBarIcon: ({ size, color }) => (
//             <ShoppingCart size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="history"
//         options={{
//           title: 'History',
//           tabBarIcon: ({ size, color }) => (
//             <History size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
