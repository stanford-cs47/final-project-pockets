import * as React from 'react';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  View,
  Button,
} from 'react-native';
import firebase from 'firebase';
import DropDownHolder from '../Components/DropdownHolder';

import firestore from '../../firebase';

const doActivity = (activity, navigation) => {
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
const blackList = async activityId => {
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
};

const DetailScreen = props => {
  const {navigation} = props;

  const [modalOpen, setModalOpen] = React.useState(false);

  // TODO: error handling if there is no object passed through for an activity
  const activity = JSON.parse(
    JSON.stringify(navigation.getParam('activity', {})),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={modalOpen}
        transparent={true}
        onRequestClose={() => {
          setModalOpen(false);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={{fontSize: 20}}>
              Are you sure you no longer want to see this activity suggestion?
            </Text>
            <Button
              title="Yes"
              onPress={() => {
                blackList(activity.id);
                setModalOpen(false);
                navigation.navigate('Home');
                DropDownHolder.dropDown.alertWithType(
                  'custom',
                  'Activity removed from suggestions',
                );
              }}
            />
            <Button
              title="No"
              onPress={() => {
                setModalOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.activityText}>{activity.title}</Text>

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
        onPress={() => {
          doActivity(activity, navigation);
        }}>
        <Text style={styles.buttonText}>Sounds good</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setModalOpen(true);
        }}>
        <Text style={{fontSize: 20, textDecorationLine: 'underline'}}>
          Don't show me this activity again
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  image: {
    width: '75%',
    height: '50%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    marginBottom: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
  activityText: {
    fontSize: 30,
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
