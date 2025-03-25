import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Home,
  Bell,
  User,
  ChevronRight,
  ArrowLeft,
  Menu,
} from "lucide-react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title?: string;
  breadcrumbs?: string[];
  showMenu?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

const Header = ({
  title = "TimeTrack",
  breadcrumbs = [],
  showMenu = true,
  showNotification = true,
  showProfile = true,
  onMenuPress = () => {},
  onNotificationPress = () => {},
  onProfilePress = () => {},
}: HeaderProps) => {
  const router = useRouter();

  return (
    <View className="w-full bg-white py-3 px-4 flex-row justify-between items-center border-b border-gray-200">
      <View className="flex-row items-center">
        {showMenu && (
          <TouchableOpacity
            className="mr-3 p-2 rounded-full active:bg-gray-100"
            onPress={onMenuPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {title === "TimeTrack" ? (
              <Menu size={24} color="#4f46e5" />
            ) : (
              <ArrowLeft size={24} color="#4f46e5" />
            )}
          </TouchableOpacity>
        )}
        <View className="flex-row items-center">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <View className="flex-row items-center mr-2">
              {breadcrumbs.map((crumb, index) => (
                <View key={index} className="flex-row items-center">
                  {index > 0 && (
                    <ChevronRight size={14} color="#9ca3af" className="mx-1" />
                  )}
                  <Text className="text-sm text-gray-500">{crumb}</Text>
                  {index === breadcrumbs.length - 1 && (
                    <ChevronRight size={14} color="#9ca3af" className="mx-1" />
                  )}
                </View>
              ))}
            </View>
          ) : null}
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
        </View>
      </View>

      <View className="flex-row items-center">
        {showNotification && (
          <TouchableOpacity
            className="mr-4 p-2 rounded-full active:bg-gray-100"
            onPress={onNotificationPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Bell size={22} color="#4f46e5" />
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity
            className="p-2 rounded-full active:bg-gray-100"
            onPress={onProfilePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <User size={22} color="#4f46e5" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
