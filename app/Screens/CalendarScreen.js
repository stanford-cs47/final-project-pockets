import * as React from 'react';
import firebase from 'firebase';
import firestore from '../../firebase';

import RNCalendarEvents from 'react-native-calendar-events';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';

import NavIcon from '../Components/NavIcon';
import DropDownHolder from '../Components/DropdownHolder';

class CalendarScreen extends React.Component {
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

  state = {
    status: 'undetermined',
    notifications: false,
  };

  componentDidMount() {
    RNCalendarEvents.authorizationStatus().then(status => {
      this.setState({status: status});
    });
    this.getNotificationPref();
  }

  getNotificationPref = async () => {
    try {
      const user = firebase.auth().currentUser;
      const userDocRef = firestore.doc('users/' + user.uid);
      const userInfo = await userDocRef.get();

      if (userInfo.exists) {
        let notifications = userInfo.data().notifications
          ? userInfo.data().notifications
          : false;

        this.setState({notifications});
      }
    } catch (err) {
      console.log(err);
    }
  };

  toggleNotifications = async e => {
    try {
      const user = firebase.auth().currentUser;
      const userDocRef = firestore.doc('users/' + user.uid);
      userDocRef.set({notifications: e}, {merge: true});
      this.setState({notifications: e});
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const data = [
      {
        action: () => {},
        text: 'Notifications',
      },
    ];

    return (
      <SafeAreaView style={{height: '100%'}}>
        <Text style={styles.headerText}>Integrate your Calendar</Text>
        <Text style={styles.subtext}>
          Receive notifications when you've got pockets of time
        </Text>
        {this.state.status === 'undetermined' && (
          <TouchableOpacity
            onPress={() => RNCalendarEvents.authorizeEventStore()}
            style={styles.button}>
            <Text style={{fontWeight: '700', color: 'white', fontSize: 20}}>
              Integrate Calendar
            </Text>
          </TouchableOpacity>
        )}
        {this.state.status === 'authorized' && (
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
                {item.text === 'Notifications' && (
                  <Switch
                    onValueChange={e => {
                      this.toggleNotifications(e);
                      if (e === true) {
                        DropDownHolder.dropDown.alertWithType(
                          'custom',
                          'Notifications enabled',
                        );
                      } else {
                        DropDownHolder.dropDown.alertWithType(
                          'custom',
                          'Notifications disabled',
                        );
                      }
                    }}
                    value={this.state.notifications}
                  />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={item => item.text}
          />
        )}
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
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    padding: 32,
  },
  subtext: {
    fontSize: 20,
    fontWeight: '700',
    padding: 32,
    color: 'grey',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  button: {
    height: 64,
    marginLeft: 32,
    marginRight: 32,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cornflowerblue',
  },
});

export default CalendarScreen;
