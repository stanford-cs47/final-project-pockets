import * as React from 'react';
import firebase from 'firebase';
import firestore from '../../firebase';
import {getBgColor, getColor} from '../Constants/Color';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';

import NavIcon from '../Components/NavIcon';

const BlackListItem = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          'Bring activity back to home screen',
          'Are you sure you want to see this activity in the home screen again?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Ok',
              onPress: () => {
                props.unBlackList(props.id);
                console.log(`bring ${props.title} back`);
              },
            },
          ],
          {cancelable: true},
        );
      }}
      style={[styles.blacklistItem, {backgroundColor: getBgColor(props)}]}>
      <Text style={[styles.text, {color: getColor(props)}]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

class HiddenActivitiesScreen extends React.Component {
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
    blacklist: [],
    isRefreshing: false,
    unsubscribeBlacklist: null,
  };

  componentDidMount() {
    const user = firebase.auth().currentUser;
    // TODO: Make this refresh not on every time the curractivity changes... make blacklist into a collection?
    let blacklistRef = firestore.doc('users/' + user.uid);

    // Updates activities in real time
    let unsubscribeBlacklist = blacklistRef.onSnapshot(() => {
      this.reloadBlacklist();
    });

    this.setState({unsubscribeBlacklist});
    this.reloadBlacklist();
  }

  componentWillUnmount() {
    this.state.unsubscribeBlacklist();
  }

  unBlackList = async idToRemove => {
    try {
      const user = firebase.auth().currentUser;
      const userDocRef = firestore.doc('users/' + user.uid);

      let newBlacklist = this.state.blacklist.map(object => object.id);
      newBlacklist = newBlacklist.filter(id => id !== idToRemove);

      this.setState({blacklist: newBlacklist});

      userDocRef.set({blacklist: newBlacklist}, {merge: true});
    } catch (error) {
      console.log(error);
    }
  };

  reloadBlacklist = async () => {
    this.setState({isRefreshing: true});
    const blacklist = await this.loadBlacklist();
    this.setState({blacklist: blacklist, isRefreshing: false});
  };

  loadBlacklist = async () => {
    try {
      let blacklist = [];
      const user = firebase.auth().currentUser;
      const userDocRef = firestore.doc('users/' + user.uid);
      const userInfo = await userDocRef.get();

      let activities = {};
      let activityCollRef = firestore.collection('/activities');
      let allActivities = await activityCollRef.get();

      allActivities.forEach(activity => {
        activities[activity.id] = activity.data();
      });

      if (userInfo.exists) {
        blacklist = userInfo.data().blacklist.map(id => {
          return {
            id: id,
            title: activities[id].title,
            type: activities[id].type,
          };
        });
      }
      return blacklist;
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  render() {
    return (
      <SafeAreaView style={{height: '100%'}}>
        {/* TODO: Modal for confirmation of re-adding and alert when you have */}
        <Text style={styles.headerText}>
          Select an activity to re-display in your home screen.
        </Text>
        <FlatList
          data={this.state.blacklist}
          renderItem={({item}) => (
            <BlackListItem
              title={item.title}
              id={item.id}
              type={item.type}
              unBlackList={this.unBlackList}
            />
          )}
          ListEmptyComponent={
            <View>
              <Text style={[styles.text, {color: 'grey'}]}>
                No hidden items to display
              </Text>
            </View>
          }
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    padding: 32,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    padding: 32,
  },
  blacklistItem: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
});

export default HiddenActivitiesScreen;
