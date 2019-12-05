import * as React from 'react';
import firebase from 'firebase';

import NavIcon from '../Components/NavIcon';
import Tile from '../Components/ActivityTile';
import RecentTile from '../Components/RecentTile';
import firestore from '../../firebase';
import DropDownHolder from '../Components/DropdownHolder';

import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

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
          color="#202020"
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
    filter: [],
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
    return null;
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

  updateFilter = type => {
    let filters = this.state.filter;

    if (filters.includes(type)) {
      filters = filters.filter(f => f !== type);
    } else {
      filters.push(type);
    }

    this.setState({filter: filters});
  };

  filterOpacity = type => {
    return this.state.filter.length === 0 || this.state.filter.includes(type)
      ? 1.0
      : 0.2;
  };

  render() {
    let data = this.state.activities;

    if (this.state.filter.length > 0) {
      data = data.filter(activity => this.state.filter.includes(activity.type));
    }

    return (
      <SafeAreaView style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <View style={{flex: 1}} opacity={this.filterOpacity('health')}>
            <TouchableOpacity
              style={[styles.filter, {backgroundColor: '#A9DEF9'}]}
              onPress={() => this.updateFilter('health')}>
              <Text style={[styles.text, {color: '#024663'}]}>Well-being</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}} opacity={this.filterOpacity('productivity')}>
            <TouchableOpacity
              style={[styles.filter, {backgroundColor: '#D0F4DE'}]}
              onPress={() => this.updateFilter('productivity')}>
              <Text style={[styles.text, {color: '#125518'}]}>
                Productivity
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}} opacity={this.filterOpacity('fun')}>
            <TouchableOpacity
              style={[styles.filter, {backgroundColor: '#FFE6A7'}]}
              onPress={() => this.updateFilter('fun')}>
              <Text style={[styles.text, {color: '#7A7330'}]}>Fun</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}} opacity={this.filterOpacity('edu')}>
            <TouchableOpacity
              style={[styles.filter, {backgroundColor: '#F8C0C8'}]}
              onPress={() => this.updateFilter('edu')}>
              <Text style={[styles.text, {color: '#C34A76'}]}>Learning</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}} opacity={this.filterOpacity('locations')}>
            <TouchableOpacity
              style={[styles.filter, {backgroundColor: '#DBB1E2'}]}
              onPress={() => this.updateFilter('locations')}>
              <Text style={[styles.text, {color: '#772485'}]}>Locations</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={data}
          numColumns={2}
          columnWrapperStyle={styles.column}
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    margin: '2%',
    justifyContent: 'space-around',
  },
  container: {
    flexDirection: 'row',
    margin: '2%',
    justifyContent: 'space-around',
  },
  filter: {
    height: 40,
    margin: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default HomeScreen;
