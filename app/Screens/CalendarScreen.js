import * as React from 'react';
import firebase from 'firebase';
import firestore from '../../firebase';

import {SafeAreaView, StyleSheet, Text} from 'react-native';

import NavIcon from '../Components/NavIcon';

class CalendarScreen extends React.Component {
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

  render() {
    return (
      <SafeAreaView style={{height: '100%'}}>
        <Text style={styles.headerText}>Integrate your Google Calendar</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    padding: 32,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    padding: 32,
  },
});

export default CalendarScreen;
