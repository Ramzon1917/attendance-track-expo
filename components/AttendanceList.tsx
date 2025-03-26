import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Clock, MapPin, Calendar, ChevronRight, X } from "lucide-react-native";

import {
  AttendanceRecord,
  getAttendanceRecords,
  saveAttendanceRecords,
} from "../utils/localStorage";

interface AttendanceListProps {
  records?: AttendanceRecord[];
  isLoading?: boolean;
  onRecordPress?: (record: AttendanceRecord) => void;
  filters?: {
    dateRange: string;
    status: string;
    location: string;
  };
  onRecordsChange?: (records: AttendanceRecord[]) => void;
  selectedRecords?: string[];
  onSelectRecord?: (recordId: string, selected: boolean) => void;
}

const AttendanceList = ({
  records = [],
  isLoading = false,
  onRecordPress = () => {},
  filters = { dateRange: "All", status: "All", location: "All Locations" },
  onRecordsChange = () => {},
  selectedRecords = [],
  onSelectRecord = () => {},
}: AttendanceListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null,
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleViewDetails = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setDetailsModalVisible(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this attendance record? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Get all records
              const allRecords = await getAttendanceRecords();
              // Filter out the record to delete
              const updatedRecords = allRecords.filter(
                (record) => record.id !== recordId,
              );
              // Save the updated records
              await saveAttendanceRecords(updatedRecords);
              // Update the local state
              const updatedLocalRecords = records.filter(
                (record) => record.id !== recordId,
              );
              // Notify parent component about the change
              onRecordsChange(updatedLocalRecords);
              Alert.alert("Success", "Record deleted successfully");
            } catch (error) {
              console.error("Error deleting record:", error);
              Alert.alert("Error", "Failed to delete record");
            }
          },
        },
      ],
    );
  };

  // Filter records based on filters
  const filteredRecords = records.filter((record) => {
    // Filter by status
    if (filters.status !== "All") {
      const statusMatch = filters.status.toLowerCase() === record.status;
      if (!statusMatch) return false;
    }

    // Filter by location
    if (filters.location !== "All Locations") {
      const locationMatch = record.location.includes(filters.location);
      if (!locationMatch) return false;
    }

    // Filter by date range
    if (filters.dateRange !== "All") {
      // This is a simplified implementation
      // In a real app, you would parse dates and apply proper date range filtering
      if (filters.dateRange === "Today" && !record.date.includes("Today")) {
        return false;
      } else if (
        filters.dateRange === "This Week" &&
        (record.date.includes("Today") || record.date.includes("Yesterday"))
      ) {
        return true;
      } else if (
        filters.dateRange === "This Month" &&
        record.date.includes("June")
      ) {
        return true;
      }
    }

    return true;
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="mt-4 text-gray-600">
          Loading attendance records...
        </Text>
      </View>
    );
  }

  if (filteredRecords.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-lg text-gray-600">
          No attendance records found
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          {records.length > 0
            ? "No records match your current filters. Try adjusting your filters."
            : "Your attendance history will appear here once you start tracking time."}
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: AttendanceRecord }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        className={`mb-3 rounded-lg border border-gray-200 bg-white ${isExpanded ? "shadow-md" : ""} ${selectedRecords.includes(item.id) ? "border-indigo-500 border-2" : ""}`}
        onPress={() => toggleExpand(item.id)}
        onLongPress={() =>
          onSelectRecord(item.id, !selectedRecords.includes(item.id))
        }
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() =>
                onSelectRecord(item.id, !selectedRecords.includes(item.id))
              }
              className={`mr-2 w-5 h-5 border rounded ${selectedRecords.includes(item.id) ? "bg-indigo-500 border-indigo-500" : "border-gray-400"}`}
            />
            <Calendar size={20} color="#0891b2" />
            <Text className="ml-2 font-medium">{item.date}</Text>
          </View>
          <View className="flex-row items-center">
            <Text
              className={`mr-2 font-medium ${item.status === "complete" ? "text-green-600" : "text-amber-600"}`}
            >
              {item.status === "complete" ? "Complete" : "Incomplete"}
            </Text>
            <ChevronRight
              size={18}
              color="#64748b"
              style={{ transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] }}
            />
          </View>
        </View>

        {isExpanded && (
          <View className="border-t border-gray-100 p-4">
            <View className="mb-3 flex-row items-start">
              <Clock size={18} color="#64748b" style={{ marginTop: 2 }} />
              <View className="ml-2">
                <Text className="text-sm text-gray-500">Time In</Text>
                <Text className="font-medium">{item.timeIn}</Text>
              </View>
            </View>

            <View className="mb-3 flex-row items-start">
              <Clock size={18} color="#64748b" style={{ marginTop: 2 }} />
              <View className="ml-2">
                <Text className="text-sm text-gray-500">Time Out</Text>
                <Text className="font-medium">
                  {item.timeOut || "Not clocked out"}
                </Text>
              </View>
            </View>

            <View className="mb-3 flex-row items-start">
              <MapPin size={18} color="#64748b" style={{ marginTop: 2 }} />
              <View className="ml-2">
                <Text className="text-sm text-gray-500">Location</Text>
                <Text className="font-medium">{item.location}</Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Clock size={18} color="#64748b" style={{ marginTop: 2 }} />
              <View className="ml-2">
                <Text className="text-sm text-gray-500">Duration</Text>
                <Text className="font-medium">{item.duration}</Text>
              </View>
            </View>

            <View className="mt-4 flex-row justify-end">
              <TouchableOpacity
                className="rounded-md bg-cyan-700 px-4 py-2"
                onPress={() => handleViewDetails(item)}
              >
                <Text className="text-white">View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={filteredRecords}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Attendance Details
              </Text>
              <TouchableOpacity
                onPress={() => setDetailsModalVisible(false)}
                className="p-2 rounded-full bg-gray-100"
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedRecord && (
              <ScrollView className="flex-1">
                <View className="bg-blue-50 p-4 rounded-lg mb-6">
                  <View className="flex-row items-center mb-2">
                    <Calendar size={20} color="#0891b2" />
                    <Text className="ml-2 font-semibold text-gray-800">
                      {selectedRecord.date}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <View
                      className={`w-3 h-3 rounded-full mr-2 ${selectedRecord.status === "complete" ? "bg-green-500" : "bg-amber-500"}`}
                    />
                    <Text
                      className={`font-medium ${selectedRecord.status === "complete" ? "text-green-700" : "text-amber-700"}`}
                    >
                      {selectedRecord.status === "complete"
                        ? "Complete"
                        : "Incomplete"}
                    </Text>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Time Information
                  </Text>
                  <View className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                    <Text className="text-gray-500 mb-1">Time In</Text>
                    <View className="flex-row items-center">
                      <Clock size={18} color="#0891b2" />
                      <Text className="ml-2 font-medium text-gray-800">
                        {selectedRecord.timeIn}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                    <Text className="text-gray-500 mb-1">Time Out</Text>
                    <View className="flex-row items-center">
                      <Clock size={18} color="#0891b2" />
                      <Text className="ml-2 font-medium text-gray-800">
                        {selectedRecord.timeOut || "Not clocked out"}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-white rounded-lg border border-gray-200 p-4">
                    <Text className="text-gray-500 mb-1">Duration</Text>
                    <View className="flex-row items-center">
                      <Clock size={18} color="#0891b2" />
                      <Text className="ml-2 font-medium text-gray-800">
                        {selectedRecord.duration}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Location Information
                  </Text>
                  <View className="bg-white rounded-lg border border-gray-200 p-4">
                    <Text className="text-gray-500 mb-1">Location</Text>
                    <View className="flex-row items-start">
                      <MapPin
                        size={18}
                        color="#0891b2"
                        style={{ marginTop: 2 }}
                      />
                      <View className="ml-2 flex-1">
                        <Text className="font-medium text-gray-800">
                          {selectedRecord.location}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          Location verified for attendance tracking
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Additional Information
                  </Text>
                  <View className="bg-white rounded-lg border border-gray-200 p-4">
                    <Text className="text-gray-500">Notes</Text>
                    <Text className="text-gray-800 mt-1">
                      {selectedRecord.status === "complete"
                        ? "Regular attendance with complete time in and out records."
                        : "Incomplete attendance record. Time out information is missing."}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AttendanceList;
