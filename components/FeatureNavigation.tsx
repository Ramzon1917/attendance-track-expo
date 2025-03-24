import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ClipboardList, User, FileSpreadsheet } from "lucide-react-native";

interface FeatureNavigationProps {
  onNavigate?: (screen: string) => void;
}

const FeatureNavigation = ({ onNavigate }: FeatureNavigationProps) => {
  const router = useRouter();

  const features = [
    {
      id: "attendance",
      title: "Attendance Records",
      description: "View and filter your attendance history",
      icon: <ClipboardList size={24} color="#4f46e5" />,
      route: "/attendance-records",
    },
    {
      id: "profile",
      title: "Profile Management",
      description: "Update your personal information",
      icon: <User size={24} color="#4f46e5" />,
      route: "/profile",
    },
    {
      id: "export",
      title: "Export Data",
      description: "Download attendance reports as Excel",
      icon: <FileSpreadsheet size={24} color="#4f46e5" />,
      route: "/export",
    },
  ];

  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      // Use expo-router for navigation
      router.push(route);
    }
  };

  return (
    <View className="w-full bg-white p-4 rounded-lg shadow-md">
      <Text className="text-lg font-bold mb-4 text-gray-800">Quick Access</Text>
      <View className="flex-row flex-wrap justify-between">
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            className="bg-gray-50 rounded-lg p-4 mb-3 w-[48%] shadow-sm border border-gray-100"
            onPress={() => handleNavigation(feature.route)}
          >
            <View className="items-center mb-2">{feature.icon}</View>
            <Text className="text-center font-semibold text-gray-800 mb-1">
              {feature.title}
            </Text>
            <Text className="text-center text-xs text-gray-500">
              {feature.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FeatureNavigation;
