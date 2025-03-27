import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, Filter, MapPin } from "lucide-react-native";

interface FilterControlsProps {
  onFilterChange: (filters: {
    dateRange: string;
    status: string;
    location: string;
  }) => void;
  initialFilters?: {
    dateRange: string;
    status: string;
    location: string;
  };
}

const FilterControls = ({
  onFilterChange,
  initialFilters = {
    dateRange: "This Week",
    status: "All",
    location: "All Locations",
  },
}: FilterControlsProps) => {
  const [dateRange, setDateRange] = useState(initialFilters.dateRange);
  const [status, setStatus] = useState(initialFilters.status);
  const [location, setLocation] = useState(initialFilters.location);

  const dateRangeOptions = [
    "All",
    "Today",
    "This Week",
    "This Month",
    "Last Month",
  ];
  const statusOptions = ["All", "complete", "incomplete"];
  const locationOptions = ["All Locations", "Office Headquarters", "Remote"];

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    onFilterChange({ dateRange: value, status, location });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ dateRange, status: value, location });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    onFilterChange({ dateRange, status, location: value });
  };

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm">
      <View className="mb-3">
        <View className="flex-row items-center mb-2">
          <Calendar size={16} color="#4b5563" />
          <Text className="ml-1 text-gray-700 font-medium">Date Range</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            {dateRangeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                className={`px-3 py-1.5 rounded-md ${dateRange === option ? "bg-indigo-100" : "bg-gray-100"}`}
                onPress={() => handleDateRangeChange(option)}
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

      <View className="flex-row justify-between">
        <View className="w-[48%]">
          <View className="flex-row items-center mb-2">
            <Filter size={16} color="#4b5563" />
            <Text className="ml-1 text-gray-700 font-medium">Status</Text>
          </View>
          <View className="flex-row flex-wrap">
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                className={`mr-2 mb-2 px-3 py-1.5 rounded-md ${status === option ? "bg-indigo-100" : "bg-gray-100"}`}
                onPress={() => handleStatusChange(option)}
              >
                <Text
                  className={`${status === option ? "text-indigo-700" : "text-gray-700"}`}
                >
                  {option === "complete"
                    ? "Complete"
                    : option === "incomplete"
                      ? "Incomplete"
                      : option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="w-[48%]">
          <View className="flex-row items-center mb-2">
            <MapPin size={16} color="#4b5563" />
            <Text className="ml-1 text-gray-700 font-medium">Location</Text>
          </View>
          <View className="flex-row flex-wrap">
            {locationOptions.map((option) => (
              <TouchableOpacity
                key={option}
                className={`mr-2 mb-2 px-3 py-1.5 rounded-md ${location === option ? "bg-indigo-100" : "bg-gray-100"}`}
                onPress={() => handleLocationChange(option)}
              >
                <Text
                  className={`${location === option ? "text-indigo-700" : "text-gray-700"} text-xs`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default FilterControls;
