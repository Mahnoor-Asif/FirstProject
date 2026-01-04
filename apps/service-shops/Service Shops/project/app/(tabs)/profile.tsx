import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  User,
  Mail,
  MapPin,
  Lock,
  Pencil,
  LogOut,
  ArrowLeft,
  Store,
  Phone,
  FileText,
  Image as ImageIcon,
} from "lucide-react-native";

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"personal" | "shop">("personal");

  // --- Personal profile states ---
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [location, setLocation] = useState("New York, USA");
  const [profilePhoto, setProfilePhoto] = useState("https://via.placeholder.com/100");

  // --- Shop profile states ---
  const [shopName, setShopName] = useState("Bright Electric & Plumbing");
  const [shopAddress, setShopAddress] = useState("Main Bazar, Lahore");
  const [shopPhone, setShopPhone] = useState("0300-1234567");
  const [shopRegDoc, setShopRegDoc] = useState<string | null>(null);
  const [shopImage, setShopImage] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const handleImagePick = async (type: "profile" | "shop" | "doc") => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow gallery access to upload image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === "profile") setProfilePhoto(uri);
      else if (type === "shop") setShopImage(uri);
      else setShopRegDoc(uri);
    }
  };

  const handleSavePersonal = () => {
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your personal profile changes have been saved.");
  };

  const handleSaveShop = () => {
     console.log("Save Shop Info pressed");
    Alert.alert(
      "Confirm Edit",
      "Are you sure you want to edit your shop info?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Edit",
          onPress: () => {
            // Perform save logic here (API call or local update)
            Alert.alert("Shop Info Updated", "Your shop details have been saved successfully.");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => router.replace("/login") },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "personal" && styles.activeToggle,
          ]}
          onPress={() => setActiveTab("personal")}
        >
          <User size={18} color={activeTab === "personal" ? "#fff" : "#19034d"} />
          <Text
            style={[
              styles.toggleText,
              activeTab === "personal" && styles.activeToggleText,
            ]}
          >
            Personal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "shop" && styles.activeToggle,
          ]}
          onPress={() => setActiveTab("shop")}
        >
          <Store size={18} color={activeTab === "shop" ? "#fff" : "#19034d"} />
          <Text
            style={[
              styles.toggleText,
              activeTab === "shop" && styles.activeToggleText,
            ]}
          >
            Shop
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === "personal" ? (
          <>
            {/* Profile Image */}
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => handleImagePick("profile")}
              >
                <Pencil size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <>
                <View style={styles.inputGroup}>
                  <User size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Full Name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Mail size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <MapPin size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Location"
                  />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSavePersonal}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
                <Text style={styles.location}>{location}</Text>

                <View style={styles.divider} />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.actionText}>Edit Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButtonOutline}
                    onPress={() => router.push("/changepassword")}
                  >
                    <Lock size={18} color="#19034d" />
                    <Text style={styles.outlineText}>Change Password</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                  >
                    <LogOut size={18} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        ) : (
          <>
            {/* Shop Info Section */}
            <View style={styles.inputGroup}>
              <Store size={20} color="#666" />
              <TextInput
                style={styles.input}
                value={shopName}
                onChangeText={setShopName}
                placeholder="Shop Name"
              />
            </View>

            <View style={styles.inputGroup}>
              <MapPin size={20} color="#666" />
              <TextInput
                style={styles.input}
                value={shopAddress}
                onChangeText={setShopAddress}
                placeholder="Shop Address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Phone size={20} color="#666" />
              <TextInput
                style={styles.input}
                value={shopPhone}
                onChangeText={setShopPhone}
                placeholder="Shop Phone"
                keyboardType="phone-pad"
              />
            </View>

            {/* Upload Buttons */}
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleImagePick("doc")}
            >
              <FileText size={18} color="#19034d" />
              <Text style={styles.uploadText}>
                {shopRegDoc ? "Change Registration Doc" : "Upload Registration Doc"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleImagePick("shop")}
            >
              <ImageIcon size={18} color="#19034d" />
              <Text style={styles.uploadText}>
                {shopImage ? "Change Shop Image" : "Upload Shop Image"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveShop}>
  <Text style={styles.saveButtonText}>Save Shop Info</Text>
</TouchableOpacity>

          </>
        )}
      </ScrollView>
    </View>
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
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },

  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 10,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#19034d",
  },
  activeToggle: { backgroundColor: "#19034d" },
  toggleText: { color: "#19034d", fontWeight: "600" },
  activeToggleText: { color: "#fff" },

  profileImageWrapper: { alignSelf: "center", position: "relative", marginTop: 20 },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#05f51d",
    marginBottom: 24,
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 5,
    backgroundColor: "#05f51d",
    borderRadius: 20,
    padding: 6,
  },
  name: { fontSize: 22, fontWeight: "700", color: "#19034d", textAlign: "center" },
  email: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 4 },
  location: { fontSize: 14, color: "#777", textAlign: "center", marginBottom: 24 },
  divider: {
    width: "90%",
    height: 1,
    backgroundColor: "#eee",
    alignSelf: "center",
    marginVertical: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    width: "90%",
    alignSelf: "center",
    marginBottom: 16,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: "#333", marginLeft: 10 },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#19034d",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    width: "90%",
    alignSelf: "center",
    marginBottom: 14,
    gap: 8,
  },
  uploadText: { color: "#19034d", fontWeight: "600" },
  saveButton: {
    backgroundColor: "#05f51d",
    paddingVertical: 14,
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#19034d",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: { marginTop: 10, gap: 15 },
  actionButton: {
    backgroundColor: "#05f51d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  actionText: { color: "#19034d", fontWeight: "600", fontSize: 16 },
  actionButtonOutline: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#19034d",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    width: "90%",
    alignSelf: "center",
  },
  outlineText: { color: "#19034d", fontWeight: "600", fontSize: 16 },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f44336",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    width: "90%",
    alignSelf: "center",
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
