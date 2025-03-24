import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import LoginForm from "../components/LoginForm";
import { Clock } from "lucide-react-native";

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials here
    console.log("Login with:", email, password);
    router.replace("/");
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log("Forgot password");
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center p-6 pt-12">
        <View className="w-full items-center mb-8">
          <View className="bg-indigo-100 p-4 rounded-full mb-4">
            <Clock size={40} color="#4f46e5" />
          </View>
          <Text className="text-3xl font-bold text-gray-800">TimeTrack</Text>
          <Text className="text-base text-gray-500 text-center mt-2">
            Track your attendance with ease and precision
          </Text>
        </View>

        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
        />

        <View className="w-full mt-6 flex-row justify-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text className="text-indigo-600 font-semibold">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
