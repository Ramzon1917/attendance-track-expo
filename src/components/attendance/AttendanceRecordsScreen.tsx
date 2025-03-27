import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FileSpreadsheet, Trash2 } from "lucide-react-native";
import Header from "../common/Header";
import FilterControls from "./FilterControls";
import AttendanceList from "./AttendanceList";
import {
  getCurrentUser,
  getUserAttendanceRecords,
  AttendanceRecord,
  saveAttendanceRecords,
  getAttendanceRecords,
} from "../../services/localStorage";

interface AttendanceRecordsScreenProps {
  isLoading?: boolean;
}

const AttendanceRecordsScreen = ({
  isLoading: initialLoading = false,
}: AttendanceRecordsScreenProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    dateRange: "This Week",
    status: "All",
    location: "All Locations",
  });

  // Load attendance records when component mounts or filters change
  useEffect(() => {
    const loadAttendanceRecords = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        const userRecords = await getUserAttendanceRecords(currentUser.id);
        setRecords(userRecords);
      } catch (error) {
        console.error("Error loading attendance records:", error);
        Alert.alert("Error", "Failed to load attendance records");
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendanceRecords();
  }, [router, filters]);

  const handleRecordsChange = (updatedRecords: AttendanceRecord[]) => {
    setRecords(updatedRecords);
    // Clear selected records when the records change
    setSelectedRecords([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedRecords.length === 0) {
      Alert.alert(
        "No Records Selected",
        "Please select at least one record to delete.",
      );
      return;
    }

    Alert.alert(
      "Delete Selected Records",
      `Are you sure you want to delete ${selectedRecords.length} selected record(s)? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Get current user
              const currentUser = await getCurrentUser();
              if (!currentUser) {
                Alert.alert("Error", "User not found");
                return;
              }

              // Get all records
              const allRecords = await getAttendanceRecords();
              // Filter out the selected records
              const updatedRecords = allRecords.filter(
                (record) => !selectedRecords.includes(record.id),
              );
              // Save the updated records
              await saveAttendanceRecords(updatedRecords);
              // Update the local state with filtered records for current user
              const userRecords = updatedRecords.filter(
                (record) => record.userId === currentUser.id,
              );
              setRecords(userRecords);
              setSelectedRecords([]);
              Alert.alert(
                "Success",
                `${selectedRecords.length} record(s) deleted successfully`,
              );
            } catch (error) {
              console.error("Error deleting records:", error);
              Alert.alert("Error", "Failed to delete records");
            }
          },
        },
      ],
    );
  };

  const handleDeleteAll = async () => {
    if (records.length === 0) {
      Alert.alert("No Records", "There are no records to delete.");
      return;
    }

    Alert.alert(
      "Delete All Records",
      `Are you sure you want to delete all ${records.length} records? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              // Get current user
              const currentUser = await getCurrentUser();
              if (!currentUser) {
                Alert.alert("Error", "User not found");
                return;
              }

              // Get all records
              const allRecords = await getAttendanceRecords();
              // Keep records from other users
              const otherUsersRecords = allRecords.filter(
                (record) => record.userId !== currentUser.id,
              );
              // Save records without current user's records
              await saveAttendanceRecords(otherUsersRecords);
              // Update the local state
              setRecords([]);
              setSelectedRecords([]);
              Alert.alert("Success", "All records deleted successfully");
            } catch (error) {
              console.error("Error deleting all records:", error);
              Alert.alert("Error", "Failed to delete all records");
            }
          },
        },
      ],
    );
  };

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

        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            className="flex-row items-center bg-red-100 px-3 py-1.5 rounded-md"
            onPress={handleDeleteSelected}
          >
            <Trash2 size={16} color="#dc2626" />
            <Text className="ml-1 text-red-700 font-medium">
              Delete Selected ({selectedRecords.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-red-100 px-3 py-1.5 rounded-md"
            onPress={handleDeleteAll}
          >
            <Trash2 size={16} color="#dc2626" />
            <Text className="ml-1 text-red-700 font-medium">Delete All</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <FilterControls onFilterChange={handleFilterChange} />
        </View>

        <View className="flex-1">
          <AttendanceList
            records={records}
            isLoading={isLoading}
            onRecordPress={handleRecordPress}
            filters={filters}
            onRecordsChange={handleRecordsChange}
            selectedRecords={selectedRecords}
            onSelectRecord={(recordId, selected) => {
              if (selected) {
                setSelectedRecords((prev) => [...prev, recordId]);
              } else {
                setSelectedRecords((prev) =>
                  prev.filter((id) => id !== recordId),
                );
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AttendanceRecordsScreen;
