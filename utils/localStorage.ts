import AsyncStorage from "@react-native-async-storage/async-storage";

// User related storage
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: number;
  date: string;
  timeIn: string;
  timeOut: string | null;
  location: string;
  duration: string;
  status: "complete" | "incomplete";
}

// Storage Keys
const USERS_STORAGE_KEY = "@timetrack:users";
const CURRENT_USER_KEY = "@timetrack:currentUser";
const ATTENDANCE_RECORDS_KEY = "@timetrack:attendanceRecords";

// User Management
export const getUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

export const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const saveCurrentUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error("Error saving current user:", error);
  }
};

export const registerUser = async (
  userData: Omit<User, "id">,
): Promise<User> => {
  const users = await getUsers();

  // Check if email already exists
  const existingUser = users.find((user) => user.email === userData.email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Create new user with ID
  const newUser: User = {
    ...userData,
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
  };

  // Save to storage
  await saveUsers([...users, newUser]);
  return newUser;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const users = await getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Save current user
  await saveCurrentUser(user);
  return user;
};

export const logoutUser = async (): Promise<void> => {
  await saveCurrentUser(null);
};

export const updateUserProfile = async (
  userId: number,
  updates: Partial<Omit<User, "id">>,
): Promise<User> => {
  const users = await getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Update user
  const updatedUser = { ...users[userIndex], ...updates };
  users[userIndex] = updatedUser;

  // Save to storage
  await saveUsers(users);

  // Update current user if it's the same user
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    await saveCurrentUser(updatedUser);
  }

  return updatedUser;
};

// Attendance Records Management
export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const recordsJson = await AsyncStorage.getItem(ATTENDANCE_RECORDS_KEY);
    return recordsJson ? JSON.parse(recordsJson) : [];
  } catch (error) {
    console.error("Error getting attendance records:", error);
    return [];
  }
};

export const saveAttendanceRecords = async (
  records: AttendanceRecord[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(ATTENDANCE_RECORDS_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Error saving attendance records:", error);
  }
};

export const getUserAttendanceRecords = async (
  userId: number,
): Promise<AttendanceRecord[]> => {
  const records = await getAttendanceRecords();
  return records.filter((record) => record.userId === userId);
};

export const createAttendanceRecord = async (
  userId: number,
  location: string,
): Promise<AttendanceRecord> => {
  const records = await getAttendanceRecords();
  const now = new Date();

  // Format date for display
  const dateFormatted = formatDateForDisplay(now);

  // Format time
  const timeFormatted = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Create new record
  const newRecord: AttendanceRecord = {
    id: `${userId}-${now.getTime()}`,
    userId,
    date: dateFormatted,
    timeIn: timeFormatted,
    timeOut: null,
    location,
    duration: "N/A",
    status: "incomplete",
  };

  // Save to storage
  await saveAttendanceRecords([...records, newRecord]);
  return newRecord;
};

export const updateAttendanceRecord = async (
  recordId: string,
  updates: Partial<AttendanceRecord>,
): Promise<AttendanceRecord> => {
  const records = await getAttendanceRecords();
  const recordIndex = records.findIndex((r) => r.id === recordId);

  if (recordIndex === -1) {
    throw new Error("Attendance record not found");
  }

  // Update record
  const updatedRecord = { ...records[recordIndex], ...updates };
  records[recordIndex] = updatedRecord;

  // Save to storage
  await saveAttendanceRecords(records);
  return updatedRecord;
};

export const completeAttendanceRecord = async (
  recordId: string,
  location: string,
): Promise<AttendanceRecord> => {
  const records = await getAttendanceRecords();
  const recordIndex = records.findIndex((r) => r.id === recordId);

  if (recordIndex === -1) {
    throw new Error("Attendance record not found");
  }

  const record = records[recordIndex];
  const now = new Date();

  // Format time
  const timeOut = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Calculate duration
  const timeInDate = parseTimeString(record.timeIn);
  const duration = calculateDuration(timeInDate, now);

  // Update record
  const updatedRecord: AttendanceRecord = {
    ...record,
    timeOut,
    location,
    duration,
    status: "complete",
  };

  records[recordIndex] = updatedRecord;

  // Save to storage
  await saveAttendanceRecords(records);
  return updatedRecord;
};

export const getIncompleteAttendanceRecord = async (
  userId: number,
): Promise<AttendanceRecord | null> => {
  const records = await getUserAttendanceRecords(userId);
  return records.find((record) => record.status === "incomplete") || null;
};

// Helper functions
const formatDateForDisplay = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if date is today or yesterday
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
};

const parseTimeString = (timeString: string): Date => {
  const now = new Date();
  const [time, period] = timeString.split(" ");
  const [hours, minutes, seconds] = time.split(":").map(Number);

  let hour = hours;
  if (period === "PM" && hours !== 12) {
    hour += 12;
  } else if (period === "AM" && hours === 12) {
    hour = 0;
  }

  now.setHours(hour, minutes, seconds);
  return now;
};

const calculateDuration = (startTime: Date, endTime: Date): string => {
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHrs}h ${diffMins}m`;
};
