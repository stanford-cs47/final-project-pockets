import * as React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Alert,
} from 'react-native';
import {getBgColor, getColor} from '../Constants/Color';

export default class Tile extends React.Component {
  render() {
    const {activity, navigation, blacklistActivity} = this.props;
    return (
      <TouchableOpacity
        style={styles.tileTouchable}
        onPress={() => navigation.navigate('Detail', {activity: activity})}>
        <View style={[styles.tile, {backgroundColor: getBgColor(activity)}]}>
          <TouchableOpacity
            style={styles.deleteTouchable}
            onPress={() => {
              Alert.alert(
                'Remove Activity',
                'This activity will not be shown in the future. To see it again, re-select it from your profile page.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => blacklistActivity(activity.id),
                  },
                ],
                {cancelable: true},
              );
            }}>
            <Image
              opacity={0.75}
              style={[styles.delete, {tintColor: getColor(activity)}]}
              source={require('../Images/Delete.png')}
            />
          </TouchableOpacity>
          <Image
            style={styles.tileImage}
            source={
              activity.img
                ? {uri: activity.img}
                : require('../Images/pocket.png')
            }
          />
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
    // 28 for 3 cols
    marginTop: '2%',
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
  },
  tileTitle: {
    width: '80%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  tileImage: {
    width: '45%',
    height: '45%',
    resizeMode: 'contain',
    marginBottom: '10%',
  },
  deleteTouchable: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  delete: {
    width: 22,
    height: 22,
  },
});
