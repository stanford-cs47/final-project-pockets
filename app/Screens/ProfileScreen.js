import * as React from 'react';
import firebase from 'firebase';

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
  .then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  })
  .catch(error => {
    console.log(error);
  });

Geolocation.setRNConfiguration({
  // skipPermissionRequests: true,
  authorizationLevel: 'whenInUse',
});
// Geolocation.getCurrentPosition(info => console.log(info));

import NavIcon from '../Components/NavIcon';
import firestore from '../../firebase';

class ProfileScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <NavIcon
          onPress={() => navigation.goBack()}
          icon={require('../Images/Exit.png')}
          color={'#202020'}
        />
      ),
    };
  };

  state = {locationEnable: false, name: ''};

  signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (err) {
      console.log(err);
    }
  };

  getLocationPref = async () => {
    try {
      const user = firebase.auth().currentUser;
      const userDocRef = firestore.doc('users/' + user.uid);
      const userInfo = await userDocRef.get();

      if (userInfo.exists) {
        let location = userInfo.data().location
          ? userInfo.data().location
          : false;

        this.setState({locationEnable: location, name: userInfo.data().name});
      }
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount = () => {
    this.getLocationPref();
  };

  toggleLocation = async e => {
    try {
      if (e === true) {
        Geolocation.requestAuthorization();
      }

      const user = firebase.auth().currentUser;
      const userDocRef = firestore.doc('users/' + user.uid);
      userDocRef.set({location: e}, {merge: true});
      this.setState({locationEnable: e});
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const {navigation} = this.props;
    const data = [
      {
        action: () =>
          navigation.navigate('HiddenActivities', {navigation: navigation}),
        text: 'Hidden Activities',
      },
      {
        action: () =>
          navigation.navigate('SuggestActivity', {navigation: navigation}),
        text: 'Suggest an Activity',
      },
      {
        action: () => navigation.navigate('Calendar', {navigation: navigation}),
        text: 'Integrate Calendar',
      },
      {
        action: () => '',
        text: 'Location',
      },
      {
        action: () => {
          Alert.alert(
            'Are you sure you want to log out?',
            '',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Ok',
                onPress: () => {
                  this.signOut();
                },
              },
            ],
            {cancelable: true},
          );
        },
        text: 'Log Out',
      },
    ];

    return (
      <SafeAreaView>
        {/* TODO: have a "Hi, username" at the top or something equivalent */}
        <Text style={[styles.text, {fontSize: 30}]}>
          Hello, {this.state.name}!
        </Text>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.container} onPress={item.action}>
              <Text
                style={[
                  styles.text,
                  item.text === 'Log Out'
                    ? {color: 'cornflowerblue'}
                    : {color: '#202020'},
                ]}>
                {item.text}
              </Text>
              {item.text === 'Location' && (
                <Switch
                  onValueChange={e => {
                    if (e === false) {
                      Alert.alert(
                        'Are you sure you want to turn location off?',
                        '',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Ok',
                            onPress: () => {
                              this.toggleLocation(e);
                            },
                          },
                        ],
                        {cancelable: true},
                      );
                    } else {
                      Alert.alert(
                        'Allow "Pockets" to access your location?',
                        'Turn on location services to find things to do near you.',
                        [
                          {
                            text: "Don't Allow",
                          },
                          {
                            text: 'Allow',
                            onPress: () => {
                              this.toggleLocation(e);
                            },
                          },
                        ],
                        {cancelable: true},
                      );
                    }
                  }}
                  value={this.state.locationEnable}
                />
              )}
            </TouchableOpacity>
          )}
          keyExtractor={item => item.text}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 96,
    padding: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default ProfileScreen;
