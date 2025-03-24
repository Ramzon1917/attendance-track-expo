import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, Filter, ChevronDown } from "lucide-react-native";

interface FilterControlsProps {
  onFilterChange?: (filters: {
    dateRange: string;
    status: string;
    location: string;
  }) => void;
}

const FilterControls = ({ onFilterChange = () => {} }: FilterControlsProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("This Week");
  const [status, setStatus] = useState("All");
  const [location, setLocation] = useState("All Locations");

  const dateRangeOptions = [
    "Today",
    "This Week",
    "This Month",
    "Last Month",
    "Custom",
  ];
  const statusOptions = ["All", "Complete", "Incomplete"];
  const locationOptions = ["All Locations", "Office", "Remote", "Field"];

  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case "dateRange":
        setDateRange(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "location":
        setLocation(value);
        break;
    }

    onFilterChange({
      dateRange: type === "dateRange" ? value : dateRange,
      status: type === "status" ? value : status,
      location: type === "location" ? value : location,
    });
  };

  return (
    <View className="w-full bg-white rounded-lg shadow-sm border border-gray-100">
      <TouchableOpacity
        className="flex-row justify-between items-center p-4"
        onPress={() => setShowFilters(!showFilters)}
      >
        <View className="flex-row items-center">
          <Filter size={18} color="#4f46e5" />
          <Text className="ml-2 font-medium text-gray-800">Filters</Text>
        </View>
        <ChevronDown
          size={18}
          color="#6b7280"
          style={{
            transform: [{ rotate: showFilters ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      {showFilters && (
        <View className="p-4 pt-0 border-t border-gray-100">
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Date Range
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-2">
                {dateRangeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    className={`px-3 py-1.5 rounded-full ${dateRange === option ? "bg-indigo-100" : "bg-gray-100"}`}
                    onPress={() => handleFilterChange("dateRange", option)}
                  >
                    <Text
                      className={`text-sm ${dateRange === option ? "text-indigo-700" : "text-gray-700"}`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Status
            </Text>
            <View className="flex-row space-x-2">
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`px-3 py-1.5 rounded-full ${status === option ? "bg-indigo-100" : "bg-gray-100"}`}
                  onPress={() => handleFilterChange("status", option)}
                >
                  <Text
                    className={`text-sm ${status === option ? "text-indigo-700" : "text-gray-700"}`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Location
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {locationOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`px-3 py-1.5 rounded-full ${location === option ? "bg-indigo-100" : "bg-gray-100"}`}
                  onPress={() => handleFilterChange("location", option)}
                >
                  <Text
                    className={`text-sm ${location === option ? "text-indigo-700" : "text-gray-700"}`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default FilterControls;
