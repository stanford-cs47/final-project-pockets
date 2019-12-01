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
  tileImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 20,
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
