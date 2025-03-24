import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { User, Mail, Phone, MapPin, Lock, LogOut } from "lucide-react-native";
import Header from "../components/Header";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Profile" onMenuPress={() => router.back()} />

      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-indigo-100 items-center justify-center mb-3">
            <User size={40} color="#4f46e5" />
          </View>
          <Text className="text-xl font-bold text-gray-800">John Doe</Text>
          <Text className="text-gray-500">Employee ID: EMP12345</Text>
        </View>

        <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Full Name
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <User size={18} color="#6b7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                value="John Doe"
                editable={false}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Email Address
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <Mail size={18} color="#6b7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                value="john.doe@example.com"
                editable={false}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <Phone size={18} color="#6b7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                value="+1 (555) 123-4567"
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Office Location
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <MapPin size={18} color="#6b7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                value="123 Business Park, New York, NY"
                editable={false}
              />
            </View>
          </View>
        </View>

        <View className="mb-6">
          <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Lock size={20} color="#4f46e5" />
              <Text className="ml-3 text-gray-800 font-medium">
                Change Password
              </Text>
            </View>
            <Text className="text-indigo-600">Change</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-red-50 p-4 rounded-lg mb-6 flex-row items-center justify-center"
          onPress={() => router.replace("/login")}
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="ml-2 text-red-600 font-medium">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
