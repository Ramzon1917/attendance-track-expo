import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FileSpreadsheet } from "lucide-react-native";
import Header from "./Header";
import FilterControls from "./FilterControls";
import AttendanceList from "./AttendanceList";

interface AttendanceRecordsScreenProps {
  isLoading?: boolean;
}

const AttendanceRecordsScreen = ({
  isLoading: initialLoading = false,
}: AttendanceRecordsScreenProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [filters, setFilters] = useState({
    dateRange: "This Week",
    status: "All",
    location: "All Locations",
  });

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (newFilters: {
    dateRange: string;
    status: string;
    location: string;
  }) => {
    setFilters(newFilters);
    // In a real app, you would fetch filtered data here
    console.log("Filters changed:", newFilters);
  };

  const handleExport = () => {
    // In a real app, you would generate and download an export file
    console.log("Export data with filters:", filters);
    router.push("/export");
  };

  const handleRecordPress = (record: any) => {
    // Navigate to record details
    console.log("Record pressed:", record);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Attendance Records" onMenuPress={() => router.back()} />

      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">
            Your Attendance History
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-indigo-100 px-3 py-1.5 rounded-md"
            onPress={handleExport}
          >
            <FileSpreadsheet size={16} color="#4f46e5" />
            <Text className="ml-1 text-indigo-700 font-medium">Export</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <FilterControls onFilterChange={handleFilterChange} />
        </View>

        <View className="flex-1">
          <AttendanceList
            isLoading={isLoading}
            onRecordPress={handleRecordPress}
            filters={filters}
          />
        </View>
      </View>
    </View>
  );
};

export default AttendanceRecordsScreen;
