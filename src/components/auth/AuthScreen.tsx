import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Clock } from "lucide-react-native";

interface AuthScreenProps {
  initialTab?: "login" | "register";
  onLogin?: (email: string, password: string) => Promise<void>;
  onRegister?: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

const AuthScreen = ({
  initialTab = "login",
  onLogin = async () => {},
  onRegister = async () => {},
}: AuthScreenProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onLogin(email, password);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    if (!data.name || !data.email || !data.password) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onRegister(data);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <View className="w-full bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}

        <View className="w-full flex-row bg-gray-200 rounded-lg p-1 mb-6">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === "login" ? "bg-white" : "bg-transparent"}`}
            onPress={() => {
              setActiveTab("login");
              setError(null);
            }}
          >
            <Text
              className={`text-center font-medium ${activeTab === "login" ? "text-indigo-600" : "text-gray-500"}`}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === "register" ? "bg-white" : "bg-transparent"}`}
            onPress={() => {
              setActiveTab("register");
              setError(null);
            }}
          >
            <Text
              className={`text-center font-medium ${activeTab === "register" ? "text-indigo-600" : "text-gray-500"}`}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "login" ? (
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            isLoading={isLoading}
            error={error}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default AuthScreen;
