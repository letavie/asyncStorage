import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useNavigation } from "@react-navigation/native";
import { FavoritesContext } from "../contexts/FavoritesContext";
import Icon from "react-native-vector-icons/FontAwesome";

export default function HomeScreen() {
  const [artTools, setArtTools] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredArtTools, setFilteredArtTools] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");

  const navigation = useNavigation();
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      // Reset navigation stack to the initial route when the tab is pressed
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetch("https://670f67833e7151861657bdaa.mockapi.io/api/v1/arttools")
      .then((response) => response.json())
      .then((data) => {
        setArtTools(data);
        setFilteredArtTools(data);
      });
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    filterArtTools(text, selectedBrand);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    filterArtTools(searchText, brand);
  };

  const filterArtTools = (searchText, brand) => {
    let filtered = artTools;

    if (searchText.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.artName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (brand !== "All") {
      filtered = filtered.filter((item) => item.brand === brand);
    }

    setFilteredArtTools(filtered);
  };

  const renderItem = ({ item }) => {
    const favorite = isFavorite(item.id);

    return (
      <View style={styles.itemContainer}>
        <Pressable onPress={() => navigation.navigate("Detail", { item })}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.artName}</Text>
          <Text>Price: ${item.price}</Text>
          {item.limitedTimeDeal > 0 && (
            <Text style={styles.deal}>Deal: {item.limitedTimeDeal * 100}%</Text>
          )}
        </Pressable>
        <Pressable
          onPress={() =>
            favorite ? removeFavorite(item.id) : addFavorite(item)
          }
          style={styles.heartIcon}
        >
          <Icon
            name={favorite ? "heart" : "heart-o"}
            size={24}
            color="#FF69B4"
          />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm"
          value={searchText}
          onChangeText={handleSearch}
        />

        <Icon name={"search"} style={styles.icon} />
      </View>
      {/* Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.text}>Danh mục</Text>
        <Picker
          selectedValue={selectedBrand}
          style={styles.picker}
          onValueChange={(itemValue) => handleBrandChange(itemValue)}
        >
          <Picker.Item label="All" value="All" style={styles.itempic} />
          {Array.from(new Set(artTools.map((item) => item.brand))).map(
            (brand) => (
              <Picker.Item label={brand} value={brand} key={brand} />
            )
          )}
        </Picker>
      </View>
      {/* List of Art Tools */}
      {filteredArtTools.length === 0 ? (
        <View style={styles.noProductsContainer}>
          <Icon
            name="shopping-cart"
            size={50}
            color="#ccc"
            style={styles.crossedCartIcon}
          />
          <Text style={styles.noProductsText}>Không có sản phẩm nào</Text>
        </View>
      ) : (
        <FlatList
          data={filteredArtTools}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  search: {
    flexDirection: "row", // Đặt các thành phần nằm trên một hàng
    alignItems: "center", // Căn giữa theo trục dọc
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    paddingRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  picker: { flex: 1, color: "green", fontWeight: "bold" },
  itempic: { color: "green", fontWeight: "bold" },
  noProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  crossedCartIcon: {
    marginBottom: 10,
  },
  noProductsText: {
    fontSize: 18,

    textAlign: "center",
    // color: "#ccc",
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#ebf1e5",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  deal: { color: "green" },
  heartIcon: { position: "absolute", top: 10, right: 10 },

  row: {
    flex: 1,
    justifyContent: "space-between",
  },
  icon: {
    fontSize: 20,
    color: "green",
  },
});
