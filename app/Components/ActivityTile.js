import * as React from 'react';

import {StyleSheet, TouchableOpacity, Text} from 'react-native';

// TODO: make colors look good lol
const getBgColor = activity => {
  if (activity.type === 'health') {
    return '#18e6ed';
  } else if (activity.type === 'fun') {
    return '#fcba03';
  } else if (activity.type === 'edu') {
    return '#ff5724';
  } else if (activity.type === 'productivity') {
    return '#b5e38a';
  } else {
    return '#d273f5';
  }
};

export default class Tile extends React.Component {
  render() {
    const {activity, navigation} = this.props;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {activity: activity})}
        style={[styles.tile, {backgroundColor: getBgColor(activity)}]}>
        <Text style={styles.tileTitle}>{activity.title}</Text>
      </TouchableOpacity>
    );
  }
}

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
  },
  tileTitle: {
    fontSize: 18,
    color: 'white',
  },
});
