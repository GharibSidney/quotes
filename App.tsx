import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import QuotesScreen from './screens/QuotesScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Tab = createBottomTabNavigator();

export default function App(): JSX.Element {
  return (
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
  );
}
