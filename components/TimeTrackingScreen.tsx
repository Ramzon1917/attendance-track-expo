import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import Header from "./Header";
import TimeTrackingCard from "./TimeTrackingCard";
import TimeActionButton from "./TimeActionButton";

interface TimeTrackingScreenProps {
  isCheckedIn?: boolean;
  lastCheckInTime?: string;
  lastCheckInLocation?: string;
}

const TimeTrackingScreen = ({
  isCheckedIn: initialIsCheckedIn = false,
  lastCheckInTime: initialLastCheckInTime = "",
  lastCheckInLocation: initialLastCheckInLocation = "",
}: TimeTrackingScreenProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkedInState, setCheckedInState] = useState(initialIsCheckedIn);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [lastCheckInTime, setLastCheckInTime] = useState(
    initialLastCheckInTime,
  );
  const [lastCheckInLocation, setLastCheckInLocation] = useState(
    initialLastCheckInLocation,
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<"in" | "out">(
    "in",
  );

  const locationInterval = useRef<NodeJS.Timeout | null>(null);
  const timeInterval = useRef<NodeJS.Timeout | null>(null);

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

    timeInterval.current = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => {
      if (timeInterval.current) clearInterval(timeInterval.current);
    };
  }, []);

  // Request and track location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationError("Permission to access location was denied");
          setLocationLoading(false);
          return;
        }

        // Get initial location
        updateLocation();

        // Set up interval to update location every 30 seconds
        locationInterval.current = setInterval(updateLocation, 30000);
      } catch (error) {
        setLocationError("Error accessing location services");
        setLocationLoading(false);
      }
    })();

    return () => {
      if (locationInterval.current) clearInterval(locationInterval.current);
    };
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
        const formattedAddress = [
          address.name,
          address.street,
          address.city,
          address.region,
          address.postalCode,
          address.country,
        ]
          .filter(Boolean)
          .join(", ");

        setCurrentLocation(formattedAddress);
      } else {
        setCurrentLocation(
          `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`,
        );
      }

      setLocationLoading(false);
      setLocationError(null);
    } catch (error) {
      setLocationError("Failed to get current location");
      setLocationLoading(false);
    }
  };

  const promptTimeAction = (action: "in" | "out") => {
    setConfirmationAction(action);
    setShowConfirmation(true);
  };

  const handleTimeIn = () => {
    setLoading(true);

    // Record current time and location
    const timeIn = getCurrentTime();
    setLastCheckInTime(timeIn);
    setLastCheckInLocation(currentLocation);

    setTimeout(() => {
      setCheckedInState(true);
      setLoading(false);
    }, 500);
  };

  const handleTimeOut = () => {
    setLoading(true);

    setTimeout(() => {
      setCheckedInState(false);
      setLoading(false);
    }, 500);
  };

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
          />
        </View>

        <View className="items-center">
          <TimeActionButton
            isCheckedIn={checkedInState}
            isLoading={loading}
            onPress={
              checkedInState
                ? () => promptTimeAction("out")
                : () => promptTimeAction("in")
            }
          />
        </View>
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

export default TimeTrackingScreen;
