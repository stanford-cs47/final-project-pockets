import * as React from 'react';
import firebase from 'firebase';
import firestore from '../../firebase';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';

import NavIcon from '../Components/NavIcon';

const BlackListItem = props => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        props.unBlackList(props.id);
        console.log(`bring ${props.title} back`);
      }}>
      <Text style={styles.text}>{props.title}</Text>
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
          color={'#000'}
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
          return {id: id, title: activities[id].title};
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
        <FlatList
          data={this.state.blacklist}
          renderItem={({item}) => (
            <BlackListItem
              title={item.title}
              id={item.id}
              unBlackList={this.unBlackList}
            />
          )}
          ListEmptyComponent={
            <View style={styles.container}>
              <Text style={styles.text}>No hidden items</Text>
            </View>
          }
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HiddenActivitiesScreen;
