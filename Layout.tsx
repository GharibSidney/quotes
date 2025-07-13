import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createPageUrl } from "./utils";
import { Ionicons } from "@expo/vector-icons";

interface LayoutProps {
  children: ReactNode;
  currentPageName: string;
}

export default function Layout({ children, currentPageName }: LayoutProps): JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateToScreen = (screenName: string) => {
    navigation.navigate(screenName as never);
  };

  const isCurrentScreen = (screenName: string) => {
    return route.name === screenName;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Navigation */}
      <View style={styles.navbar}>
        <View style={styles.navHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="chatbubble-outline" size={24} color="white" />
            </View>
            <View style={styles.logoText}>
              <Text style={styles.appTitle}>Quotes</Text>
              <Text style={styles.appSubtitle}>Inspire & Create</Text>
            </View>
          </View>
          
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                isCurrentScreen("Quotes") && styles.navButtonActive
              ]}
              onPress={() => navigateToScreen("Quotes")}
            >
              <Ionicons 
                name="home" 
                size={20} 
                color={isCurrentScreen("Quotes") ? "#007AFF" : "#6B7280"} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                isCurrentScreen("Favorites") && styles.navButtonActive
              ]}
              onPress={() => navigateToScreen("Favorites")}
            >
              <Ionicons 
                name="heart" 
                size={20} 
                color={isCurrentScreen("Favorites") ? "#EC4899" : "#6B7280"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 229, 229, 0.5)',
    paddingHorizontal: 16,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  navButtonActive: {
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
});
