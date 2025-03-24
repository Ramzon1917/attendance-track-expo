import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Menu, Bell, User } from "lucide-react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

const Header = ({
  title = "TimeTrack",
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
          <TouchableOpacity className="mr-3 p-1" onPress={onMenuPress}>
            <Menu size={24} color="#4f46e5" />
          </TouchableOpacity>
        )}
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
      </View>

      <View className="flex-row items-center">
        {showNotification && (
          <TouchableOpacity className="mr-4 p-1" onPress={onNotificationPress}>
            <Bell size={22} color="#4f46e5" />
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity className="p-1" onPress={onProfilePress}>
            <User size={22} color="#4f46e5" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
