import React, { useEffect, useRef } from "react";
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
import {
  Chrome as Home,
  User,
  Plus,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  X,
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

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -width * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          onClose();
          router.replace("/role-selection" as any);
        },
      },
    ]);
  };

  // ---- Menus ----
  const upperMenu = [
    { icon: Home, label: "Home", route: "/dashboard" },
    { icon: Plus, label: "Add New Item", route: "/inventory" },
    { icon: Package, label: "Open Inventory", route: "/inventory" },
    { icon: MessageSquare, label: "View Requests", route: "/requests" },
    { icon: User, label: "Profile", route: "/profile" },
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
        {/* Close Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userRole}>Shop Owner</Text>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menu}>
          {/* Upper Menu */}
          {upperMenu.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.label === "Home";
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  isActive && styles.activeMenuItem,
                ]}
                onPress={() => {
                  onClose();
                  router.push(item.route as any);
                }}
              >
                <Icon size={22} color={isActive ? "#05f51d" : "#FFFFFF"} />
                <Text
                  style={[
                    styles.menuText,
                    isActive && styles.activeMenuText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Divider */}
          <View style={styles.separator} />

          {/* Lower Menu */}
          {lowerMenu.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push(item.route as any);
                }}
              >
                <Icon size={22} color="#FFFFFF" />
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Divider */}
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
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
