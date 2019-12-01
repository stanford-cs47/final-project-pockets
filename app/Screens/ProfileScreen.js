import * as React from 'react';
import firebase from 'firebase';
import {View, Text, TouchableOpacity} from 'react-native';

const ProfileScreen = props => {
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('HiddenActivities', {
            navigation: props.navigation,
          })
        }>
        <Text>Hidden Activities</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('SuggestActivity')}>
        <Text>Suggest an Activity!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
