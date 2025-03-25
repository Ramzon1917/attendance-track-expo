import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Clock } from "lucide-react-native";

interface TimeActionButtonProps {
  isCheckedIn?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const TimeActionButton = ({
  isCheckedIn = false,
  onPress = () => {},
  isLoading = false,
  disabled = false,
  fullWidth = true,
}: TimeActionButtonProps) => {
  return (
    <TouchableOpacity
      className={`py-3 ${fullWidth ? "w-full" : "px-6"} rounded-lg flex-row justify-center items-center ${disabled ? "opacity-50" : "opacity-100"} ${isCheckedIn ? "bg-red-600" : "bg-green-600"}`}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          <Clock size={20} color="#ffffff" />
          <Text className="text-white font-semibold ml-2">
            {isCheckedIn ? "Time Out" : "Time In"}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default TimeActionButton;
