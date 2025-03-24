import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
} from "lucide-react-native";
import Header from "../components/Header";

export default function ExportPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState("This Month");
  const [format, setFormat] = useState("Excel");
  const [loading, setLoading] = useState(false);

  const dateRangeOptions = [
    "Today",
    "This Week",
    "This Month",
    "Last Month",
    "Custom",
  ];
  const formatOptions = ["Excel", "PDF", "CSV"];

  const handleExport = () => {
    setLoading(true);

    // Simulate export process
    setTimeout(() => {
      setLoading(false);
      alert(`Report exported as ${format} for ${dateRange}`);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Export Data" onMenuPress={() => router.back()} />

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <View className="items-center mb-6">
            <View className="bg-indigo-100 p-3 rounded-full mb-3">
              <FileSpreadsheet size={30} color="#4f46e5" />
            </View>
            <Text className="text-xl font-bold text-gray-800">
              Export Attendance Data
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              Generate and download your attendance records
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2 flex-row items-center">
              <Calendar size={16} color="#6b7280" className="mr-1" /> Date Range
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-2">
                {dateRangeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    className={`px-4 py-2 rounded-md ${dateRange === option ? "bg-indigo-100" : "bg-gray-100"}`}
                    onPress={() => setDateRange(option)}
                  >
                    <Text
                      className={`${dateRange === option ? "text-indigo-700" : "text-gray-700"}`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2 flex-row items-center">
              <Filter size={16} color="#6b7280" className="mr-1" /> Export
              Format
            </Text>
            <View className="flex-row space-x-2">
              {formatOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`px-4 py-2 rounded-md ${format === option ? "bg-indigo-100" : "bg-gray-100"}`}
                  onPress={() => setFormat(option)}
                >
                  <Text
                    className={`${format === option ? "text-indigo-700" : "text-gray-700"}`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            className={`w-full py-3 rounded-lg flex-row justify-center items-center ${loading ? "bg-indigo-400" : "bg-indigo-600"}`}
            onPress={handleExport}
            disabled={loading}
          >
            <Download size={20} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">
              {loading ? "Generating..." : "Generate Report"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text className="text-blue-800 font-medium mb-1">Export Tips</Text>
          <Text className="text-blue-700 text-sm">
            • Reports include clock-in/out times and locations\n • Custom date
            ranges allow for specific period exports\n • Excel format includes
            data visualization\n • PDF format is ideal for printing\n • CSV
            format works with most data analysis tools
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
