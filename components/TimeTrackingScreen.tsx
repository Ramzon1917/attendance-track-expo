import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Header from "./Header";
import TimeTrackingCard from "./TimeTrackingCard";
import LocationDisplay from "./LocationDisplay";
import TimeActionButton from "./TimeActionButton";

interface TimeTrackingScreenProps {
  isCheckedIn?: boolean;
  lastCheckInTime?: string;
  lastCheckInLocation?: string;
}

const TimeTrackingScreen = ({
  isCheckedIn = false,
  lastCheckInTime = "08:30 AM",
  lastCheckInLocation = "Office Headquarters",
}: TimeTrackingScreenProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkedInState, setCheckedInState] = useState(isCheckedIn);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleTimeIn = () => {
    setLoading(true);
    setLocationLoading(true);

    // Simulate location detection and time in process
    setTimeout(() => {
      setLocationLoading(false);
      setTimeout(() => {
        setCheckedInState(true);
        setLoading(false);
      }, 500);
    }, 1500);
  };

  const handleTimeOut = () => {
    setLoading(true);

    // Simulate time out process
    setTimeout(() => {
      setCheckedInState(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Time Tracking" onMenuPress={() => router.back()} />

      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <TimeTrackingCard
            isCheckedIn={checkedInState}
            lastCheckInTime={lastCheckInTime}
            lastCheckInLocation={lastCheckInLocation}
            onTimeIn={handleTimeIn}
            onTimeOut={handleTimeOut}
          />
        </View>

        <View className="mb-6">
          <LocationDisplay isLoading={locationLoading} error={locationError} />
        </View>

        <View className="items-center">
          <TimeActionButton
            isCheckedIn={checkedInState}
            isLoading={loading}
            onPress={checkedInState ? handleTimeOut : handleTimeIn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TimeTrackingScreen;
