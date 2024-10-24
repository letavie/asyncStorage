import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import DetailScreen from "../screens/DetailScreen";
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ebf1e5" }, // Đặt màu nền cho tiêu đề
        headerTintColor: "#000", // Màu chữ trên tiêu đề
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Detail" }}
      />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ebf1e5" }, // Đặt màu nền cho tiêu đề
        headerTintColor: "#000", // Màu chữ trên tiêu đề
      }}
    >
      <Stack.Screen
        name="FavoritesMain"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Detail" }}
      />
    </Stack.Navigator>
  );
}

// Hàm quản lý icon và màu sắc
const getTabBarOptions = (routeName, focused) => {
  let iconName, color;

  switch (routeName) {
    case "Home":
      iconName = "home";
      color = focused ? "#4CAF50" : "#B0B0B0";
      break;
    case "Favorites":
      iconName = "heart";
      color = focused ? "#FF69B4" : "#B0B0B0";
      break;
    default:
      iconName = "";
      color = "#B0B0B0";
      break;
  }

  return { iconName, color };
};

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          const { iconName, color } = getTabBarOptions(route.name, focused);
          return <Icon name={iconName} size={size} style={{ color }} />;
        },
        tabBarLabel: ({ focused }) => {
          const { color } = getTabBarOptions(route.name, focused);
          return <Text style={{ color, fontSize: 12 }}>{route.name}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ unmountOnBlur: true, headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{ unmountOnBlur: true, headerShown: false }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  backgounds: {
    backgroundColor: "#ebf1e5",
  },
  favorites: {
    color: "#FF69B4",
  },
});
