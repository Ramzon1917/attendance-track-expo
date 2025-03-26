import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "TimeTrack",
  slug: "timetrack",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.timetrack.app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.timetrack.app",
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    eas: {
      projectId: "your-project-id",
    },
  },
  plugins: [
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Allow TimeTrack to use your location for attendance tracking.",
      },
    ],
  ],
});
