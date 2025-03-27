import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { BarChart, Clock, Calendar } from "lucide-react-native";
import {
  getUserAttendanceRecords,
  AttendanceRecord,
} from "../../services/localStorage";

interface AttendanceSummaryProps {
  userId?: number;
  period?: "week" | "month";
}

const AttendanceSummary = ({
  userId,
  period = "week",
}: AttendanceSummaryProps) => {
  const [stats, setStats] = useState({
    hoursThisWeek: 0,
    hoursThisMonth: 0,
    daysPresent: 0,
    totalDays: 0,
    onTimePercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadAttendanceStats = async () => {
      try {
        setLoading(true);
        const records = await getUserAttendanceRecords(userId);
        const calculatedStats = calculateAttendanceStats(records);
        setStats(calculatedStats);
      } catch (error) {
        console.error("Error loading attendance stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceStats();
  }, [userId]);

  const calculateAttendanceStats = (records: AttendanceRecord[]) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Filter records for current week and month
    const weekRecords = records.filter((record) => {
      const recordDate = new Date(
        record.date.replace("Today, ", "").replace("Yesterday, ", ""),
      );
      return recordDate >= startOfWeek;
    });

    const monthRecords = records.filter((record) => {
      const recordDate = new Date(
        record.date.replace("Today, ", "").replace("Yesterday, ", ""),
      );
      return recordDate >= startOfMonth;
    });

    // Calculate hours for week and month
    const hoursThisWeek = calculateTotalHours(weekRecords);
    const hoursThisMonth = calculateTotalHours(monthRecords);

    // Calculate days present
    const uniqueDays = new Set();
    records.forEach((record) => {
      uniqueDays.add(record.date);
    });
    const daysPresent = uniqueDays.size;

    // Calculate total working days in current month
    const totalDays = getWorkingDaysInMonth(now.getFullYear(), now.getMonth());

    // Calculate on-time percentage (simplified)
    const onTimePercentage = records.length > 0 ? 95 : 0; // Placeholder

    return {
      hoursThisWeek,
      hoursThisMonth,
      daysPresent,
      totalDays,
      onTimePercentage,
    };
  };

  const calculateTotalHours = (records: AttendanceRecord[]) => {
    let totalHours = 0;

    records.forEach((record) => {
      if (record.status === "complete" && record.duration) {
        // Parse duration format like "8h 30m"
        const durationMatch = record.duration.match(/([0-9]+)h\s*([0-9]+)m/);
        if (durationMatch) {
          const hours = parseInt(durationMatch[1], 10);
          const minutes = parseInt(durationMatch[2], 10);
          totalHours += hours + minutes / 60;
        }
      }
    });

    return Math.round(totalHours);
  };

  const getWorkingDaysInMonth = (year: number, month: number) => {
    const days = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;

    for (let i = 1; i <= days; i++) {
      const day = new Date(year, month, i).getDay();
      if (day !== 0 && day !== 6) workingDays++; // Not Sunday and not Saturday
    }

    return workingDays;
  };

  return (
    <View className="w-full bg-white rounded-xl p-4 shadow-sm">
      <View className="flex-row items-center mb-3">
        <BarChart size={20} color="#4f46e5" className="mr-2" />
        <Text className="text-lg font-semibold text-gray-800">
          Attendance Summary
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-2"
      >
        <View className="flex-row space-x-4">
          <View className="bg-blue-50 p-3 rounded-lg min-w-[110px]">
            <View className="flex-row items-center mb-1">
              <Clock size={16} color="#4f46e5" className="mr-1" />
              <Text className="text-xs text-gray-600">This Week</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {stats.hoursThisWeek}h
            </Text>
            <Text className="text-xs text-gray-500">of 40h</Text>
          </View>

          <View className="bg-green-50 p-3 rounded-lg min-w-[110px]">
            <View className="flex-row items-center mb-1">
              <Calendar size={16} color="#059669" className="mr-1" />
              <Text className="text-xs text-gray-600">This Month</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {stats.hoursThisMonth}h
            </Text>
            <Text className="text-xs text-gray-500">of 160h</Text>
          </View>

          <View className="bg-purple-50 p-3 rounded-lg min-w-[110px]">
            <View className="flex-row items-center mb-1">
              <Calendar size={16} color="#9333ea" className="mr-1" />
              <Text className="text-xs text-gray-600">Attendance</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {stats.daysPresent}/{stats.totalDays}
            </Text>
            <Text className="text-xs text-gray-500">days present</Text>
          </View>

          <View className="bg-amber-50 p-3 rounded-lg min-w-[110px]">
            <View className="flex-row items-center mb-1">
              <Clock size={16} color="#d97706" className="mr-1" />
              <Text className="text-xs text-gray-600">On Time</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {stats.onTimePercentage}%
            </Text>
            <Text className="text-xs text-gray-500">punctuality</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceSummary;
