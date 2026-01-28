import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Chrome as Home,
  User,
  Search,
  History,
  Calendar,
  ClipboardList,
  Wrench,
  Boxes,
  Settings,
  LogOut,
  Bell,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export function Sidebar({ isVisible, onClose }: SidebarProps) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
  const [userName, setUserName] = useState("Service Provider");

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -width * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  // Load user name from AsyncStorage
  useEffect(() => {
    const loadUserName = async () => {
      try {
        const regData = await AsyncStorage.getItem('registrationData');
        if (regData) {
          const parsed = JSON.parse(regData);
          if (parsed.name) {
            const capitalizedName = parsed.name.charAt(0).toUpperCase() + parsed.name.slice(1);
            setUserName(capitalizedName);
            console.log(' Sidebar user name loaded:', capitalizedName);
          }
        }
      } catch (err) {
        console.error(' Error loading user name:', err);
      }
    };
    loadUserName();
  }, [isVisible]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear all user data from AsyncStorage
            await AsyncStorage.removeItem('registrationData');
            console.log(' User data cleared, logging out...');
          } catch (err) {
            console.error(' Error clearing data:', err);
          }
          onClose();
          router.replace("/role-selection");
        },
      },
    ]);
  };

  const upperMenu = [
    { icon: Home, label: "Home", route: "/dashboard" },
    { icon: Search, label: "Services", route: "/jobs" },
    { icon: Calendar, label: "Scheduled", route: "/schedule" },
    { icon: History, label: "History", route: "/history" },
    { icon: User, label: "Profile", route: "/profile" },

    //  FIXED ITEMS
    { icon: Wrench, label: "Request Tool", route: "/(tabs)/RequestTool" },
    { icon: Boxes, label: "Shop Inventory", route: "/(tabs)/ShopInventory" },
    { icon: ClipboardList, label: "Tool History", route: "/(tabs)/ToolHistory" },
  ];

  const lowerMenu = [
    { icon: Bell, label: "Notifications", route: "/notifications" },
    { icon: Settings, label: "Settings", route: "/settings" },
  ];

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.touchableBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      )}

      <Animated.View
        style={[
          styles.sidebarContainer,
          { width: width * 0.75, transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userRole}>Service Provider</Text>
          </View>
        </View>

        {/* Menu */}
        <ScrollView style={styles.menu}>
          {/* Top menu */}
          {upperMenu.map((item, index) => {
            const Icon = item.icon;
            const isActive = false; // set active logic later

            return (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, isActive && styles.activeMenuItem]}
                onPress={() => {
                  onClose();
                  router.push(item.route);
                }}
              >
                <Icon size={22} color={isActive ? "#05f51d" : "#FFFFFF"} />
                <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.separator} />

          {/* Bottom menu */}
          {lowerMenu.map((item, index) => {
            const Icon = item.icon;

            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push(item.route);
                }}
              >
                <Icon size={22} color="#FFFFFF" />
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.separator} />

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  touchableBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 5,
  },
  sidebarContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#19034d",
    zIndex: 10,
    paddingVertical: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 25,
    gap: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#05f51d",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  userName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  userRole: {
    color: "#a9a9a9",
    fontSize: 13,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 22,
    gap: 18,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
  },
  activeMenuItem: {
    backgroundColor: "rgba(5, 245, 29, 0.15)",
    borderRadius: 10,
  },
  activeMenuText: {
    color: "#05f51d",
    fontWeight: "600",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 22,
    gap: 18,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
