import * as React from 'react';
import firebase from 'firebase';

import defaultActivites from '../Activities/DefaultActivities';
import Tile from '../Components/ActivityTile';
import firestore from '../../firebase';

import {SafeAreaView, FlatList, TouchableOpacity, Text} from 'react-native';

class HomeScreen extends React.Component {
  // TODO render activities from firebase and current activity from firebase

  // static navigationOptions = ({navigation}) => {
  //   const params = navigation.state.params || {};

  //   return {
  //     title: 'Home',
  //   };
  // };

  state = {
    activities: [],
    currActivity: null,
    isRefreshing: false,
    unsubscribeActivities: null,
    unsubscribeCurrAct: null,
  };

  componentDidMount() {
    const user = firebase.auth().currentUser;
    let activitiesRef = firestore.collection(
      'users/' + user.uid + '/activities',
    );
    let currActRef = firestore.doc('users/' + user.uid);
    // Updates activities in real time
    let unsubscribeActivities = activitiesRef.onSnapshot(() => {
      this.reloadActivities();
    });

    let unsubscribeCurrAct = currActRef.onSnapshot(() => {
      this.reloadCurrActivity();
    });

    this.setState({unsubscribeActivities, unsubscribeCurrAct});

    this.reloadActivities();
    this.reloadCurrActivity();
  }

  componentWillUnmount() {
    this.state.unsubscribeActivities();
  }

  reloadActivities = async () => {
    this.setState({isRefreshing: true});
    const activities = await this.getActivities();
    this.setState({activities: activities, isRefreshing: false});
  };

  getActivities = async () => {
    try {
      const user = firebase.auth().currentUser;
      let activities = [];

      let activityCollRef = firestore.collection(
        'users/' + user.uid + '/activities',
      );
      let allActivities = await activityCollRef.get();
      allActivities.forEach(activity => {
        activities.push(activity.data());
      });

      return activities ? activities : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  reloadCurrActivity = async () => {
    this.setState({isRefreshing: true});
    const currActivity = await this.getCurrActivity();
    this.setState({currActivity: currActivity, isRefreshing: false});
  };

  // Q: why can't we just set state within this block?
  getCurrActivity = async () => {
    try {
      const user = firebase.auth().currentUser;
      let userRef = firestore.doc('users/' + user.uid);
      let userInfo = await userRef.get();
      if (userInfo.exists) {
        return userInfo.data().currActivity.title;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
    return '';
  };

  render() {
    const currActivity = this.state.currActivity
      ? `Current activity: ${this.state.currActivity}`
      : 'No activity currently selected';
    return (
      <SafeAreaView>
        <TouchableOpacity onPress={() => this.props.navigation.push('Profile')}>
          <Text>Profile (click me)</Text>
        </TouchableOpacity>
        <Text>{currActivity}</Text>
        <FlatList
          data={this.state.activities}
          numColumns={2}
          renderItem={({item}) => (
            <Tile navigation={this.props.navigation} activity={item} />
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

export default HomeScreen;
