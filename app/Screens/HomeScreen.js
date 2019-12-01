import * as React from 'react';
import firebase from 'firebase';

import defaultActivites from '../Activities/DefaultActivities';
import NavIcon from '../Components/NavIcon';
import Tile from '../Components/ActivityTile';
import RecentTile from '../Components/RecentTile';
import firestore from '../../firebase';
import DropDownHolder from '../Components/DropdownHolder';

import {StyleSheet, FlatList} from 'react-native';
import {getColor} from '../Constants/Color';

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <NavIcon
          onPress={() =>
            navigation.navigate('Profile', {
              navigation: navigation,
            })
          }
          icon={require('../Images/Profile.png')}
          big={true}
          color={
            navigation.getParam('activity', null)
              ? getColor(navigation.getParam('activity', null))
              : '#000'
          }
        />
      ),
    };
  };

  state = {
    activities: [],
    currActivity: null,
    isRefreshing: false,
    unsubscribeActivities: null,
    unsubscribeCurrAct: null,
    unsubscribeBlacklist: null,
  };

  componentDidMount() {
    const user = firebase.auth().currentUser;
    let activitiesRef = firestore.collection('/activities');
    let currActRef = firestore.doc('users/' + user.uid);

    // Updates activities and current activity in real time
    let unsubscribeActivities = activitiesRef.onSnapshot(() => {
      this.reloadActivities();
    });

    let unsubscribeCurrAct = currActRef.onSnapshot(() => {
      this.reloadCurrActivity();
      this.reloadActivities();
    });

    this.setState({unsubscribeActivities, unsubscribeCurrAct});

    this.reloadActivities();
    this.reloadCurrActivity();
  }

  componentWillUnmount() {
    this.state.unsubscribeActivities();
    this.state.unsubscribeCurrAct();
  }

  reloadActivities = async () => {
    this.setState({isRefreshing: true});
    const activities = await this.getActivities();
    this.setState({activities: activities, isRefreshing: false});
  };

  getActivities = async () => {
    try {
      let activities = [];

      let activityCollRef = firestore.collection('/activities');
      let allActivities = await activityCollRef.get();
      allActivities.forEach(activity => {
        let newActivity = activity.data();
        newActivity.id = activity.id;
        activities.push(newActivity);
      });

      let blacklist = [];
      const user = firebase.auth().currentUser;
      const userDocRef = firestore.doc('users/' + user.uid);
      const userInfo = await userDocRef.get();

      if (userInfo.exists) {
        blacklist = userInfo.data().blacklist ? userInfo.data().blacklist : [];
      }

      let filtered = activities.filter(function(e) {
        return this.indexOf(e.id) < 0;
      }, blacklist);

      return filtered ? filtered : [];
    } catch (error) {
      console.log(error);
    }
    return [];
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

  reloadCurrActivity = async () => {
    this.setState({isRefreshing: true});
    const currActivity = await this.getCurrActivity();
    this.setState({currActivity: currActivity, isRefreshing: false});
  };

  getCurrActivity = async () => {
    try {
      const user = firebase.auth().currentUser;
      let userRef = firestore.doc('users/' + user.uid);
      let userInfo = await userRef.get();
      if (userInfo.exists) {
        if (userInfo.data().currActivity) {
          this.props.navigation.setParams({
            activity: userInfo.data().currActivity,
          });
          return userInfo.data().currActivity;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
    return '';
  };

  renderRecentActivity = () => {
    const {currActivity} = this.state;
    if (currActivity !== null) {
      return (
        <RecentTile
          navigation={this.props.navigation}
          activity={currActivity}
        />
      );
    }
    return null;
  };

  render() {
    return (
      <FlatList
        data={this.state.activities}
        numColumns={2}
        columnWrapperStyle={styles.container}
        ListHeaderComponent={this.renderRecentActivity}
        renderItem={({item}) => (
          <Tile
            navigation={this.props.navigation}
            activity={item}
            blacklistActivity={this.blacklistActivity}
          />
        )}
        keyExtractor={item => item.id}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '2%',
    justifyContent: 'space-around',
  },
});

export default HomeScreen;
