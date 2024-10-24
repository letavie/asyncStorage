// screens/DetailScreen.js
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesContext } from "../contexts/FavoritesContext";
import CustomProgressBar from "../components/CustomProgressBar"; // Đảm bảo đường dẫn đúng

export default function DetailScreen({ route }) {
  const { item } = route.params; // Lấy item từ route params
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]); // Lưu trữ đánh giá cho sản phẩm hiện tại
  const favorite = isFavorite(item.id);

  // Tính toán sale price
  const salePrice =
    item.limitedTimeDeal > 0
      ? (item.price - item.price * item.limitedTimeDeal).toFixed(2)
      : item.price.toFixed(2);

  // Lấy đánh giá từ AsyncStorage khi khởi động
  useEffect(() => {
    loadReviews();
  }, [item.id]);

  const loadReviews = async () => {
    try {
      const storedReviews = await AsyncStorage.getItem(`reviews_${item.id}`);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        // Nếu chưa có đánh giá nào, thêm đánh giá mặc định (nếu cần)
        const initialReviews = [
          {
            author: "User1",
            text: "This is a great product!",
            rating: 5,
            date: "2023-10-23",
          },
          {
            author: "User2",
            text: "Very useful and well-made.",
            rating: 4,
            date: "2023-10-22",
          },
        ];
        setReviews(initialReviews);
        await AsyncStorage.setItem(
          `reviews_${item.id}`,
          JSON.stringify(initialReviews)
        );
      }
    } catch (e) {
      console.error("Failed to load reviews.", e);
    }
  };

  const saveReviews = async (newReviews) => {
    try {
      await AsyncStorage.setItem(
        `reviews_${item.id}`,
        JSON.stringify(newReviews)
      );
    } catch (e) {
      console.error("Failed to save reviews.", e);
    }
  };

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const submitReview = async () => {
    if (comment.trim() === "" || rating === 0) {
      Alert.alert("Error", "nhập đầy đủ cmt vs đánh giá trước khi gửi");
      return;
    }

    const newReview = {
      author: "Việt lus",
      text: comment,
      rating,
      date: new Date().toLocaleString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    await saveReviews(updatedReviews); // Lưu đánh giá vào AsyncStorage
    setComment("");
    setRating(0);

    Alert.alert("cảm ơn đã đánh giá");
  };

  // Tính toán đánh giá
  const totalReviews = reviews.length;
  const ratingCounts = [0, 0, 0, 0, 0];

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(
          1
        )
      : "k có đánh giá";

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.artName}</Text>
      <Pressable onPress={toggleFavorite} style={styles.favoriteIcon}>
        <Icon name={favorite ? "heart" : "heart-o"} size={30} color="#FF69B4" />
      </Pressable>

      {/* Hiển thị giá */}
      <View style={styles.priceContainer}>
        {item.limitedTimeDeal > 0 ? (
          <>
            <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.salePrice}>${salePrice}</Text>
          </>
        ) : (
          <Text style={styles.normalPrice}>${item.price.toFixed(2)}</Text>
        )}
      </View>

      {item.limitedTimeDeal > 0 && (
        <Text style={styles.deal}>
          Deal: {(item.limitedTimeDeal * 100).toFixed(0)}%
        </Text>
      )}
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackTitle}>Ratings & Reviews</Text>
        <Text style={styles.averageRating}>{averageRating} out of 5</Text>

        {totalReviews > 0 && (
          <View>
            {Array.from({ length: 5 }, (_, index) => (
              <View key={index} style={styles.ratingBar}>
                <Text style={styles.ratingLabel}>
                  {index + 1} <Icon name="star" size={20} color="#FF69B4" />
                </Text>
                <CustomProgressBar
                  progress={ratingCounts[index] / totalReviews || 0}
                  percentage={(
                    (ratingCounts[index] / totalReviews) *
                    100
                  ).toFixed(0)}
                />
                <Text style={styles.reviewCount}>
                  {ratingCounts[index]}{" "}
                  {ratingCounts[index] === 1 ? "review" : "reviews"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Form nhập bình luận */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Leave a Comment</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Enter your comment"
            value={comment}
            onChangeText={setComment}
          />
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Icon
                  name={star <= rating ? "star" : "star-o"}
                  size={30}
                  color="#FF69B4"
                />
              </Pressable>
            ))}
          </View>
          <TouchableOpacity onPress={submitReview} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách bình luận */}
        {reviews.map((review, index) => (
          <View key={index} style={styles.comment}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{review.author}</Text>
              <Text style={styles.commentDate}>{review.date}</Text>
            </View>
            <Text style={styles.commentText}>{review.text}</Text>
            <View style={styles.commentStars}>
              {Array.from({ length: 5 }, (_, i) => (
                <Icon
                  key={i}
                  name={i < review.rating ? "star" : "star-o"}
                  size={15}
                  color="gold"
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  image: { width: "100%", height: 200, resizeMode: "contain" },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "gray",
    fontSize: 18,
    marginRight: 10,
  },
  salePrice: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
  },
  normalPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deal: { color: "green", fontSize: 18, marginBottom: 10 },
  description: { fontSize: 16, marginVertical: 10 },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  feedbackSection: { marginTop: 20 },
  feedbackTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  averageRating: { fontSize: 18, marginBottom: 10 },
  ratingBar: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  ratingLabel: { width: 60, fontSize: 16 },
  reviewCount: { marginLeft: 10, fontSize: 14, color: "#555" },
  commentSection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  commentInput: {
    borderColor: "#FF69B4",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#FF69B4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  comment: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentAuthor: { fontWeight: "bold" },
  commentDate: { fontSize: 12, color: "gray" },
  commentText: { fontStyle: "italic", marginBottom: 5 },
  commentStars: { flexDirection: "row" },
});
