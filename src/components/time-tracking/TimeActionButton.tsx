import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface TimeActionButtonProps {
  isCheckedIn?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
}

const TimeActionButton = ({
  isCheckedIn = false,
  onPress = () => {},
  isLoading = false,
}: TimeActionButtonProps) => {
  return (
    <TouchableOpacity
      className={`w-full py-3 rounded-lg flex-row justify-center items-center ${isCheckedIn ? "bg-red-600" : "bg-green-600"} ${isLoading ? "opacity-70" : ""}`}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text className="text-white font-semibold">
          {isCheckedIn ? "Clock Out" : "Clock In"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default TimeActionButton;
