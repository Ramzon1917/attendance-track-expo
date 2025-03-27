import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  Upload,
} from "lucide-react-native";
import Header from "../common/Header";
import { getAttendanceRecords } from "../../services/localStorage";

export default function ExportScreen() {
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

  const handleUploadToDrive = async () => {
    try {
      setLoading(true);

      // Get all attendance records
      const allRecords = await getAttendanceRecords();

      if (allRecords.length === 0) {
        Alert.alert("No Records", "There are no attendance records to upload.");
        setLoading(false);
        return;
      }

      // Format records for sharing
      const formattedRecords = allRecords
        .map((record) => {
          return `Date: ${record.date}\nTime In: ${record.timeIn}\nTime Out: ${record.timeOut || "Not clocked out"}\nLocation: ${record.location}\nDuration: ${record.duration}\nStatus: ${record.status}\n\n`;
        })
        .join("---\n");

      const reportName = `Attendance_Report_${dateRange.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}`;

      // Use Share API as a placeholder for Google Drive integration
      await Share.share({
        title: reportName,
        message: `${reportName}\n\n${formattedRecords}`,
      });

      Alert.alert(
        "Upload Placeholder",
        "In a production app, this would upload to Google Drive. Currently using Share API as a demonstration.",
      );
    } catch (error) {
      console.error("Error uploading to drive:", error);
      Alert.alert("Error", "Failed to upload records to Google Drive");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    setLoading(true);

    // Generate mock data for the report
    const generateMockData = () => {
      const data = [];
      const startDate = new Date();

      // Adjust date based on selected range
      switch (dateRange) {
        case "Today":
          break;
        case "This Week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "This Month":
          startDate.setDate(1);
          break;
        case "Last Month":
          startDate.setMonth(startDate.getMonth() - 1);
          startDate.setDate(1);
          break;
        case "Custom":
          startDate.setDate(startDate.getDate() - 30); // Default to last 30 days
          break;
      }

      // Generate random entries
      const days =
        dateRange === "Today"
          ? 1
          : dateRange === "This Week"
            ? 7
            : dateRange === "This Month" || dateRange === "Last Month"
              ? 30
              : 30;

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        // Skip weekends for more realistic data
        const day = date.getDay();
        if (day === 0 || day === 6) continue;

        const timeIn = `${8 + Math.floor(Math.random() * 2)}:${Math.floor(
          Math.random() * 60,
        )
          .toString()
          .padStart(2, "0")} AM`;
        const timeOut = `${4 + Math.floor(Math.random() * 4)}:${Math.floor(
          Math.random() * 60,
        )
          .toString()
          .padStart(2, "0")} PM`;

        data.push({
          date: date.toLocaleDateString(),
          timeIn,
          timeOut,
          location: "Office Headquarters",
          status: "Present",
        });
      }

      return data;
    };

    // Simulate processing and file creation
    setTimeout(() => {
      const reportData = generateMockData();
      const reportName = `Attendance_Report_${dateRange.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.${format.toLowerCase()}`;

      setLoading(false);
      alert(
        `Report "${reportName}" with ${reportData.length} entries has been generated and downloaded as ${format} format.\n\nIn a real app, this would trigger an actual file download in the selected format.`,
      );
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
