import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CollectionScreen from '../screens/CollectionScreen';
import BattleScreen from '../screens/BattleScreen';
import DungeonScreen from '../screens/DungeonScreen';
import ArenaScreen from '../screens/ArenaScreen';
import SummonScreen from '../screens/SummonScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#0A0E1A' } }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Collection" component={CollectionScreen} />
        <Stack.Screen name="Battle" component={BattleScreen} />
        <Stack.Screen name="Dungeon" component={DungeonScreen} />
        <Stack.Screen name="Arena" component={ArenaScreen} />
        <Stack.Screen name="Summon" component={SummonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
