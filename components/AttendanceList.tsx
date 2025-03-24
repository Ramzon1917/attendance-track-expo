import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Clock, MapPin, Calendar, ChevronRight } from "lucide-react-native";

interface AttendanceRecord {
  id: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  location: string;
  duration: string;
  status: "complete" | "incomplete";
}

interface AttendanceListProps {
  records?: AttendanceRecord[];
  isLoading?: boolean;
  onRecordPress?: (record: AttendanceRecord) => void;
}

const AttendanceList = ({
  records = mockAttendanceRecords,
  isLoading = false,
  onRecordPress = () => {},
}: AttendanceListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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

  if (records.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-lg text-gray-600">
          No attendance records found
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          Your attendance history will appear here once you start tracking time.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: AttendanceRecord }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        className={`mb-3 rounded-lg border border-gray-200 bg-white ${isExpanded ? "shadow-md" : ""}`}
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
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

            <TouchableOpacity
              className="mt-4 self-end rounded-md bg-cyan-700 px-4 py-2"
              onPress={() => onRecordPress(item)}
            >
              <Text className="text-white">View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

// Mock data for default props
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    date: "Today, June 10, 2023",
    timeIn: "08:30 AM",
    timeOut: "05:15 PM",
    location: "123 Business Park, New York, NY",
    duration: "8h 45m",
    status: "complete",
  },
  {
    id: "2",
    date: "Yesterday, June 9, 2023",
    timeIn: "08:45 AM",
    timeOut: "05:30 PM",
    location: "123 Business Park, New York, NY",
    duration: "8h 45m",
    status: "complete",
  },
  {
    id: "3",
    date: "June 8, 2023",
    timeIn: "09:00 AM",
    timeOut: null,
    location: "456 Remote Location, Brooklyn, NY",
    duration: "N/A",
    status: "incomplete",
  },
  {
    id: "4",
    date: "June 7, 2023",
    timeIn: "08:15 AM",
    timeOut: "04:45 PM",
    location: "123 Business Park, New York, NY",
    duration: "8h 30m",
    status: "complete",
  },
  {
    id: "5",
    date: "June 6, 2023",
    timeIn: "08:30 AM",
    timeOut: "05:00 PM",
    location: "123 Business Park, New York, NY",
    duration: "8h 30m",
    status: "complete",
  },
];

export default AttendanceList;
