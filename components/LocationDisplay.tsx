import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { MapPin } from "lucide-react-native";

interface LocationDisplayProps {
  address?: string;
  isLoading?: boolean;
  error?: string | null;
}

const LocationDisplay = ({
  address = "",
  isLoading = false,
  error = null,
}: LocationDisplayProps) => {
  // In a real app, this would use the device's location services
  const [mockAddress, setMockAddress] = useState("");

  useEffect(() => {
    // Simulate fetching location
    const timer = setTimeout(() => {
      if (!address) {
        setMockAddress("123 Business Park, New York, NY 10001");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [address]);

  const displayAddress = address || mockAddress;

  if (isLoading) {
    return (
      <View className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <Text className="text-gray-700 font-medium mb-2">Current Location</Text>
        <View className="flex-row items-center justify-center py-3">
          <ActivityIndicator size="small" color="#4f46e5" />
          <Text className="text-gray-500 ml-2">Detecting location...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <Text className="text-gray-700 font-medium mb-2">Current Location</Text>
        <View className="bg-red-50 p-3 rounded-md">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <Text className="text-gray-700 font-medium mb-2">Current Location</Text>
      <View className="flex-row items-start">
        <MapPin size={20} color="#4f46e5" style={{ marginTop: 2 }} />
        <View className="ml-2 flex-1">
          <Text className="text-gray-800">{displayAddress}</Text>
          <Text className="text-xs text-gray-500 mt-1">
            Location verified for attendance tracking
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LocationDisplay;
