import * as React from 'react';
import firebase from 'firebase';

import defaultActivites from '../Activities/DefaultActivities';
import NavIcon from '../Components/NavIcon';
import Tile from '../Components/ActivityTile';
import firestore from '../../firebase';

import {StyleSheet, SafeAreaView, FlatList, Text} from 'react-native';

class HomeScreen extends React.Component {
  // TODO render activities from firebase and current activity from firebase

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <NavIcon
          onPress={() => navigation.push('Profile')}
          icon={require('../Images/Profile.png')}
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
  };

  componentDidMount() {
    const user = firebase.auth().currentUser;
    let activitiesRef = firestore.collection(
      'users/' + user.uid + '/activities',
    );
    let currActRef = firestore.doc('users/' + user.uid);

    // Updates activities and current activity in real time
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
      // const user = firebase.auth().currentUser;
      let activities = [];

      let activityCollRef = firestore.collection('/activities');
      // TODO: get an added activity on firebase to show up without refreshing?
      let allActivities = await activityCollRef.get();
      allActivities.forEach(activity => {
        let newActivity = activity.data();
        newActivity.id = activity.id;
        activities.push(newActivity);
      });

      // TODO: get the actual user's blacklist instead
      let blacklist = ['0VdclitGuf5VJa38JB1I', 'uFRTKbSu7kYMtbPGMM0D'];

      let filtered = activities.filter(function(e) {
        return this.indexOf(e.id) < 0;
      }, blacklist);

      return filtered ? filtered : [];
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
        if (userInfo.data().currActivity) {
          return userInfo.data().currActivity.title;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
    return '';
  };

  render() {
    const {currActivity} = this.state;
    return (
      <>
        <SafeAreaView>
          {currActivity !== null && <Text>{currActivity}</Text>}
        </SafeAreaView>
        <FlatList
          data={this.state.activities}
          numColumns={2}
          columnWrapperStyle={styles.container}
          renderItem={({item}) => (
            <Tile navigation={this.props.navigation} activity={item} />
          )}
          keyExtractor={item => item.id}
        />
      </>
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
