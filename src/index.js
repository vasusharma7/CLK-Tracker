import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Home} from './screens';

const App = createStackNavigator(
  {
    Home,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);
export default createAppContainer(App);
