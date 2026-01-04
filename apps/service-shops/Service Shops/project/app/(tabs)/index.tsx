// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Plus, Package, MessageSquare, ShoppingCart, User, HelpCircle } from 'lucide-react-native';
// import Header from '@/components/Header';
// import Card from '@/components/Card';
// import { theme } from '@/constants/theme';

// export default function Dashboard() {
//   const router = useRouter();

//   const stats = [
//     { label: 'Pending Orders', value: 2, color: theme.colors.warning },
//     { label: 'Active Deliveries', value: 1, color: theme.colors.success },
//     { label: 'New Requests', value: 3, color: theme.colors.secondary },
//   ];

//   const shortcuts = [
//     { icon: Plus, label: 'Add New Item', onPress: () => router.push('/inventory') },
//     { icon: Package, label: 'Open Inventory', onPress: () => router.push('/inventory') },
//     { icon: MessageSquare, label: 'View Requests', onPress: () => router.push('/requests') },
//     { icon: ShoppingCart, label: 'View Orders', onPress: () => router.push('/orders') },
//   ];

//   return (
//     <View style={styles.container}>
//       <Header title="Welcome, Shop Name" />

//       <ScrollView style={styles.content}>
//         <View style={styles.statsContainer}>
//           {stats.map((stat, index) => (
//             <Card key={index} style={styles.statCard}>
//               <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
//               <Text style={styles.statLabel}>{stat.label}</Text>
//             </Card>
//           ))}
//         </View>

//         <Text style={styles.sectionTitle}>Quick Actions</Text>
//         <View style={styles.shortcutsGrid}>
//           {shortcuts.map((shortcut, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.shortcutCard}
//               onPress={shortcut.onPress}>
//               <shortcut.icon size={32} color={theme.colors.primary} />
//               <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Card style={styles.infoCard}>
//           <View style={styles.infoRow}>
//             <User size={24} color={theme.colors.primary} />
//             <View style={styles.infoTextContainer}>
//               <Text style={styles.infoTitle}>Your Shop Info</Text>
//               <Text style={styles.infoSubtitle}>View and edit profile</Text>
//             </View>
//           </View>
//         </Card>

//         <Card style={styles.infoCard}>
//           <View style={styles.infoRow}>
//             <HelpCircle size={24} color={theme.colors.secondary} />
//             <View style={styles.infoTextContainer}>
//               <Text style={styles.infoTitle}>Need Help?</Text>
//               <Text style={styles.infoSubtitle}>Watch training videos</Text>
//             </View>
//           </View>
//         </Card>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   content: {
//     flex: 1,
//     padding: theme.spacing.md,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: theme.spacing.lg,
//   },
//   statCard: {
//     flex: 1,
//     marginHorizontal: theme.spacing.xs,
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: theme.fontSize.xxl,
//     fontWeight: 'bold',
//   },
//   statLabel: {
//     fontSize: theme.fontSize.xs,
//     color: theme.colors.textLight,
//     textAlign: 'center',
//     marginTop: theme.spacing.xs,
//   },
//   sectionTitle: {
//     fontSize: theme.fontSize.lg,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//     marginBottom: theme.spacing.md,
//   },
//   shortcutsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: theme.spacing.lg,
//   },
//   shortcutCard: {
//     width: '48%',
//     backgroundColor: theme.colors.background,
//     borderRadius: theme.borderRadius.lg,
//     padding: theme.spacing.md,
//     alignItems: 'center',
//     marginBottom: theme.spacing.md,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   shortcutLabel: {
//     fontSize: theme.fontSize.sm,
//     color: theme.colors.text,
//     textAlign: 'center',
//     marginTop: theme.spacing.sm,
//   },
//   infoCard: {
//     marginBottom: theme.spacing.md,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   infoTextContainer: {
//     marginLeft: theme.spacing.md,
//     flex: 1,
//   },
//   infoTitle: {
//     fontSize: theme.fontSize.md,
//     fontWeight: '600',
//     color: theme.colors.text,
//   },
//   infoSubtitle: {
//     fontSize: theme.fontSize.sm,
//     color: theme.colors.textLight,
//     marginTop: 2,
//   },
// });
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/splash" />;
}