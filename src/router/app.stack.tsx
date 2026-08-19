import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../constants/routes';
import SearchScreen from '../screens/app/SearchScreen';
import EventsScreen from '../screens/app/EventsScreen';
import FavouritesScreen from '../screens/app/FavouritesScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import { Colors } from '../constants/colors';
import { h, mw } from '../utils/RNSize';
import { Images } from '../constants/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSize } from '../constants/fonts';

const Tab = createBottomTabNavigator();

const TabBarIcon: React.FC<{
  _focused?: boolean;
  color: string;
  name: string;
}> = ({ _focused, color, name }) => {
  const iconMap: Record<string, any> = {
    search: Images.SEARCH_ICON,
    events: Images.EVENTS_ICON,
    favourites: Images.HEART_ICON,
    profile: Images.PROFILE_ICON,
  };

  return (
    <View style={styles.iconContainer}>
      <Image
        source={iconMap[name] || Images.SEARCH_ICON}
        style={[styles.icon, { tintColor: color }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: mw(28),
    height: mw(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: mw(24),
    height: mw(24),
  },
});

export default function AppStack() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
          height: mw(60),
          paddingBottom:
            safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : h(8),
        },
        tabBarLabelStyle: {
          fontSize: FontSize.fs3,
          fontWeight: '600',
        },
        sceneStyle: {
          paddingTop: safeAreaInsets.top > 0 ? safeAreaInsets.top : h(10),
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.SEARCH}
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon _focused={false} color={color} name="search" />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.EVENTS}
        component={EventsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon _focused={false} color={color} name="events" />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.FAVOURITES}
        component={FavouritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon _focused={false} color={color} name="favourites" />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon _focused={false} color={color} name="profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
