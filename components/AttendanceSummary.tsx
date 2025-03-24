import React from "react";
import { View, Text, ScrollView } from "react-native";
import { BarChart, Clock, Calendar } from "lucide-react-native";

interface AttendanceSummaryProps {
  hoursThisWeek?: number;
  hoursThisMonth?: number;
  daysPresent?: number;
  totalDays?: number;
  onTimePercentage?: number;
}

const AttendanceSummary = ({
  hoursThisWeek = 32,
  hoursThisMonth = 128,
  daysPresent = 18,
  totalDays = 22,
  onTimePercentage = 95,
}: AttendanceSummaryProps) => {
  return (
    <View className="w-full bg-white rounded-xl p-4 shadow-sm">
      <View className="flex-row items-center mb-3">
        <BarChart size={20} className="text-blue-600 mr-2" />
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
              <Clock size={16} className="text-blue-600 mr-1" />
              <Text className="text-xs text-gray-600">This Week</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {hoursThisWeek}h
            </Text>
            <Text className="text-xs text-gray-500">of 40h</Text>
          </View>

          <View className="bg-green-50 p-3 rounded-lg min-w-[110px]">
            <View className="flex-row items-center mb-1">
              <Calendar size={16} className="text-green-600 mr-1" />
              <Text className="text-xs text-gray-600">This Month</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {hoursThisMonth}h
            </Text>
            <Text className="text-xs text-gray-500">of 160h</Text>
          </View>

          <View className="bg-purple-50 p-3 rounded-lg min-w-[110px]">
            <View className="flex-row items-center mb-1">
              <Calendar size={16} className="text-purple-600 mr-1" />
              <Text className="text-xs text-gray-600">Attendance</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {daysPresent}/{totalDays}
            </Text>
            <Text className="text-xs text-gray-500">days present</Text>
          </View>

          <View className="bg-amber-50 p-3 rounded-lg min-w-[110px]">
            <View className="flex-row items-center mb-1">
              <Clock size={16} className="text-amber-600 mr-1" />
              <Text className="text-xs text-gray-600">On Time</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {onTimePercentage}%
            </Text>
            <Text className="text-xs text-gray-500">punctuality</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceSummary;
