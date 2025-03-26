import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * User interface representing a user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id: number;
  /** User's full name */
  name: string;
  /** User's email address (used for login) */
  email: string;
  /** User's password (in a real app, this would be hashed) */
  password: string;
  /** Optional phone number */
  phone?: string;
  /** Optional office location */
  location?: string;
}

/**
 * AttendanceRecord interface representing a time tracking record
 */
export interface AttendanceRecord {
  /** Unique identifier for the record */
  id: string;
  /** ID of the user who created this record */
  userId: number;
  /** Formatted date string */
  date: string;
  /** Time when user clocked in */
  timeIn: string;
  /** Time when user clocked out (null if not clocked out yet) */
  timeOut: string | null;
  /** Location where the record was created */
  location: string;
  /** Duration of the attendance (N/A if not complete) */
  duration: string;
  /** Status of the attendance record */
  status: "complete" | "incomplete";
}

/**
 * Storage keys for AsyncStorage
 */
const STORAGE_KEYS = {
  USERS: "@timetrack:users",
  CURRENT_USER: "@timetrack:currentUser",
  ATTENDANCE_RECORDS: "@timetrack:attendanceRecords",
} as const;

/**
 * Time format options for consistent time display
 */
const TIME_FORMAT_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
} as const;

/**
 * Date format options for consistent date display
 */
const DATE_FORMAT_OPTIONS = {
  month: "long",
  day: "numeric",
  year: "numeric",
} as const;

/**
 * Get all users from storage
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

/**
 * Save users to storage
 */
export const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

/**
 * Get the currently logged in user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Save or clear the current user
 */
export const saveCurrentUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(user),
      );
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error("Error saving current user:", error);
  }
};

/**
 * Register a new user
 */
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
    id: generateNewUserId(users),
  };

  // Save to storage
  await saveUsers([...users, newUser]);
  await saveCurrentUser(newUser);
  return newUser;
};

/**
 * Generate a new unique user ID
 */
const generateNewUserId = (users: User[]): number => {
  return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
};

/**
 * Login a user with email and password
 */
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

/**
 * Logout the current user
 */
export const logoutUser = async (): Promise<void> => {
  await saveCurrentUser(null);
};

/**
 * Update a user's profile information
 */
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

/**
 * Get all attendance records from storage
 */
export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const recordsJson = await AsyncStorage.getItem(
      STORAGE_KEYS.ATTENDANCE_RECORDS,
    );
    return recordsJson ? JSON.parse(recordsJson) : [];
  } catch (error) {
    console.error("Error getting attendance records:", error);
    return [];
  }
};

/**
 * Save attendance records to storage
 */
export const saveAttendanceRecords = async (
  records: AttendanceRecord[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ATTENDANCE_RECORDS,
      JSON.stringify(records),
    );
  } catch (error) {
    console.error("Error saving attendance records:", error);
  }
};

/**
 * Get attendance records for a specific user
 */
export const getUserAttendanceRecords = async (
  userId: number,
): Promise<AttendanceRecord[]> => {
  const records = await getAttendanceRecords();
  return records.filter((record) => record.userId === userId);
};

/**
 * Create a new attendance record (clock in)
 */
export const createAttendanceRecord = async (
  userId: number,
  location: string,
): Promise<AttendanceRecord> => {
  const records = await getAttendanceRecords();
  const now = new Date();

  // Format date and time
  const dateFormatted = formatDateForDisplay(now);
  const timeFormatted = now.toLocaleTimeString("en-US", TIME_FORMAT_OPTIONS);

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

/**
 * Update an existing attendance record
 */
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

/**
 * Complete an attendance record (clock out)
 */
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
  const timeOut = now.toLocaleTimeString("en-US", TIME_FORMAT_OPTIONS);

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

/**
 * Get the most recent incomplete attendance record for a user
 */
export const getIncompleteAttendanceRecord = async (
  userId: number,
): Promise<AttendanceRecord | null> => {
  const records = await getUserAttendanceRecords(userId);
  return records.find((record) => record.status === "incomplete") || null;
};

/**
 * Format a date for display with relative terms (Today, Yesterday)
 */
const formatDateForDisplay = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if date is today or yesterday
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleDateString("en-US", DATE_FORMAT_OPTIONS)}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleDateString("en-US", DATE_FORMAT_OPTIONS)}`;
  } else {
    return date.toLocaleDateString("en-US", DATE_FORMAT_OPTIONS);
  }
};

/**
 * Parse a time string in 12-hour format to a Date object
 */
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

/**
 * Calculate the duration between two times
 */
const calculateDuration = (startTime: Date, endTime: Date): string => {
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHrs}h ${diffMins}m`;
};
