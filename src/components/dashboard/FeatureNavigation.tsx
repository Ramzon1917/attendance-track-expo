import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Clock,
  CalendarCheck,
  FileSpreadsheet,
  Settings,
} from "lucide-react-native";

interface FeatureNavigationProps {
  onNavigate: (screen: string) => void;
}

const FeatureNavigation = ({ onNavigate }: FeatureNavigationProps) => {
  const features = [
    {
      id: "time-tracking",
      name: "Time Tracking",
      icon: <Clock size={24} color="#4f46e5" />,
      route: "/time-tracking",
    },
    {
      id: "attendance-records",
      name: "Attendance Records",
      icon: <CalendarCheck size={24} color="#0891b2" />,
      route: "/attendance-records",
    },
    {
      id: "export",
      name: "Export Data",
      icon: <FileSpreadsheet size={24} color="#059669" />,
      route: "/export",
    },
    {
      id: "profile",
      name: "Profile",
      icon: <Settings size={24} color="#9333ea" />,
      route: "/profile",
    },
  ];

  return (
    <View className="w-full">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Quick Access
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            className="bg-white rounded-xl p-4 mb-4 w-[48%] items-center shadow-sm border border-gray-100"
            onPress={() => onNavigate(feature.route)}
          >
            <View className="bg-gray-50 p-3 rounded-full mb-2">
              {feature.icon}
            </View>
            <Text className="text-gray-800 font-medium">{feature.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FeatureNavigation;
