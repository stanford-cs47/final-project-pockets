import * as React from 'react';
import firebase from 'firebase';
import firestore from '../../firebase';

import {StyleSheet, Text, SafeAreaView, View, TextInput} from 'react-native';
import NavIcon from '../Components/NavIcon';

class SuggestActivityScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <NavIcon
          onPress={() => navigation.goBack()}
          icon={require('../Images/Exit.png')}
          color={navigation.getParam('color', '#000')}
        />
      ),
    };
  };

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.text}>
            Recommend an activity for all users to see!
          </Text>
        </View>
        <TextInput
          style={[styles.container, styles.text]}
          placeholder={'Your activity here'}
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

export default SuggestActivityScreen;
