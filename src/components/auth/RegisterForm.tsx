import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { User, Mail, Lock } from "lucide-react-native";

interface RegisterFormProps {
  onRegister: (data: { name: string; email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string | null;
}

const RegisterForm = ({
  onRegister,
  isLoading = false,
  error = null,
}: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="w-full">
      <View className="mb-4">
        <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3 py-2 mb-1">
          <User size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3 py-2 mb-1">
          <Mail size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View className="mb-6">
        <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3 py-2 mb-1">
          <Lock size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        className={`w-full bg-indigo-600 py-3 rounded-lg items-center ${isLoading ? "opacity-70" : ""}`}
        onPress={() => onRegister({ name, email, password })}
        disabled={isLoading}
      >
        <Text className="text-white font-semibold">
          {isLoading ? "Creating Account..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-center text-gray-500">
          By registering, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default RegisterForm;
