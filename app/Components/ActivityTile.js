import * as React from 'react';

import {StyleSheet, TouchableOpacity, Text} from 'react-native';

const styles = StyleSheet.create({
  // TODO: space these out correctly - we probably need rows that hold two tiles each
  tile: {
    // width: '50%',
    // padding: 2,
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // TODO: make this conditional on the "type" of activity
    backgroundColor: '#00F',
  },
  tileTitle: {
    fontSize: 18,
    color: 'white',
  },
});

export default class Tile extends React.Component {
  render() {
    const {activity, navigation} = this.props;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {activity: activity})}
        style={styles.tile}>
        <Text style={styles.tileTitle}>{activity.title}</Text>
      </TouchableOpacity>
    );
  }
}
