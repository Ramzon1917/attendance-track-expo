import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Menu, Bell, User, ChevronLeft } from "lucide-react-native";

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
  title,
  showMenu = true,
  showNotification = true,
  showProfile = true,
  onMenuPress = () => {},
  onNotificationPress = () => {},
  onProfilePress = () => {},
}: HeaderProps) => {
  return (
    <View className="bg-white px-4 py-3 flex-row justify-between items-center shadow-sm">
      {showMenu && (
        <TouchableOpacity
          onPress={onMenuPress}
          className="p-2 rounded-full bg-gray-100"
        >
          {title ? (
            <ChevronLeft size={20} color="#4b5563" />
          ) : (
            <Menu size={20} color="#4b5563" />
          )}
        </TouchableOpacity>
      )}

      {title ? (
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      ) : (
        <View />
      )}

      <View className="flex-row items-center">
        {showNotification && (
          <TouchableOpacity
            onPress={onNotificationPress}
            className="p-2 rounded-full bg-gray-100 mr-2"
          >
            <Bell size={20} color="#4b5563" />
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity
            onPress={onProfilePress}
            className="p-2 rounded-full bg-gray-100"
          >
            <User size={20} color="#4b5563" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
