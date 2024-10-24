// CustomProgressBar.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomProgressBar = ({ progress, percentage }) => {
  return (
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      <Text style={styles.percentageText}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
    marginRight: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FF69B4",
  },
  percentageText: {
    position: "absolute",
    right: 5,
    top: -20,
    fontSize: 12,
    color: "#555",
  },
});

export default CustomProgressBar;
