import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, usePathname, Slot } from 'expo-router';
import { 
  Chrome as Home, 
  Search, 
  Calendar, 
  User, 
  History, 
  Bell,
  Settings,
  LogOut,
  RotateCcw,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const sidebarItems = [
  { name: 'index', title: 'Home', icon: Home, route: '/(tabs)' },
  { name: 'services', title: 'Services', icon: Search, route: '/(tabs)/services' },
  { name: 'scheduled', title: 'Scheduled', icon: Calendar, route: '/(tabs)/scheduled' },
  { name: 'history', title: 'History', icon: History, route: '/(tabs)/history' },
  { name: 'profile', title: 'Profile', icon: User, route: '/(tabs)/profile' },
];

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarTranslateX = useSharedValue(-280);

  const animatedSidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarTranslateX.value }],
  }));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    sidebarTranslateX.value = withTiming(sidebarOpen ? -280 : 0, { duration: 300 });
  };

  const navigateTo = (route: string) => {
    router.push(route);
    toggleSidebar();
  };

  const handleNotifications = () => {
    toggleSidebar();
    router.push('/notifications');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            toggleSidebar();
            router.replace('/login');
          }
        },
      ]
    );
  };

  // const handleSwitchRole = () => {
  //   Alert.alert(
  //     'Switch Role',
  //     'Switch to Service Provider dashboard?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Switch', onPress: () => {
  //         toggleSidebar();
  //         Alert.alert('Success', 'Switched to Provider mode');
  //       }},
  //     ]
  //   );
  // };

  const isActive = (routeName: string) => {
    if (routeName === 'index') {
      return pathname === '/(tabs)' || pathname === '/(tabs)/' || pathname === '/';
    }
    return pathname.includes(routeName);
  };

  const isHomePage = pathname === '/(tabs)' || pathname === '/(tabs)/' || pathname === '/';

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, animatedSidebarStyle]}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userRole}>Service Seeker</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sidebarContent}>
          <View style={styles.menuSection}>
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.name);
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.menuItem, active && styles.activeMenuItem]}
                  onPress={() => navigateTo(item.route)}
                >
                  <IconComponent size={20} color={active ? '#05f51d' : '#fff'} />
                  <Text style={[styles.menuText, active && styles.activeMenuText]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/notifications')}>
              <Bell size={20} color="#fff" />
              <Text style={styles.menuText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/settings')}>
              <Settings size={20} color="#fff" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.menuSection}>
            {/* <TouchableOpacity style={styles.menuItem} onPress={handleSwitchRole}>
              <RotateCcw size={20} color="#fff" />
              <Text style={styles.menuText}>Switch Role</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <LogOut size={20} color="#fff" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Overlay */}
      {sidebarOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        {isHomePage ? (
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
              <Menu size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerLogo}>
              <Text style={styles.headerLogoText}>NexoraService</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
              <Bell size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.pageHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>
              {pathname.includes('services') ? 'Services' :
               pathname.includes('scheduled') ? 'Scheduled' :
               pathname.includes('history') ? 'History' :
               pathname.includes('profile') ? 'Profile' : 'Page'}
            </Text>
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
              <Bell size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Route Content */}
        <View style={styles.routeContent}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 280,
    backgroundColor: '#19034d',
    zIndex: 1000,
    elevation: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  logo: {
    width: 40, height: 40,
    backgroundColor: '#05f51d',
    borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  logoText: { fontSize: 16, fontWeight: '800', color: '#19034d' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  userRole: { fontSize: 12, color: '#05f51d' },
  closeButton: { padding: 4 },
  sidebarContent: { flex: 1, paddingTop: 20 },
  menuSection: { paddingHorizontal: 20, marginBottom: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeMenuItem: { backgroundColor: '#ffffff20' },
  menuText: { fontSize: 16, color: '#fff', marginLeft: 16, fontWeight: '500' },
  activeMenuText: { color: '#05f51d', fontWeight: '600' },
  menuDivider: { height: 1, backgroundColor: '#ffffff20', marginHorizontal: 20, marginBottom: 20 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  mainContent: { flex: 1, backgroundColor: '#fff' },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#19034d',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#19034d',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  menuButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerLogo: { flex: 1, alignItems: 'center' },
  headerLogoText: { fontSize: 18, fontWeight: '700', color: '#ffffff' }, // Blue Text
  notificationButton: { position: 'relative', padding: 8 },
  notificationBadge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    minWidth: 16, height: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  routeContent: { flex: 1 },
});
