import * as React from 'react';
import firebase from 'firebase';
import {View, Text, TouchableOpacity} from 'react-native';

const ProfileScreen = () => {
  const signOut = async () => {
    try {
      const response = await firebase.auth().signOut();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
