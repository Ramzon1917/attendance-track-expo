import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Clock, MapPin } from "lucide-react-native";
import TimeActionButton from "./TimeActionButton";

interface TimeTrackingCardProps {
  isCheckedIn?: boolean;
  lastCheckInTime?: string;
  lastCheckInLocation?: string;
  currentLocation?: string;
  locationLoading?: boolean;
  currentTime?: string;
  onTimeIn?: () => void;
  onTimeOut?: () => void;
  isLoading?: boolean;
}

const TimeTrackingCard = ({
  isCheckedIn = false,
  lastCheckInTime = "",
  lastCheckInLocation = "",
  currentLocation = "123 Main Street, Downtown, City, 12345",
  locationLoading = false,
  currentTime = "",
  onTimeIn = () => {},
  onTimeOut = () => {},
  isLoading = false,
}: TimeTrackingCardProps) => {
  // Get current date formatted
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View className="w-full bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Clock size={20} color="#4f46e5" />
          <Text className="text-lg font-semibold text-gray-800 ml-2">
            Time Tracking
          </Text>
        </View>
        <View className="bg-gray-100 px-3 py-1 rounded-full">
          <Text className="text-sm text-gray-600">{currentTime}</Text>
        </View>
      </View>

      <Text className="text-gray-500 mb-4">{currentDate}</Text>

      <View className="bg-gray-50 p-4 rounded-lg mb-4">
        <Text className="text-gray-600 mb-1">Status</Text>
        <View className="flex-row items-center">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${isCheckedIn ? "bg-green-500" : "bg-red-500"}`}
          />
          <Text className="font-medium text-gray-800">
            {isCheckedIn ? "Checked In" : "Checked Out"}
          </Text>
        </View>

        {isCheckedIn && (
          <View className="mt-3">
            <Text className="text-gray-600 mb-1">Checked in at</Text>
            <View className="flex-row items-center">
              <Clock size={16} color="#6b7280" className="mr-1" />
              <Text className="text-gray-800">{lastCheckInTime}</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <MapPin size={16} color="#6b7280" className="mr-1" />
              <Text className="text-gray-800">{lastCheckInLocation}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Current Location Section */}
      <View className="bg-gray-50 p-4 rounded-lg mb-4">
        <Text className="text-gray-600 mb-2">Current Location</Text>
        {locationLoading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#4f46e5" />
            <Text className="text-gray-500 ml-2">Detecting location...</Text>
          </View>
        ) : (
          <View className="flex-row items-start">
            <MapPin size={16} color="#4f46e5" style={{ marginTop: 2 }} />
            <View className="ml-2 flex-1">
              <Text className="text-gray-800">{currentLocation}</Text>
              <Text className="text-xs text-gray-500 mt-1">
                Location verified for attendance tracking
              </Text>
            </View>
          </View>
        )}
      </View>

      <TimeActionButton
        isCheckedIn={isCheckedIn}
        onPress={isCheckedIn ? onTimeOut : onTimeIn}
        isLoading={isLoading}
      />
    </View>
  );
};

export default TimeTrackingCard;
