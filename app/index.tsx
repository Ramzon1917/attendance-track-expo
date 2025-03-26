import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Dashboard from "../components/Dashboard";
import AuthScreen from "../components/AuthScreen";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  getIncompleteAttendanceRecord,
  createAttendanceRecord,
  completeAttendanceRecord,
  User,
} from "../utils/localStorage";

/**
 * Main HomeScreen component that handles authentication and renders the appropriate screen
 */
export default function HomeScreen() {
  const router = useRouter();

  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check login status on app load and set initial state
   */
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          await checkAttendanceStatus(user.id);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  /**
   * Check if user has an incomplete attendance record
   */
  const checkAttendanceStatus = async (userId: number) => {
    try {
      const incompleteRecord = await getIncompleteAttendanceRecord(userId);
      setIsCheckedIn(!!incompleteRecord);
    } catch (error) {
      console.error("Error checking attendance status:", error);
    }
  };

  /**
   * Handle user login
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await loginUser(email, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
      await checkAttendanceStatus(user.id);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user registration
   */
  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const newUser = await registerUser(data);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle time in action from dashboard
   */
  const handleTimeIn = async () => {
    try {
      if (!currentUser) return;

      // Create attendance record
      await createAttendanceRecord(currentUser.id, "Current Location");
      setIsCheckedIn(true);
    } catch (error) {
      console.error("Error handling time in:", error);
    }
  };

  /**
   * Handle time out action from dashboard
   */
  const handleTimeOut = async () => {
    try {
      if (!currentUser) return;

      // Find and complete the active attendance record
      const incompleteRecord = await getIncompleteAttendanceRecord(
        currentUser.id,
      );
      if (incompleteRecord) {
        await completeAttendanceRecord(incompleteRecord.id, "Current Location");
        setIsCheckedIn(false);
      }
    } catch (error) {
      console.error("Error handling time out:", error);
    }
  };

  /**
   * Render loading indicator while checking authentication
   */
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  /**
   * Render Dashboard for authenticated users, otherwise show AuthScreen
   */
  return (
    <View className="flex-1">
      {isLoggedIn && currentUser ? (
        <Dashboard
          userName={currentUser.name}
          userId={currentUser.id}
          isCheckedIn={isCheckedIn}
          onTimeIn={handleTimeIn}
          onTimeOut={handleTimeOut}
          currentUser={currentUser}
        />
      ) : (
        <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </View>
  );
}
