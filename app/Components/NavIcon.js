import * as React from 'react';

import {StyleSheet, TouchableOpacity, Image} from 'react-native';

export default class NavIcon extends React.Component {
  render() {
    const {onPress, icon, big, color} = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Image
          style={[styles.icon, big && styles.big, {tintColor: color}]}
          source={icon}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  big: {
    width: 32,
    height: 32,
  },
  icon: {
    width: 24,
    height: 24,
    margin: 16,
  },
});
