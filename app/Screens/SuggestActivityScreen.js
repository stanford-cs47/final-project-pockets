import * as React from 'react';
import firebase from 'firebase';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import firestore from '../../firebase';

const SuggestActivityScreen = () => {
  return (
    <View style={styles.container}>
      <Text>
        Recommend an activity to be added to our default suggestions that all
        users will see!
      </Text>
      <TextInput placeholder={'Your activity here'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '2%',
    justifyContent: 'space-around',
  },
});

export default SuggestActivityScreen;
