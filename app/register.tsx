import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import RegisterForm from "../components/RegisterForm";

export default function RegisterScreen() {
  const router = useRouter();

  const handleRegister = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    // In a real app, you would register the user here
    console.log("Register with:", data);
    router.replace("/");
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center p-6 pt-12">
        <RegisterForm onRegister={handleRegister} />

        <View className="w-full mt-6 flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-indigo-600 font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
