import * as React from 'react';

import {StyleSheet, View} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import firebase from 'firebase';
import DropdownAlert from 'react-native-dropdownalert';
import DropDownHolder from './Components/DropdownHolder';

import HomeScreen from './Screens/HomeScreen';
import DetailScreen from './Screens/DetailScreen';
import LoginScreen from './Screens/LoginScreen';
import ProfileScreen from './Screens/ProfileScreen';
import WebActivityScreen from './Screens/WebActivityScreen';
import HiddenActivitiesScreen from './Screens/HiddenActivitiesScreen';
import SuggestActivityScreen from './Screens/SuggestActivityScreen';

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
    WebActivity: WebActivityScreen,
    Profile: ProfileScreen,
    HiddenActivities: HiddenActivitiesScreen,
    SuggestActivity: SuggestActivityScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTintColor: '#C34A76',
    },
    cardShadowEnabled: false,
    mode: 'modal',
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
      return (
        <View style={{width: '100%', height: '100%'}}>
          <AppContainer />
          <DropdownAlert
            ref={ref => DropDownHolder.setDropDown(ref)}
            showCancel={true}
            // // Restyles cancel button
            // cancelBtnImageStyle={{
            //   padding: 8,
            //   width: 30,
            //   height: 30,
            //   alignSelf: 'center',
            // }}

            // TODO: style dropdown alert
            // use this: https://github.com/testshallpass/react-native-dropdownalert/blob/master/docs/PROPS.md
            containerStyle={{
              padding: 16,
              flexDirection: 'row',
              backgroundColor: '#202020',
            }}
            contentContainerStyle={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          />
        </View>
      );
    } else {
      return <LoginScreen />;
    }
  }
}

export default App;
