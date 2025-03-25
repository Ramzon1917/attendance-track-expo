import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { User, Eye, EyeOff, Mail, Lock, UserPlus } from "lucide-react-native";

interface RegisterFormProps {
  onRegister?: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const RegisterForm = ({
  onRegister = async () => {},
  isLoading = false,
  error = null,
}: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onRegister({ name, email, password });
      } catch (error) {
        // Error is handled in the parent component
      }
    }
  };

  const clearError = (field: keyof typeof formErrors) => {
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <ScrollView className="w-full max-w-[350px] bg-white rounded-lg p-6 shadow-md">
      <View className="items-center mb-6">
        <UserPlus size={40} color="#4f46e5" />
        <Text className="text-2xl font-bold mt-2 text-gray-800">
          Create Account
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-1">
          Register to track your attendance and manage your time
        </Text>
      </View>

      {error && (
        <View className="mb-4 p-3 bg-red-100 rounded-md">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      )}

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Full Name
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
          <User size={18} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="John Doe"
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearError("name");
            }}
            autoCapitalize="words"
          />
        </View>
        {formErrors.name ? (
          <Text className="text-red-500 text-xs mt-1">{formErrors.name}</Text>
        ) : null}
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Email Address
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
          <Mail size={18} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError("email");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {formErrors.email ? (
          <Text className="text-red-500 text-xs mt-1">{formErrors.email}</Text>
        ) : null}
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
          <Lock size={18} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError("password");
              if (confirmPassword) clearError("confirmPassword");
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={18} color="#6b7280" />
            ) : (
              <Eye size={18} color="#6b7280" />
            )}
          </TouchableOpacity>
        </View>
        {formErrors.password ? (
          <Text className="text-red-500 text-xs mt-1">
            {formErrors.password}
          </Text>
        ) : null}
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
          <Lock size={18} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearError("confirmPassword");
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff size={18} color="#6b7280" />
            ) : (
              <Eye size={18} color="#6b7280" />
            )}
          </TouchableOpacity>
        </View>
        {formErrors.confirmPassword ? (
          <Text className="text-red-500 text-xs mt-1">
            {formErrors.confirmPassword}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        className={`w-full py-3 rounded-md flex-row justify-center items-center ${isLoading ? "bg-indigo-400" : "bg-indigo-600"}`}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <>
            <UserPlus size={18} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Register</Text>
          </>
        )}
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 text-center mt-4">
        By registering, you agree to our Terms of Service and Privacy Policy
      </Text>
    </ScrollView>
  );
};

export default RegisterForm;
