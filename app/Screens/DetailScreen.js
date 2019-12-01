import * as React from 'react';

import firebase from 'firebase';
import firestore from '../../firebase';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';

import DropDownHolder from '../Components/DropdownHolder';
import NavIcon from '../Components/NavIcon';
import {getBgColor, getColor} from '../Constants/Color';

class DetailScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <NavIcon
          onPress={() => navigation.goBack()}
          icon={require('../Images/Delete.png')}
          color={getColor(navigation.getParam('activity'))}
        />
      ),
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: getBgColor(navigation.getParam('activity')),
      },
    };
  };

  doActivity = (activity, navigation) => {
    const user = firebase.auth().currentUser;
    var userDocRef = firestore.doc('users/' + user.uid);
    userDocRef.set({currActivity: activity}, {merge: true});

    if (activity.link != null) {
      // open page with link
      navigation.navigate('WebActivity', {activity: activity});
      // TODO: make it navigate back to home when they back out of the webview
    } else {
      DropDownHolder.dropDown.alertWithType(
        'custom',
        `Activity selected: ${activity.title}`,
      );
      navigation.navigate('Home');
    }
  };

  // adds activity id to list of id's that user no longer wants to see
  blacklistActivity = async activityId => {
    const {navigation} = this.props;
    try {
      const user = firebase.auth().currentUser;
      let userRef = firestore.doc('users/' + user.uid);
      let userInfo = await userRef.get();

      if (userInfo.exists) {
        if (userInfo.data().blacklist) {
          // get blacklist and add current value
          let blacklist = userInfo.data().blacklist;
          blacklist.push(activityId);
          userRef.set({blacklist: blacklist}, {merge: true});
        } else {
          // make new blacklist and add current value
          let blacklist = [activityId];
          userRef.set({blacklist: blacklist}, {merge: true});
        }
      }
    } catch (error) {
      console.log(error);
    }
    // this.setModalOpen(false);
    navigation.navigate('Home');
    DropDownHolder.dropDown.alertWithType(
      'custom',
      'Activity removed from suggestions',
    );
  };

  render() {
    const {navigation} = this.props;

    // const [modalOpen, setModalOpen] = React.useState(false);

    // TODO: error handling if there is no object passed through for an activity
    const activity = JSON.parse(
      JSON.stringify(navigation.getParam('activity', {})),
    );

    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: getBgColor(activity)}]}>
        <View style={styles.activityTextView}>
          <Text style={[styles.activityText, {color: getColor(activity)}]}>
            {activity.title}
          </Text>
        </View>

        <Image
          source={
            activity.img == null
              ? require('../Images/pocket.png')
              : {uri: activity.img}
          }
          // source={require('../Images/pocket.png')}
          style={styles.image}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.doActivity(activity, navigation)}>
          <Text style={[styles.buttonText, {color: getColor(activity)}]}>
            Let's Do It!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Remove Activity',
              'This activity will not be shown in the future. To see it again, re-select it from your profile page',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => this.blacklistActivity(activity.id),
                },
              ],
              {cancelable: true},
            );
          }}>
          <Text
            style={{
              fontSize: 16,
              color: getColor(activity),
              textDecorationLine: 'underline',
            }}>
            Don't show me this activity again
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default DetailScreen;

const styles = StyleSheet.create({
  image: {
    width: '75%',
    height: '50%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: 300,
    height: 64,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '700',
  },
  activityText: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityTextView: {
    width: '100%',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    height: '60%',
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
  },
});
