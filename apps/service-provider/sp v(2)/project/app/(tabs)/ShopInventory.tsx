import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Shop {
  id: string;
  name: string;
}

interface Tool {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  availability: boolean;
  delivery_charges: number;
}

export default function ShopInventory() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [tools, setTools] = useState<{ [key: string]: Tool[] }>({});
  const [filteredTools, setFilteredTools] = useState<{ [key: string]: Tool[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<'low' | 'high' | null>(null);
  const [activeShop, setActiveShop] = useState<string | null>(null);

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [deliveryType, setDeliveryType] = useState<'Home Delivery' | 'Takeaway' | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const router = useRouter();

  // Dummy Data
  useEffect(() => {
    const dummyShops: Shop[] = [
      { id: 'shop1', name: 'Handy Tools Store' },
      { id: 'shop2', name: 'Pro Hardware' },
      { id: 'shop3', name: 'Elite Supplies' },
    ];

    const dummyTools: { [key: string]: Tool[] } = {
      shop1: [
        { id: 'tool1', shop_id: 'shop1', name: 'Hammer', description: 'Heavy duty hammer', price: 10, availability: true, delivery_charges: 5 },
        { id: 'tool2', shop_id: 'shop1', name: 'Screwdriver', description: 'Flathead screwdriver', price: 5, availability: true, delivery_charges: 3 },
        { id: 'tool3', shop_id: 'shop1', name: 'Pliers', description: 'Multipurpose pliers', price: 8, availability: true, delivery_charges: 4 },
        // { id: 'tool4', shop_id: 'shop1', name: 'Tape Measure', description: '5-meter measuring tape', price: 7, availability: false, delivery_charges: 2 },
        { id: 'tool5', shop_id: 'shop1', name: 'Level', description: 'Precision spirit level', price: 12, availability: true, delivery_charges: 5 },
      ],
      shop2: [
        { id: 'tool6', shop_id: 'shop2', name: 'Drill', description: 'Electric drill', price: 50, availability: true, delivery_charges: 10 },
        { id: 'tool7', shop_id: 'shop2', name: 'Wrench', description: 'Adjustable wrench', price: 15, availability: true, delivery_charges: 5 },
        // { id: 'tool8', shop_id: 'shop2', name: 'Saw', description: 'Hand saw for wood', price: 20, availability: false, delivery_charges: 7 },
        { id: 'tool9', shop_id: 'shop2', name: 'Chisel Set', description: 'Set of 5 chisels', price: 25, availability: true, delivery_charges: 6 },
        { id: 'tool10', shop_id: 'shop2', name: 'Sander', description: 'Electric sander', price: 45, availability: true, delivery_charges: 12 },
      ],
      shop3: [
        { id: 'tool11', shop_id: 'shop3', name: 'Ladder', description: '6ft folding ladder', price: 60, availability: true, delivery_charges: 15 },
        { id: 'tool12', shop_id: 'shop3', name: 'Paint Brush', description: 'Set of 3 brushes', price: 10, availability: true, delivery_charges: 3 },
        { id: 'tool13', shop_id: 'shop3', name: 'Paint Roller', description: 'Medium roller', price: 12, availability: true, delivery_charges: 4 },
        // { id: 'tool14', shop_id: 'shop3', name: 'Utility Knife', description: 'Heavy-duty knife', price: 8, availability: false, delivery_charges: 2 },
        { id: 'tool15', shop_id: 'shop3', name: 'Gloves', description: 'Protective work gloves', price: 5, availability: true, delivery_charges: 2 },
      ],
    };

    setShops(dummyShops);
    setTools(dummyTools);
    setFilteredTools(dummyTools);
  }, []);

  // Filters (search + sort)
  const applyFilters = () => {
    let updatedTools: { [key: string]: Tool[] } = {};
    shops.forEach((shop) => {
      let shopTools = [...(tools[shop.id] || [])];

      if (searchQuery.trim()) {
        shopTools = shopTools.filter((tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (sortType === 'low') shopTools.sort((a, b) => a.price - b.price);
      if (sortType === 'high') shopTools.sort((a, b) => b.price - a.price);

      updatedTools[shop.id] = shopTools;
    });

    setFilteredTools(updatedTools);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, sortType, tools]);

  const handleBookNow = (tool: Tool) => setSelectedTool(tool);

  const handleDeliverySelection = (type: 'Home Delivery' | 'Takeaway') => {
    setDeliveryType(type);
    setConfirmModalVisible(true);
  };

  const handleConfirmOrder = () => {
    if (!selectedTool || !deliveryType) return;

    Alert.alert("Order Confirmed", `Order confirmed: Rs {selectedTool.name} (Rs{deliveryType})`);
    setConfirmModalVisible(false);
    setSelectedTool(null);
    setDeliveryType(null);
  };

  const handleCancelOrder = () => {
    setConfirmModalVisible(false);
    setDeliveryType(null);
    setSelectedTool(null);
  };

    return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Inventory</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* SCROLL */}
      <ScrollView style={styles.container}>
        {/* SEARCH BAR */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search tools..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* FILTERS */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterButton, sortType === 'low' && styles.activeFilter]}
            onPress={() => setSortType('low')}
          >
            <Text style={styles.filterText}>Low → High</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, sortType === 'high' && styles.activeFilter]}
            onPress={() => setSortType('high')}
          >
            <Text style={styles.filterText}>High → Low</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setSortType(null)}
          >
            <Text style={styles.filterText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* STORES HEADER */}
        <Text style={styles.storesHeader}>Stores</Text>

        {/* SHOPS BUTTONS */}
        {shops.map((shop) => (
          <View key={shop.id} style={{ marginBottom: 0 }}> {/* Removed extra space */}
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => setActiveShop(activeShop === shop.id ? null : shop.id)}
            >
              <Text style={styles.shopButtonText}>{shop.name}</Text>
            </TouchableOpacity>

            {/* SHOW INVENTORY IF ACTIVE */}
            {activeShop === shop.id && (
              <View style={styles.grid}>
                {filteredTools[shop.id]?.map((tool) => (
                  <View key={tool.id} style={styles.toolCard}>
                    <Text style={styles.toolName}>{tool.name}</Text>
                    <Text style={styles.toolDescription}>{tool.description}</Text>
                    <Text style={styles.toolPrice}>Price: Rs{tool.price}</Text>
                    <Text style={styles.toolAvailability}>
                      Availability: {tool.availability ? ' In Stock' : 'Out of Stock'}
                    </Text>
                    <Text style={styles.toolDelivery}>Delivery: Rs{tool.delivery_charges}</Text>

                    {tool.availability && (
                      <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => handleBookNow(tool)}
                      >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* MODALS */}
        {/* ...modals remain the same */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#19034d",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },

  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  searchInput: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 12, backgroundColor: "#fff" },

  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'nowrap' },
  filterButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#eee', borderRadius: 6, marginRight: 8, alignItems: 'center' },
  activeFilter: { backgroundColor: '#32fc17' },
  resetButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#ff4444', borderRadius: 6, alignItems: 'center' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#011a30' },

  storesHeader: { fontSize: 20, fontWeight: '700', marginVertical: 10, color: '#011a30' },

  shopButton: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 6, alignItems: 'center', borderWidth: 1, borderColor: "#131413ff" },
  shopButtonText: { fontSize: 18, fontWeight: '700', color: '#070707ff' },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  toolCard: { backgroundColor: "#f5f5f5", padding: 16, borderRadius: 8, marginBottom: 14, width: "48%" },
  toolName: { fontSize: 18, fontWeight: "600", color: "#011a30", marginBottom: 8 },
  toolDescription: { fontSize: 14, color: "#666", marginBottom: 8 },
  toolPrice: { fontSize: 16, fontWeight: "600", color: "#011a30", marginBottom: 4 },
  toolAvailability: { fontSize: 14, color: "#333", marginBottom: 4 },
  toolDelivery: { fontSize: 14, color: "#666", marginBottom: 12 },
  bookButton: { backgroundColor: "#30d53bff", padding: 12, borderRadius: 6, alignItems: "center" },
  bookButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  deliveryModal: { backgroundColor: "#fff", padding: 24, borderRadius: 12, width: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#011a30", marginBottom: 20, textAlign: "center" },
  deliveryOption: { backgroundColor: "#32fc17", padding: 16, borderRadius: 8, marginBottom: 12, alignItems: "center" },
  deliveryOptionText: { fontSize: 16, fontWeight: "600", color: "#011a30" },
  cancelButton: { backgroundColor: "#ddd", padding: 16, borderRadius: 8, alignItems: "center" },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#666" },

  confirmModal: { backgroundColor: "#fff", padding: 24, borderRadius: 12, width: "80%" },
  confirmTitle: { fontSize: 20, fontWeight: "700", color: "#011a30", marginBottom: 16, textAlign: "center" },
  confirmText: { fontSize: 16, color: "#333", marginBottom: 24, textAlign: "center" },
  confirmButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  yesButton: { flex: 1, backgroundColor: "#32fc17", padding: 16, borderRadius: 8, alignItems: "center" },
  noButton: { flex: 1, backgroundColor: "#dcc8c8ff", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});