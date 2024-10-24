// import React, { useContext } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   Pressable,
//   StyleSheet,
// } from "react-native";
// import { FavoritesContext } from "../contexts/FavoritesContext";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { useNavigation } from "@react-navigation/native";

// export default function FavoritesScreen() {
//   const { favorites, removeFavorite, clearFavorites } =
//     useContext(FavoritesContext);
//   const navigation = useNavigation();

//   const renderItem = ({ item }) => {
//     const favorite = isFavorite(item.id);

//     // Tính toán sale price
//     const salePrice =
//       item.limitedTimeDeal > 0
//         ? (item.price - item.price * item.limitedTimeDeal).toFixed(2)
//         : item.price.toFixed(2);

//     return (
//       <View style={styles.itemContainer}>
//         <Pressable onPress={() => navigation.navigate("Detail", { item })}>
//           <Image source={{ uri: item.image }} style={styles.image} />
//           <Text style={styles.title}>{item.artName}</Text>
//           <View style={styles.priceContainer}>
//             {item.limitedTimeDeal > 0 ? (
//               <>
//                 <Text style={styles.originalPrice}>
//                   ${item.price.toFixed(2)}
//                 </Text>
//                 <Text style={styles.salePrice}>${salePrice}</Text>
//               </>
//             ) : (
//               <Text style={styles.normalPrice}>${item.price.toFixed(2)}</Text>
//             )}
//           </View>
//           {item.limitedTimeDeal > 0 && (
//             <Text style={styles.deal}>
//               Deal: {(item.limitedTimeDeal * 100).toFixed(0)}%
//             </Text>
//           )}
//         </Pressable>
//         <Pressable
//           onPress={() =>
//             favorite ? removeFavorite(item.id) : addFavorite(item)
//           }
//           style={styles.heartIcon}
//         >
//           <Icon
//             name={favorite ? "heart" : "heart-o"}
//             size={24}
//             color="#FF69B4"
//           />
//         </Pressable>
//       </View>
//     );
//   };

//   // Helper function to check if item is favorite
//   const isFavorite = (id) => {
//     return favorites.some((fav) => fav.id === id);
//   };

//   return (
//     <View style={styles.container}>
//       {favorites.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Icon name="heart-o" size={50} color="#ccc" />
//           <Text style={styles.emptyText}>Không có sản phẩm yêu thích</Text>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={favorites}
//             renderItem={renderItem}
//             keyExtractor={(item) => item.id}
//             numColumns={2}
//             columnWrapperStyle={styles.row}
//           />
//           <Pressable style={styles.clearButton} onPress={clearFavorites}>
//             <Text style={styles.clearButtonText}>Clear All Favorites</Text>
//           </Pressable>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10 },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: { marginTop: 10, fontSize: 18, color: "#555" },
//   row: {
//     flex: 1,
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   itemContainer: {
//     width: "48%",
//     backgroundColor: "#ebf1e5",
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     position: "relative",
//   },
//   image: { width: 100, height: 100, marginBottom: 10, borderRadius: 10 },
//   title: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
//   priceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   originalPrice: {
//     textDecorationLine: "line-through",
//     color: "gray",
//     fontSize: 14,
//     marginRight: 5,
//   },
//   salePrice: {
//     color: "red",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   normalPrice: {
//     fontWeight: "bold",
//     color: "black",
//     fontSize: 16,
//   },
//   deal: { color: "green", fontSize: 14, marginTop: 5 },
//   heartIcon: { position: "absolute", top: 10, right: 10 },
//   clearButton: {
//     backgroundColor: "#FF69B4",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   clearButtonText: { color: "#fff", fontSize: 16 },
// });
import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { FavoritesContext } from "../contexts/FavoritesContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function FavoritesScreen() {
  const { favorites, removeFavorite, clearFavorites } =
    useContext(FavoritesContext);
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => navigation.navigate("Detail", { item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.title}>{item.artName}</Text>
        <Text>Price: ${item.price}</Text>
      </View>
      <Pressable
        onPress={() => removeFavorite(item.id)}
        style={styles.removeIcon}
      >
        <Icon name="heart" size={24} color="#FF69B4" />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="heart-o" size={50} color="#ccc" />
          <Text style={styles.emptyText}>Không có sản phẩm yêu thích</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
          <Pressable style={styles.clearButton} onPress={clearFavorites}>
            <Text style={styles.clearButtonText}>Clear All Favorites</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { marginTop: 10, fontSize: 18, color: "#555" },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemContainer: {
    width: "48%",
    backgroundColor: "#ebf1e5",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    position: "relative",
  },
  image: { width: 100, height: 100, marginBottom: 10 },
  itemInfo: {
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  removeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  clearButton: {
    backgroundColor: "#FF69B4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  clearButtonText: { color: "#fff", fontSize: 16 },
});
