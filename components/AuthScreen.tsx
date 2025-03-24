import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Clock } from "lucide-react-native";

interface AuthScreenProps {
  initialTab?: "login" | "register";
  onLogin?: (email: string, password: string) => void;
  onRegister?: (data: {
    name: string;
    email: string;
    password: string;
  }) => void;
}

const AuthScreen = ({
  initialTab = "login",
  onLogin = () => {},
  onRegister = () => {},
}: AuthScreenProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const router = useRouter();

  const handleLogin = (email: string, password: string) => {
    // For demo purposes, we'll use mock credentials if none are provided
    const demoEmail = email || "john@example.com";
    const demoPassword = password || "password123";
    onLogin(demoEmail, demoPassword);
    router.replace("/");
  };

  const handleRegister = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    // For demo purposes, we'll use mock data if none is provided
    const demoData = {
      name: data.name || "New User",
      email: data.email || "newuser@example.com",
      password: data.password || "password123",
    };
    onRegister(demoData);
    router.replace("/");
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

        <View className="w-full flex-row bg-gray-200 rounded-lg p-1 mb-6">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === "login" ? "bg-white" : "bg-transparent"}`}
            onPress={() => setActiveTab("login")}
          >
            <Text
              className={`text-center font-medium ${activeTab === "login" ? "text-indigo-600" : "text-gray-500"}`}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === "register" ? "bg-white" : "bg-transparent"}`}
            onPress={() => setActiveTab("register")}
          >
            <Text
              className={`text-center font-medium ${activeTab === "register" ? "text-indigo-600" : "text-gray-500"}`}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "login" ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <RegisterForm onRegister={handleRegister} />
        )}
      </View>
    </ScrollView>
  );
};

export default AuthScreen;
