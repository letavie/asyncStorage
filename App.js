import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation";
import { FavoritesProvider } from "./src/contexts/FavoritesContext";
import Header from "./src/components/Header";
export default function App() {
  return (
    <FavoritesProvider>
      <Header />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </FavoritesProvider>
  );
}
