import * as React from 'react';

import {StyleSheet, TouchableOpacity, View, Image, Text} from 'react-native';
import {getBgColor, getColor} from '../Constants/Color';

export default class Tile extends React.Component {
  render() {
    const {activity, navigation} = this.props;
    return (
      <TouchableOpacity
        style={styles.tileTouchable}
        onPress={() => navigation.navigate('Detail', {activity: activity})}>
        <View style={[styles.tile, {backgroundColor: getBgColor(activity)}]}>
          <View
            style={[
              styles.tileRow,
              {backgroundColor: 'rgba(255, 255, 255, 0.6)'},
            ]}>
            <Text style={[styles.tileTitle, {color: getColor(activity)}]}>
              {'Most Recent Activity'}
            </Text>
          </View>
          <View style={styles.tileRow}>
            <Text style={[styles.tileTitle, {color: getColor(activity)}]}>
              {activity.title}
            </Text>
          </View>
          <Image
            style={styles.tileImage}
            source={
              activity.img
                ? {uri: activity.img}
                : require('../Images/pocket.png')
            }
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tileTouchable: {
    width: '90%',
    marginTop: '2%',
    marginBottom: '2%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  tile: {
    aspectRatio: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileRow: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
  },
  tileTitle: {
    width: '90%',
    textAlign: 'right',
    fontSize: 20,
    fontWeight: '700',
  },
  tileImage: {
    position: 'absolute',
    left: 24,
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
