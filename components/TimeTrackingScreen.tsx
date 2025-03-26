import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import Header from "./Header";
import TimeTrackingCard from "./TimeTrackingCard";
import {
  getCurrentUser,
  createAttendanceRecord,
  getIncompleteAttendanceRecord,
  completeAttendanceRecord,
} from "../utils/localStorage";

/**
 * Props for the TimeTrackingScreen component
 */
interface TimeTrackingScreenProps {
  /** Initial check-in state */
  isCheckedIn?: boolean;
  /** User ID for attendance tracking */
  userId?: number;
}

/**
 * Time format options for consistent time display
 */
const TIME_FORMAT_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
} as const;

/**
 * TimeTrackingScreen component for handling time tracking functionality
 */
const TimeTrackingScreen = ({
  isCheckedIn: initialIsCheckedIn = false,
  userId = 0,
}: TimeTrackingScreenProps) => {
  const router = useRouter();

  // State management
  const [loading, setLoading] = useState(false);
  const [checkedInState, setCheckedInState] = useState(initialIsCheckedIn);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [lastCheckInTime, setLastCheckInTime] = useState("");
  const [lastCheckInLocation, setLastCheckInLocation] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<"in" | "out">(
    "in",
  );
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Refs for interval cleanup
  const timeInterval = useRef<NodeJS.Timeout | null>(null);

  /**
   * Get current time in 12-hour format
   */
  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", TIME_FORMAT_OPTIONS);
  };

  /**
   * Load initial attendance state from storage
   */
  useEffect(() => {
    const loadAttendanceState = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.replace("/login");
          return;
        }

        // Check for incomplete attendance record
        const incompleteRecord = await getIncompleteAttendanceRecord(user.id);
        if (incompleteRecord) {
          setCheckedInState(true);
          setLastCheckInTime(incompleteRecord.timeIn);
          setLastCheckInLocation(incompleteRecord.location);
          setCurrentRecordId(incompleteRecord.id);
        } else {
          resetAttendanceState();
        }
      } catch (error) {
        console.error("Error loading attendance state:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAttendanceState();
  }, [router]);

  /**
   * Reset attendance state values
   */
  const resetAttendanceState = () => {
    setCheckedInState(false);
    setLastCheckInTime("");
    setLastCheckInLocation("");
    setCurrentRecordId(null);
  };

  /**
   * Update time every second
   */
  useEffect(() => {
    setCurrentTime(getCurrentTimeString());

    timeInterval.current = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 1000);

    return () => {
      if (timeInterval.current) clearInterval(timeInterval.current);
    };
  }, []);

  /**
   * Get and set user's current location
   */
  useEffect(() => {
    const getLocation = async () => {
      try {
        setLocationLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationError("Permission to access location was denied");
          setLocationLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setCurrentLocation(formatLocationAddress(location, address));
      } catch (error) {
        console.error("Error getting location:", error);
        setLocationError("Failed to get location");
      } finally {
        setLocationLoading(false);
      }
    };

    getLocation();
  }, []);

  /**
   * Format location address from geocoding result
   */
  const formatLocationAddress = (
    location: Location.LocationObject,
    address: Location.LocationGeocodedAddress[],
  ) => {
    if (address && address.length > 0) {
      const { street, city, region, postalCode } = address[0];
      const formattedAddress = [street, city, region, postalCode]
        .filter(Boolean)
        .join(", ");

      return formattedAddress || "Unknown location";
    } else {
      return `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
    }
  };

  /**
   * Handle time in action
   */
  const handleTimeIn = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) return;

      // Create new attendance record
      const record = await createAttendanceRecord(user.id, currentLocation);
      setCurrentRecordId(record.id);
      setLastCheckInTime(record.timeIn);
      setLastCheckInLocation(record.location);
      setCheckedInState(true);
    } catch (error) {
      console.error("Error clocking in:", error);
      Alert.alert("Error", "Failed to clock in. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  /**
   * Handle time out action
   */
  const handleTimeOut = async () => {
    try {
      if (!currentRecordId) {
        Alert.alert("Error", "No active check-in found");
        return;
      }

      setLoading(true);
      await completeAttendanceRecord(currentRecordId, currentLocation);
      resetAttendanceState();
    } catch (error) {
      console.error("Error clocking out:", error);
      Alert.alert("Error", "Failed to clock out. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  /**
   * Show confirmation modal for time actions
   */
  const promptTimeAction = (action: "in" | "out") => {
    setConfirmationAction(action);
    setShowConfirmation(true);
  };

  /**
   * Render confirmation modal
   */
  const renderConfirmationModal = () => (
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
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Header
        title="Time Tracking"
        onMenuPress={() => router.back()}
        showMenu={true}
      />

      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <TimeTrackingCard
            isCheckedIn={checkedInState}
            lastCheckInTime={lastCheckInTime}
            lastCheckInLocation={lastCheckInLocation}
            currentLocation={currentLocation}
            locationLoading={locationLoading}
            currentTime={currentTime}
            onTimeIn={() => promptTimeAction("in")}
            onTimeOut={() => promptTimeAction("out")}
            isLoading={loading}
          />
        </View>
      </ScrollView>

      {renderConfirmationModal()}
    </View>
  );
};

export default TimeTrackingScreen;
