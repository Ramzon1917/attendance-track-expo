import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
}

const LoginForm = ({
  onLogin = (email, password) => {
    console.log("Login attempted with:", email, password);
    Alert.alert("Login", "Login functionality not implemented yet");
  },
  onForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Forgot password functionality not implemented yet",
    );
  },
  isLoading = false,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }
    onLogin(email, password);
  };

  return (
    <View className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
      <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
        Login
      </Text>

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
        <View className="relative">
          <View className="absolute left-3 top-3">
            <Mail size={20} color="#6B7280" />
          </View>
          <TextInput
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 pl-10"
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      {/* Password Input */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
        <View className="relative">
          <View className="absolute left-3 top-3">
            <Lock size={20} color="#6B7280" />
          </View>
          <TextInput
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 pl-10 pr-10"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color="#6B7280" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Link */}
      <TouchableOpacity className="mb-6" onPress={onForgotPassword}>
        <Text className="text-sm text-blue-600 hover:underline text-right">
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        className={`w-full flex-row justify-center items-center py-2.5 px-5 rounded-lg ${isLoading ? "bg-blue-400" : "bg-blue-600"}`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text className="text-white font-medium text-center">Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
