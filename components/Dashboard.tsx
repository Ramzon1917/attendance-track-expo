import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Header from "./Header";
import TimeTrackingCard from "./TimeTrackingCard";
import AttendanceSummary from "./AttendanceSummary";
import FeatureNavigation from "./FeatureNavigation";

interface DashboardProps {
  userName?: string;
  isCheckedIn?: boolean;
  lastCheckInTime?: string;
  lastCheckInLocation?: string;
  onTimeIn?: () => void;
  onTimeOut?: () => void;
}

const Dashboard = ({
  userName = "John Doe",
  isCheckedIn = false,
  lastCheckInTime = "08:30 AM",
  lastCheckInLocation = "Office Headquarters",
  onTimeIn = () => {},
  onTimeOut = () => {},
}: DashboardProps) => {
  const router = useRouter();

  const handleMenuPress = () => {
    // Open drawer/menu
    console.log("Menu pressed");
  };

  const handleNotificationPress = () => {
    // Open notifications
    console.log("Notifications pressed");
  };

  const handleProfilePress = () => {
    // Navigate to profile
    router.push("/profile");
  };

  const handleNavigate = (screen: string) => {
    router.push(screen);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-800">
            Hello, {userName}
          </Text>
          <Text className="text-gray-500">Welcome back to your dashboard</Text>
        </View>

        <View className="mb-6">
          <TimeTrackingCard
            isCheckedIn={isCheckedIn}
            lastCheckInTime={lastCheckInTime}
            lastCheckInLocation={lastCheckInLocation}
            onTimeIn={onTimeIn}
            onTimeOut={onTimeOut}
          />
        </View>

        <View className="mb-6">
          <AttendanceSummary />
        </View>

        <View className="mb-6">
          <FeatureNavigation onNavigate={handleNavigate} />
        </View>

        <TouchableOpacity
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6"
          onPress={() => router.push("/time-tracking")}
        >
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Time Tracking
          </Text>
          <Text className="text-gray-600">
            View detailed time tracking history and manage your attendance
            records
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
