import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  Plus,
  LogOut,
  Lock,
  Pencil,
  Trash2,
  FileText,
  Wrench,
  Zap,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function Profile() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);


const categories = [
  {
  id: 1,
  name: 'Electrical',
  icon: Zap,
  color: '#4f46e5',
  subcategories: [
    'Wiring', 
    'Switches and Sockets', 
    'MCB Fuse DB Box', 
    'Lights and Fans',
    'Inverter UPS', 
    'Earthing Grounding', 
    'Motors and Pumps', 
    'Appliance Connection',
    'CCTV Intercom Networking Cables', 
    'Generator and Transformer'
  ]
},
{
  id: 2,
  name: 'Plumbing',
  icon: Wrench,
  color: '#059669',
  subcategories: [
    'Pipes', 
    'Taps and Mixers', 
    'Wash Basin Sink', 
    'Toilet WC Commode',
    'Shower and Bathtub', 
    'Water Tank and Pipeline', 
    'Drainage Sewage Lines',
    'Water Heater Connections', 
    'Gas Pipe Fitting', 
    'Fire Sprinkler Pipeline'
  ]
},];

  // Profile Info
  const [name, setName] = useState("Mahnoor Asif");
  const [email, setEmail] = useState("Mahnoorasif237@gmail.com");
  const [location, setLocation] = useState("Main Road Airport Society");
  const [phone, setPhone] = useState("+923355982549");
  const [profilePhoto, setProfilePhoto] = useState(
    "https://via.placeholder.com/100"
  );

  // Skills
  const [skills, setSkills] = useState({
    Electrician: ["AC Repair", "Wiring", "Fan Repair"],
    Plumber: ["Leak Repair", "Pipe Installation"],
  });

  // Certificates
  const [certificates, setCertificates] = useState([]);

  // Modals
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [certModalVisible, setCertModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);

  const [newSkillCategory, setNewSkillCategory] = useState("Electrician");
  const [newSkillSub, setNewSkillSub] = useState("");

  // Temporary fields for editing profile
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempPhone, setTempPhone] = useState(phone);

  // Load profile data from AsyncStorage and backend
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Get registration data from AsyncStorage
        const regData = await AsyncStorage.getItem('registrationData');
        if (regData) {
          const parsed = JSON.parse(regData);
          console.log('📦 Registration data loaded:', parsed);
          
          const capitalizedName = parsed.name ? parsed.name.charAt(0).toUpperCase() + parsed.name.slice(1) : "";
          setName(capitalizedName);
          setEmail(parsed.email || "");
          setPhone(parsed.contactNumber || "");
          setTempName(capitalizedName);
          setTempEmail(parsed.email || "");
          setTempPhone(parsed.contactNumber || "");
          
          // Fetch skills from backend
          const skillRes = await axios.get(`http://localhost:5004/api/get-provider?email=${parsed.email}`);
          if (skillRes.data?.provider?.skills) {
            console.log('🎯 Skills loaded:', skillRes.data.provider.skills);
            setSkills(skillRes.data.provider.skills || {});
          }
        }
      } catch (err) {
        console.error(' Error loading profile data:', err);
      }
    };

    loadProfileData();
  }, []);

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission Required", "Allow gallery access to change photo.");
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

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => router.replace("/login") },
    ]);
  };

  // Skill handling
 const addSkill = async () => {
  if (newSkillSub.trim() === "") {
    Alert.alert("Error", "Please select a subcategory.");
    return;
  }

  // Check if subcategory already exists in selected category
  if (skills[newSkillCategory]?.includes(newSkillSub)) {
    Alert.alert("Already Added", "This subcategory is already in your skills.");
    return;
  }

  try {
    // Update local state
    const updatedSkills = {
      ...skills,
      [newSkillCategory]: [...(skills[newSkillCategory] || []), newSkillSub],
    };
    setSkills(updatedSkills);

    // Save to backend
    const regData = await AsyncStorage.getItem('registrationData');
    if (regData) {
      const parsed = JSON.parse(regData);
      await axios.post('http://localhost:5004/api/update-skills', {
        email: parsed.email,
        skills: updatedSkills
      });
      console.log('Skill added and saved to database');
    }

    setNewSkillSub("");
    setSkillModalVisible(false);
    Alert.alert("Success", "Skill added successfully!");
  } catch (err) {
    console.error(' Error adding skill:', err);
    Alert.alert("Error", "Failed to add skill. Please try again.");
  }
};


  const removeSkill = (category, sub) => {
  Alert.alert(
    "Confirm Removal",
    `Are you sure you want to remove "${sub}" from ${category}?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            console.log(` Removing skill: ${sub} from ${category}`);
            
            // Update local state - remove the skill
            const updatedSkills = { ...skills };
            
            // Filter out the skill from the category
            updatedSkills[category] = updatedSkills[category].filter((item) => item !== sub);
            
            // If category is now empty, remove the category entirely
            if (updatedSkills[category].length === 0) {
              delete updatedSkills[category];
              console.log(` Category "${category}" is empty, removing it`);
            }
            
            console.log(' Updated skills:', updatedSkills);
            setSkills(updatedSkills);

            // Save to backend
            const regData = await AsyncStorage.getItem('registrationData');
            if (regData) {
              const parsed = JSON.parse(regData);
              console.log(` Sending to backend for ${parsed.email}`);
              
              await axios.post('http://localhost:5004/api/update-skills', {
                email: parsed.email,
                skills: updatedSkills
              });
              console.log(' Skill removed and deleted from database');
            }

            Alert.alert("Success", "Skill removed successfully!");
          } catch (err) {
            console.error(' Error removing skill:', err);
            // Revert the UI change if backend fails
            const regData = await AsyncStorage.getItem('registrationData');
            if (regData) {
              const parsed = JSON.parse(regData);
              const skillRes = await axios.get(`http://localhost:5004/api/get-provider?email=${parsed.email}`);
              if (skillRes.data?.provider?.skills) {
                setSkills(skillRes.data.provider.skills);
              }
            }
            Alert.alert("Error", "Failed to remove skill. Please try again.");
          }
        },
      },
    ]
  );
};


  // Certificate handling
  const addCertificate = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission Required", "Allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCertificates((prev) => [...prev, result.assets[0].uri]);
      setCertModalVisible(false);
      alert("Certificate added successfully!");
    }
  };

  const confirmDeleteCertificate = (uri) => {
    Alert.alert(
      "Delete Certificate",
      "Are you sure you want to delete this certificate?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            setCertificates((prev) => prev.filter((item) => item !== uri));
            alert("Certificate removed successfully!");
          },
        },
      ]
    );
  };

  // Save edited profile
  const saveProfile = () => {
    setName(tempName);
    setEmail(tempEmail);
    setLocation(tempLocation);
    setPhone(tempPhone);
    setEditProfileModalVisible(false);
    Alert.alert("Profile Updated", "Your profile details have been saved!");
  };

  // const confirmSave = (message) => {
  //   Alert.alert(
  //     "Save Changes",
  //     "Do you want to save these changes?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       { text: "Yes", onPress: () => Alert.alert("Success", message) },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  return (
    <View style={styles.container}>
      <Sidebar isvisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("/notifications")}>
          <Bell size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileImageWrapper}>
          <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
            <Pencil size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.phone}>{phone}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setTempName(name);
              setTempEmail(email);
              setTempLocation(location);
              setTempPhone(phone);
              setEditProfileModalVisible(true);
            }}
          >
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity onPress={() => setSkillModalVisible(true)}>
              <Plus size={22} color="#19034d" />
            </TouchableOpacity>
          </View>

          {Object.keys(skills).map((category, idx) => (
            <View key={idx} style={styles.skillCard}>
              <Text style={styles.skillCategory}>{category}</Text>
              <View style={styles.skillBadges}>
                {skills[category].map((sub, subIdx) => (
                  <View key={subIdx} style={styles.skillBadge}>
                    <Text style={styles.skillBadgeText}>{sub}</Text>
                    <TouchableOpacity onPress={() => removeSkill(category, sub)}>
                      <Trash2 size={14} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Certificates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Certificates</Text>
            <TouchableOpacity onPress={() => setCertModalVisible(true)}>
              <Plus size={22} color="#19034d" />
            </TouchableOpacity>
          </View>

          {certificates.length === 0 ? (
            <Text style={{ color: "#999" }}>No certificates uploaded yet.</Text>
          ) : (
            certificates.map((uri, index) => (
              <View key={index} style={styles.certCard}>
                <FileText size={20} color="#19034d" />
                <Text style={styles.certText}>{uri.split("/").pop()}</Text>
                <TouchableOpacity onPress={() => confirmDeleteCertificate(uri)}>
                  <Trash2 size={18} color="#f44336" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Change Password */}
        <TouchableOpacity
          style={styles.changePassBtn}
          onPress={() => router.push("/changepassword")}
        >
          <Lock size={18} color="#19034d" />
          <Text style={styles.outlineText}>Change Password</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

{/* Add Skill Modal */}
<Modal transparent visible={skillModalVisible} animationType="slide">
  <View style={styles.modalContainer}>
    <View style={[styles.modalBox, { minHeight: 350 }]}>
      <Text style={styles.modalTitle}>Add Skill</Text>

      {/* Category Buttons */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            newSkillCategory === 'Electrician' && styles.categorySelected,
          ]}
          onPress={() => {
            setNewSkillCategory('Electrician');
            setNewSkillSub('');
          }}
        >
          <Text
            style={[
              styles.categoryText,
              newSkillCategory === 'Electrician' && styles.categoryTextSelected,
            ]}
          >
            Electrician
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            newSkillCategory === 'Plumber' && styles.categorySelected,
          ]}
          onPress={() => {
            setNewSkillCategory('Plumber');
            setNewSkillSub('');
          }}
        >
          <Text
            style={[
              styles.categoryText,
              newSkillCategory === 'Plumber' && styles.categoryTextSelected,
            ]}
          >
            Plumber
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subcategories */}
      {newSkillCategory !== '' && (
        <>
          <Text style={styles.label}>Select Subcategory</Text>
          <ScrollView
            style={{ maxHeight: 220 }}
            contentContainerStyle={{ paddingVertical: 5 }}
          >
            {(
              newSkillCategory === 'Electrician'
                ? categories[0].subcategories
                : categories[1].subcategories
            ).map((sub, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.subcategoryButton,
                  newSkillSub === sub && styles.subcategorySelected,
                ]}
                onPress={() => setNewSkillSub(sub)}
              >
                <Text
                  style={[
                    styles.subcategoryText,
                    newSkillSub === sub && styles.subcategoryTextSelected,
                  ]}
                >
                  {sub}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Action Buttons */}
      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={() => setSkillModalVisible(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!newSkillCategory || !newSkillSub}
          onPress={addSkill}
        >
          <Text
            style={[
              styles.saveText,
              (!newSkillCategory || !newSkillSub) && { opacity: 0.5 },
            ]}
          >
            Add
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>




{/* Add Certificate Modal */}
<Modal transparent visible={certModalVisible} animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Add Certificate</Text>
      <Text style={{ color: "#555", marginBottom: 16, textAlign: "center" }}>
        Upload a certificate from your device gallery.
      </Text>

      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={() => setCertModalVisible(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addCertificate}>
          <Text style={styles.saveText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>




      {/* Edit Profile Modal */}
      <Modal transparent visible={editProfileModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput style={styles.input} value={tempName} onChangeText={setTempName} placeholder="Name" />
            <TextInput style={styles.input} value={tempEmail} onChangeText={setTempEmail} placeholder="Email" />
            <TextInput style={styles.input} value={tempLocation} onChangeText={setTempLocation} placeholder="Location" />
            <TextInput style={styles.input} value={tempPhone} onChangeText={setTempPhone} placeholder="Phone Number" keyboardType="phone-pad" />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditProfileModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveProfile}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#19034d",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  profileImageWrapper: { alignSelf: "center", position: "relative" },
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
  location: { fontSize: 14, color: "#777", textAlign: "center" },
  phone: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 24 },
  buttonRow: { flexDirection: "row", justifyContent: "center", marginHorizontal: 20, marginBottom: 20 },
  actionButton: {
    flex: 1,
    backgroundColor: "#05f51d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: { color: "#19034d", fontWeight: "600", fontSize: 16 },
  section: { padding: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#19034d" },
  skillCard: { backgroundColor: "#f0ebf8", padding: 16, borderRadius: 12, marginBottom: 12 },
  skillCategory: { fontSize: 16, fontWeight: "bold", color: "#19034d", marginBottom: 12 },
  skillBadges: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillBadgeText: { fontSize: 12, color: "#19034d" },
  certCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#e2e1e3ff",
    borderRadius: 8,
    marginBottom: 10,
  },
  certText: { flex: 1, marginLeft: 10, color: "#19034d" },
  changePassBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#19034d",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 8,
  },
  outlineText: { color: "#19034d", fontWeight: "600", fontSize: 16 },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f44336",
    paddingVertical: 14,
    borderRadius: 12,
    margin: 20,
    gap: 8,
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#19034d", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
  cancelText: { color: "#999", fontSize: 16 },
  saveText: { color: "#05f51d", fontWeight: "bold", fontSize: 16 },
  categoryContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16,
},

categoryButton: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#ccc',
  paddingVertical: 10,
  marginHorizontal: 5,
  borderRadius: 8,
  alignItems: 'center',
},

categorySelected: {
  backgroundColor: '#19034d',
  borderColor: '#19034d',
},

categoryText: {
  color: '#333',
  fontSize: 16,
  fontWeight: '500',
},

categoryTextSelected: {
  color: '#fff',
},
modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
modalBox: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  width: '100%',
  maxWidth: 400,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center',
  color: '#222',
},
label: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 8,
  marginTop: 10,
  color: '#444',
},

/* Categories */
categoryContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 15,
},
categoryButton: {
  flex: 1,
  paddingVertical: 10,
  marginHorizontal: 5,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  backgroundColor: '#f8f8f8',
  alignItems: 'center',
},
categorySelected: {
  backgroundColor: '#19034d',
  borderColor: '#19034d',
},
categoryText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},
categoryTextSelected: {
  color: '#fff',
},

/* Subcategories */
subcategoryButton: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginVertical: 5,
  backgroundColor: '#f8f8f8',
},
subcategorySelected: {
  backgroundColor: '#19034d',
  borderColor: '#19034d',
},
subcategoryText: {
  fontSize: 16,
  color: '#333',
},
subcategoryTextSelected: {
  color: '#fff',
  fontWeight: '600',
},

/* Bottom Buttons */
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: 15,
},
cancelText: {
  fontSize: 16,
  marginRight: 20,
  color: '#666',
},
saveText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#05f51d',
},



});
