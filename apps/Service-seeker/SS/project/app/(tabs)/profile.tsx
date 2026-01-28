import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { User, Mail, MapPin, Pencil, Lock, LogOut } from "lucide-react-native";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com"); // logged-in email
  const [location, setLocation] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("https://via.placeholder.com/100");
  const [isEditing, setIsEditing] = useState(false);

  // Use Expo dynamic IP for local testing
  const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/profile`;
  const LOCAL_IP = Constants.manifest?.debuggerHost?.split(":")[0];


  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${email}`);
        if (res.data) {
          setName(res.data.name);
          setLocation(res.data.location);
          setProfilePhoto(res.data.profilePhoto);
        }
      } catch (error) {
        console.error("Fetch failed:", error.message);
      }
    };
    fetchProfile();
  }, []);

  // Pick image
  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission Required", "Allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) setProfilePhoto(result.assets[0].uri);
  };

  // Save profile
  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and email are required");
      return;
    }

    try {
      const res = await axios.put(`${BASE_URL}/update/${email}`, { name, location, profilePhoto });
      Alert.alert("Success", res.data.message);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err.message);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageWrapper}>
        <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
          <Pencil size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <>
          <View style={styles.inputGroup}><User size={20} color="#666" /><TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" /></View>
          <View style={styles.inputGroup}><Mail size={20} color="#666" /><TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" /></View>
          <View style={styles.inputGroup}><MapPin size={20} color="#666" /><TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Location" /></View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.saveButtonText}>Save Changes</Text></TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.location}>{location}</Text>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(true)}><Text style={styles.actionText}>Edit Profile</Text></TouchableOpacity>
        </>
      )}
    </View>
  );
}

// Styles remain same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 24 },
  profileImageWrapper: { alignSelf: "center", position: "relative" },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "#05f51d", marginBottom: 24 },
  editIcon: { position: "absolute", bottom: 10, right: 5, backgroundColor: "#05f51d", borderRadius: 20, padding: 6 },
  name: { fontSize: 22, fontWeight: "700", color: "#19034d", textAlign: "center" },
  email: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 4 },
  location: { fontSize: 14, color: "#777", textAlign: "center", marginBottom: 24 },
  divider: { width: "90%", height: 1, backgroundColor: "#eee", alignSelf: "center", marginVertical: 20 },
  inputGroup: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8f9fa", borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: "#e5e5e5", width: "100%", marginBottom: 16 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: "#333", marginLeft: 10 },
  saveButton: { backgroundColor: "#05f51d", paddingVertical: 14, borderRadius: 12, marginTop: 10 },
  saveButtonText: { color: "#19034d", fontWeight: "600", fontSize: 16, textAlign: "center" },
  actionButton: { backgroundColor: "#05f51d", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  actionText: { color: "#19034d", fontWeight: "600", fontSize: 16 },
});
