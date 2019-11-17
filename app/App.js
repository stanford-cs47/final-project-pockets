import React from 'react';

import {StyleSheet} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './Home.js';
import DetailScreen from './Detail.js';

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
  },
});

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Detail: DetailScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: styles.header,
    },
    cardShadowEnabled: false,
  },
);

const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

export default App;
