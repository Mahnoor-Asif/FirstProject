import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import {
  Menu,
  Bell,
  MapPin,
  Plus,
  Package,
  MessageSquare,
  ShoppingCart,
  User,
  HelpCircle,
  X,
} from "lucide-react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Sidebar } from "@/components/Sidebar";
import { theme } from "@/constants/theme";

export default function Dashboard() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const [currentAddress, setCurrentAddress] = useState("Fetching your location...");
  const [manualLocation, setManualLocation] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const stats = [
    { label: "Pending Orders", value: 2, color: theme.colors.warning },
    { label: "Active Deliveries", value: 1, color: theme.colors.success },
    { label: "New Requests", value: 3, color: theme.colors.secondary },
  ];

  const shortcuts = [
    { icon: Plus, label: "Add New Item", onPress: () => router.push("/inventory") },
    { icon: Package, label: "Open Inventory", onPress: () => router.push("/inventory") },
    { icon: MessageSquare, label: "View Requests", onPress: () => router.push("/requests") },
    { icon: ShoppingCart, label: "View Orders", onPress: () => router.push("/orders") },
  ];

  // 📍 Auto-fetch location
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setCurrentAddress("Permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResponse.length > 0) {
        let addr = addressResponse[0];
        let fullAddress = `${addr.name || ""}, ${addr.city || ""}, ${addr.region || ""}, ${
          addr.country || ""
        }`;
        setCurrentAddress(fullAddress);
      } else {
        setCurrentAddress("Unable to get address");
      }
    } catch (error) {
      console.log(error);
      setCurrentAddress("Error fetching location");
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    Alert.alert("Status Updated", `You are now ${!isOnline ? "online" : "offline"}.`);
  };

  const handleManualLocationSubmit = () => {
    if (!manualLocation.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }
    setCurrentAddress(manualLocation);
    setShowLocationModal(false);
    setManualLocation("");
    Alert.alert("Location Set", `Location set to: ${manualLocation}`);
  };

  const handleShareLocation = async () => {
    Alert.alert("Select Location", "How would you like to set your location?", [
      { text: "Cancel", style: "cancel" },
      { text: "Use Current Location", onPress: async () => fetchCurrentLocation() },
      { text: "Enter Manually", onPress: () => setShowLocationModal(true) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)} style={{ marginTop: "12%" }}>
          <Menu size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.logo}>NexoraServices</Text>
        <TouchableOpacity style={{ marginTop: "12%" }} onPress={() => router.push("/notifications")}>
          <Bell size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingLine}>
            Welcome back, <Text style={styles.userName}>Muhammad Ali</Text>
          </Text>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Your Location</Text>
            <TouchableOpacity style={styles.changeLocationBtn} onPress={handleShareLocation}>
              <Text style={styles.changeLocationText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <View style={styles.mockMap}>
              <View style={styles.locationMarker}>
                <MapPin size={20} color="#fff" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>{currentAddress}</Text>
                <Text style={styles.locationSubtext}>Current Location</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { paddingHorizontal: 24 }]}>Quick Actions</Text>
        <View style={styles.shortcutsGrid}>
          {shortcuts.map((shortcut, index) => (
            <TouchableOpacity key={index} style={styles.shortcutCard} onPress={shortcut.onPress}>
              <shortcut.icon size={32} color={theme.colors.primary} />
              <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 📍 Manual Location Modal */}
      <Modal
        transparent
        visible={showLocationModal}
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Location Manually</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <X size={24} color="#19034d" />
              </TouchableOpacity>
            </View>

            <View style={styles.locationForm}>
              <View style={styles.locationInputGroup}>
                <MapPin size={20} color="#19034d" />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Type your area, city, or address"
                  value={manualLocation}
                  onChangeText={setManualLocation}
                  multiline
                />
              </View>
            </View>

            <TouchableOpacity style={styles.submitLocationButton} onPress={handleManualLocationSubmit}>
              <Text style={styles.submitLocationText}>Save Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#19034d",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: "12%" },
  content: { flex: 1 },
  greetingSection: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  greetingLine: { fontSize: 18, color: "#19034d", fontWeight: "600" },
  userName: { fontSize: 16, fontWeight: "600", color: "#19034d" },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#19034d", marginBottom: 12 },
  locationHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  changeLocationBtn: {
    backgroundColor: "#05f51d",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  changeLocationText: { color: "#19034d", fontWeight: "600", fontSize: 12 },
  mapContainer: { height: 200, borderRadius: 12, overflow: "hidden", marginTop: 12 },
  mockMap: { flex: 1, backgroundColor: "#f0fff1", justifyContent: "flex-end", padding: 16 },
  locationMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 40,
    height: 40,
    backgroundColor: "#19034d",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    marginLeft: -20,
  },
  locationInfo: { alignItems: "center", gap: 4 },
  locationText: { fontSize: 16, fontWeight: "600", color: "#19034d", textAlign: "center" },
  locationSubtext: { fontSize: 14, color: "#05f51d" },

  // Quick Actions
  shortcutsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  shortcutCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  shortcutLabel: { fontSize: 14, fontWeight: "500", color: "#19034d", marginTop: 8 },

  // 📍 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#19034d" },
  locationForm: { marginBottom: 24 },
  locationInputGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    minHeight: 60,
    textAlignVertical: "top",
  },
  submitLocationButton: {
    backgroundColor: "#05f51d",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitLocationText: { fontSize: 16, fontWeight: "600", color: "#19034d" },
});
