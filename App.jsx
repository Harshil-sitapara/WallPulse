import {View, Text} from 'react-native';
import React from 'react';
import HomePage from './src/pages/HomePage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import CategoriesImages from './src/components/CategoriesImages';
import OpenImage from './src/components/OpenImage';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} options={{headerShown:false}}/>
          <Stack.Screen
            name="CategoryImages"
            component={CategoriesImages}
            options={({route}) => ({title: route.params.categoryName})}
          />
          <Stack.Screen
            name="OpenImage"
            component={OpenImage}
            options={{headerShown:false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
