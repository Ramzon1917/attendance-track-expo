import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Dashboard from "../components/Dashboard";
import AuthScreen from "../components/AuthScreen";

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Mock users for demo purposes
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex@example.com",
      password: "password123",
    },
  ];

  const [currentUser, setCurrentUser] = useState(mockUsers[0]);

  // Simulate checking login status
  useEffect(() => {
    // For demo purposes, we'll set the user as logged in
    const checkLoginStatus = setTimeout(() => {
      setIsLoggedIn(true);
    }, 500);

    return () => clearTimeout(checkLoginStatus);
  }, []);

  const handleLogin = (email: string, password: string) => {
    console.log("Login with:", email, password);
    // Find user with matching credentials
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    } else {
      // For demo, always log in with the first user if credentials don't match
      setCurrentUser(mockUsers[0]);
      setIsLoggedIn(true);
    }
  };

  const handleRegister = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log("Register with:", data);
    // Create a new mock user with the provided data
    const newUser = {
      id: mockUsers.length + 1,
      ...data,
    };
    // For demo purposes, we'll just set the current user
    setCurrentUser(newUser);
    setIsLoggedIn(true);
  };

  const handleTimeIn = () => {
    setIsCheckedIn(true);
  };

  const handleTimeOut = () => {
    setIsCheckedIn(false);
  };

  return (
    <View className="flex-1">
      {isLoggedIn ? (
        <Dashboard
          userName={currentUser.name}
          isCheckedIn={isCheckedIn}
          onTimeIn={handleTimeIn}
          onTimeOut={handleTimeOut}
        />
      ) : (
        <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </View>
  );
}
