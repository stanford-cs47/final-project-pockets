import * as React from 'react';
import firebase from 'firebase';

import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import firestore from '../../firebase';

const BlackListItem = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.unBlackList(props.id);
        console.log(`bring ${props.title} back`);
      }}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
};

class HiddenActivitiesScreen extends React.Component {
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
      <FlatList
        data={this.state.blacklist}
        renderItem={({item}) => (
          <BlackListItem
            title={item.title}
            id={item.id}
            unBlackList={this.unBlackList}
          />
        )}
        ListEmptyComponent={<Text>No hidden items</Text>}
        keyExtractor={item => item.id}
      />
    );
  }
}

const styles = StyleSheet.create({});

export default HiddenActivitiesScreen;
