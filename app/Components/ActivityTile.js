import * as React from 'react';

import {StyleSheet, TouchableOpacity, View, Image, Text} from 'react-native';

const getBgColor = activity => {
  if (activity.type === 'health') {
    return '#A9DEF9'; // BLUE
  } else if (activity.type === 'fun') {
    return '#FFE6A7'; // YELLOW
  } else if (activity.type === 'edu') {
    return '#F8C0C8'; // RED
  } else if (activity.type === 'productivity') {
    return '#D0F4DE'; // GREEN
  } else {
    return '#DBB1E2'; // PURPLE
  }
};

const getColor = activity => {
  if (activity.type === 'health') {
    return '#024663'; // BLUE
  } else if (activity.type === 'fun') {
    return '#7A7330'; // YELLOW
  } else if (activity.type === 'edu') {
    return '#C34A76'; // RED
  } else if (activity.type === 'productivity') {
    return '#125518'; // GREEN
  } else {
    return '#772485'; // PURPLE
  }
};

export default class Tile extends React.Component {
  render() {
    const {activity, navigation} = this.props;
    return (
      <TouchableOpacity
        style={styles.tileTouchable}
        onPress={() => navigation.navigate('Detail', {activity: activity})}>
        <View style={[styles.tile, {backgroundColor: getBgColor(activity)}]}>
          <TouchableOpacity style={styles.deleteTouchable}>
            <Image
              style={[styles.delete, {tintColor: getColor(activity)}]}
              source={require('../Images/Delete.png')}
            />
          </TouchableOpacity>
          <Text style={[styles.tileTitle, {color: getColor(activity)}]}>
            {activity.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tileTouchable: {
    width: '44%',
    marginTop: '2%',
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    width: '80%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteTouchable: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  delete: {
    width: 20,
    height: 20,
  },
});
