import * as React from 'react';

import {StyleSheet} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import firebase from 'firebase';

import HomeScreen from './Screens/HomeScreen';
import DetailScreen from './Screens/DetailScreen';
import LoginScreen from './Screens/LoginScreen';
import ProfileScreen from './Screens/ProfileScreen';

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
    Profile: ProfileScreen,
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
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      unsubscribe: null,
    };
  }

  // Check out this link to learn more about firebase.auth()
  // https://firebase.google.com/docs/reference/node/firebase.auth.Auth
  componentDidMount() {
    // This auto detects whether or not a user is signed in.
    let unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loggedIn: true});
      } else {
        this.setState({loggedIn: false});
      }
    });

    this.setState({unsubscribe});
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  render() {
    if (this.state.loggedIn) {
      return <AppContainer />;
    } else {
      return <LoginScreen />;
    }
  }
}

export default App;
