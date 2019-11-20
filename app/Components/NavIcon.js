import * as React from 'react';

import {StyleSheet, TouchableOpacity, Image} from 'react-native';

export default class NavIcon extends React.Component {
  render() {
    const {onPress, icon} = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Image style={styles.icon} source={icon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
    margin: 16,
  },
});
