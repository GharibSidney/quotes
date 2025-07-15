import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { View, Text } from 'react-native';

import QuotesScreen from './screens/QuotesScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Tab = createBottomTabNavigator();

export default function App(): JSX.Element {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      try {
        await Font.loadAsync({
          'Quicksand': require('./assets/fonts/Quicksand/static/Quicksand-Regular.ttf'),
          // Only load bold if the file exists - remove this line if you don't have the bold variant
          // 'Quicksand-Bold': require('./assets/fonts/Quicksand/static/Quicksand-Bold.ttf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
        // If font loading fails, continue without custom font
        setFontLoaded(true);
      }
    }
    loadFont();
  }, []);

  // Show loading screen while font is loading
  if (!fontLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Quotes') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Favorites') {
                  iconName = focused ? 'heart' : 'heart-outline';
                } else {
                  iconName = 'home-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: '#E5E5E5',
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
              },
              headerShown: false,
            })}
          >
            <Tab.Screen name="Quotes" component={QuotesScreen} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}