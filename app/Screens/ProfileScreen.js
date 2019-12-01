import * as React from 'react';
import firebase from 'firebase';

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import NavIcon from '../Components/NavIcon';

class ProfileScreen extends React.Component {
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

  signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const {navigation} = this.props;
    const data = [
      {
        action: () =>
          navigation.navigate('HiddenActivities', {navigation: navigation}),
        text: 'Hidden Activities',
      },
      {
        action: () =>
          navigation.navigate('SuggestActivity', {navigation: navigation}),
        text: 'Suggest an Activity',
      },
      {
        action: () => navigation.navigate('Calendar', {navigation: navigation}),
        text: 'Integrate Calendar',
      },
      {
        action: () => {
          Alert.alert(
            'Are you sure you want to log out?',
            '',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Ok',
                onPress: () => {
                  this.signOut();
                },
              },
            ],
            {cancelable: true},
          );
        },
        text: 'Log Out',
      },
    ];

    return (
      <SafeAreaView>
        {/* TODO: have a "Hi, username" at the top or something equivalent */}
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
            </TouchableOpacity>
          )}
          keyExtractor={item => item.text}
        />
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
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default ProfileScreen;
