import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Clock, MapPin } from "lucide-react-native";

interface TimeTrackingCardProps {
  isCheckedIn?: boolean;
  lastCheckInTime?: string;
  lastCheckInLocation?: string;
  onTimeIn?: () => void;
  onTimeOut?: () => void;
}

const TimeTrackingCard = ({
  isCheckedIn = false,
  lastCheckInTime = "08:30 AM",
  lastCheckInLocation = "Office Headquarters",
  onTimeIn = () => {},
  onTimeOut = () => {},
}: TimeTrackingCardProps) => {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

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

      <TouchableOpacity
        className={`w-full py-3 rounded-lg flex-row justify-center items-center ${isCheckedIn ? "bg-red-600" : "bg-green-600"}`}
        onPress={isCheckedIn ? onTimeOut : onTimeIn}
      >
        <Clock size={20} color="#ffffff" />
        <Text className="text-white font-semibold ml-2">
          {isCheckedIn ? "Time Out" : "Time In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimeTrackingCard;
