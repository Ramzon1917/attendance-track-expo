import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import Header from "./Header";
import TimeTrackingCard from "./TimeTrackingCard";
import AttendanceSummary from "./AttendanceSummary";
import FeatureNavigation from "./FeatureNavigation";
import {
  getCurrentUser,
  createAttendanceRecord,
  getIncompleteAttendanceRecord,
  completeAttendanceRecord,
} from "../utils/localStorage";

interface DashboardProps {
  userName?: string;
  isCheckedIn?: boolean;
  lastCheckInTime?: string;
  lastCheckInLocation?: string;
  onTimeIn?: () => void;
  onTimeOut?: () => void;
}

const Dashboard = ({
  userName = "John Doe",
  isCheckedIn = false,
  lastCheckInTime = "08:30 AM",
  lastCheckInLocation = "Office Headquarters",
  onTimeIn = () => {},
  onTimeOut = () => {},
}: DashboardProps) => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<"in" | "out">(
    "in",
  );
  const [loading, setLoading] = useState(false);
  const [lastCheckInTimeState, setLastCheckInTimeState] =
    useState(lastCheckInTime);
  const [lastCheckInLocationState, setLastCheckInLocationState] =
    useState(lastCheckInLocation);

  // Get current time in 12-hour format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Update time every second
  useEffect(() => {
    setCurrentTime(getCurrentTime());

    const timeInterval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Get location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationLoading(false);
          return;
        }

        // Get initial location
        updateLocation();

        // Set up interval to update location every 30 seconds
        const locationInterval = setInterval(updateLocation, 30000);
        return () => clearInterval(locationInterval);
      } catch (error) {
        setLocationLoading(false);
      }
    })();
  }, []);

  const updateLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await Location.getCurrentPositionAsync({});

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        // Prioritize street address format
        const streetAddress = [
          address.street,
          address.city,
          address.region,
          address.postalCode,
        ]
          .filter(Boolean)
          .join(", ");

        setCurrentLocation(streetAddress || "Unknown location");
      } else {
        setCurrentLocation(
          `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`,
        );
      }

      setLocationLoading(false);
    } catch (error) {
      setLocationLoading(false);
    }
  };

  const promptTimeAction = (action: "in" | "out") => {
    setConfirmationAction(action);
    setShowConfirmation(true);
  };

  const handleTimeIn = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) return;

      // Create new attendance record
      const record = await createAttendanceRecord(user.id, currentLocation);
      setLastCheckInTimeState(record.timeIn);
      setLastCheckInLocationState(record.location);
      onTimeIn();
    } catch (error) {
      console.error("Error clocking in:", error);
      Alert.alert("Error", "Failed to clock in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeOut = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) return;

      // Find incomplete record and complete it
      const incompleteRecord = await getIncompleteAttendanceRecord(user.id);
      if (incompleteRecord) {
        await completeAttendanceRecord(incompleteRecord.id, currentLocation);
      }
      onTimeOut();
    } catch (error) {
      console.error("Error clocking out:", error);
      Alert.alert("Error", "Failed to clock out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = () => {
    // Open drawer/menu
    console.log("Menu pressed");
  };

  const handleNotificationPress = () => {
    // Open notifications
    console.log("Notifications pressed");
  };

  const handleProfilePress = () => {
    // Navigate to profile
    router.push("/profile");
  };

  const handleNavigate = (screen: string) => {
    router.push(screen);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-800">
            Hello, {userName}
          </Text>
          <Text className="text-gray-500">Welcome back to your dashboard</Text>
        </View>

        <View className="mb-6">
          <TimeTrackingCard
            isCheckedIn={isCheckedIn}
            lastCheckInTime={lastCheckInTimeState}
            lastCheckInLocation={lastCheckInLocationState}
            currentLocation={currentLocation}
            locationLoading={locationLoading}
            currentTime={currentTime}
            onTimeIn={() => promptTimeAction("in")}
            onTimeOut={() => promptTimeAction("out")}
            isLoading={loading}
          />
        </View>

        <View className="mb-6">
          <AttendanceSummary />
        </View>

        <View className="mb-6">
          <FeatureNavigation onNavigate={handleNavigate} />
        </View>

        <TouchableOpacity
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6"
          onPress={() => router.push("/time-tracking")}
        >
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Time Tracking
          </Text>
          <Text className="text-gray-600">
            View detailed time tracking history and manage your attendance
            records
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-4/5 max-w-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              {confirmationAction === "in"
                ? "Clock In Confirmation"
                : "Clock Out Confirmation"}
            </Text>

            <Text className="text-gray-600 mb-6">
              {confirmationAction === "in"
                ? `Are you sure you want to clock in at ${currentTime} at ${currentLocation}?`
                : "Are you sure you want to clock out now?"}
            </Text>

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                className="px-4 py-2 rounded-md bg-gray-200"
                onPress={() => setShowConfirmation(false)}
              >
                <Text className="text-gray-800">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-4 py-2 rounded-md ${confirmationAction === "in" ? "bg-green-600" : "bg-red-600"}`}
                onPress={() => {
                  setShowConfirmation(false);
                  if (confirmationAction === "in") {
                    handleTimeIn();
                  } else {
                    handleTimeOut();
                  }
                }}
              >
                <Text className="text-white">
                  {confirmationAction === "in" ? "Clock In" : "Clock Out"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;
