import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  LogOut,
  Check,
  X,
} from "lucide-react-native";
import Header from "../components/Header";
import {
  getCurrentUser,
  updateUserProfile,
  logoutUser,
  User as UserType,
} from "../utils/localStorage";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
        });
      } else {
        // No user found, redirect to login
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const updatedUser = await updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
      });

      setUser(updatedUser);
      setEditMode(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Reset errors
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    let hasError = false;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Validate current password
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
      hasError = true;
    } else if (user && passwordData.currentPassword !== user.password) {
      errors.currentPassword = "Current password is incorrect";
      hasError = true;
    }

    // Validate new password
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
      hasError = true;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
      hasError = true;
    }

    // Validate confirm password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setIsSaving(true);
      if (user) {
        await updateUserProfile(user.id, {
          password: passwordData.newPassword,
        });

        // Update local user state
        setUser((prev) =>
          prev ? { ...prev, password: passwordData.newPassword } : null,
        );

        // Reset form and close modal
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordModal(false);

        Alert.alert("Success", "Password changed successfully");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Profile" onMenuPress={() => router.back()} />

      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-indigo-100 items-center justify-center mb-3">
            <User size={40} color="#4f46e5" />
          </View>
          <Text className="text-xl font-bold text-gray-800">{user?.name}</Text>
          <Text className="text-gray-500">Employee ID: EMP{user?.id}</Text>
        </View>

        {/* Edit/Save Profile Button */}
        <View className="flex-row justify-end mb-4">
          {editMode ? (
            <View className="flex-row">
              <TouchableOpacity
                className="bg-gray-200 p-2 rounded-md mr-2 flex-row items-center"
                onPress={() => {
                  setEditMode(false);
                  // Reset form data to original user data
                  if (user) {
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      location: user.location || "",
                    });
                  }
                }}
              >
                <X size={16} color="#64748b" />
                <Text className="ml-1 text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-indigo-600 p-2 rounded-md flex-row items-center"
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Check size={16} color="#ffffff" />
                    <Text className="ml-1 text-white">Save</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-indigo-100 p-2 rounded-md"
              onPress={() => setEditMode(true)}
            >
              <Text className="text-indigo-700">Edit Profile</Text>
            </TouchableOpacity>
          )}
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
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                editable={editMode}
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
                value={formData.email}
                editable={false} // Email cannot be changed
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
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                editable={editMode}
                placeholder="Add phone number"
                keyboardType="phone-pad"
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
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                editable={editMode}
                placeholder="Add office location"
              />
            </View>
          </View>
        </View>

        <View className="mb-6">
          <TouchableOpacity
            className="bg-white p-4 rounded-lg shadow-sm flex-row items-center justify-between"
            onPress={() => setShowPasswordModal(true)}
          >
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
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="ml-2 text-red-600 font-medium">Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPasswordModal}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-4/5 max-w-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Change Password
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setPasswordErrors({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Current Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <Lock size={18} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 text-base text-gray-800"
                  value={passwordData.currentPassword}
                  onChangeText={(text) =>
                    setPasswordData({ ...passwordData, currentPassword: text })
                  }
                  secureTextEntry
                  placeholder="Enter current password"
                />
              </View>
              {passwordErrors.currentPassword ? (
                <Text className="text-red-500 text-xs mt-1">
                  {passwordErrors.currentPassword}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                New Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <Lock size={18} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 text-base text-gray-800"
                  value={passwordData.newPassword}
                  onChangeText={(text) =>
                    setPasswordData({ ...passwordData, newPassword: text })
                  }
                  secureTextEntry
                  placeholder="Enter new password"
                />
              </View>
              {passwordErrors.newPassword ? (
                <Text className="text-red-500 text-xs mt-1">
                  {passwordErrors.newPassword}
                </Text>
              ) : null}
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                <Lock size={18} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 text-base text-gray-800"
                  value={passwordData.confirmPassword}
                  onChangeText={(text) =>
                    setPasswordData({ ...passwordData, confirmPassword: text })
                  }
                  secureTextEntry
                  placeholder="Confirm new password"
                />
              </View>
              {passwordErrors.confirmPassword ? (
                <Text className="text-red-500 text-xs mt-1">
                  {passwordErrors.confirmPassword}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              className="bg-indigo-600 p-3 rounded-md items-center"
              onPress={handleChangePassword}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-medium">Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
