import React from 'react';

import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  tile: {
    width: '50%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00F',
  },
  tileTitle: {
    fontSize: 18,
  },
});

class Tile extends React.Component {
  render() {
    const {title, navigation} = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.push('Detail')}>
        <View style={styles.tile}>
          <Text style={styles.tileTitle}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class HomeScreen extends React.Component {
  render() {
    return (
      <SafeAreaView>
        <FlatList
          data={[{id: '0', title: 'CLICK ME'}]}
          renderItem={({item}) => (
            <Tile navigation={this.props.navigation} title={item.title} />
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

export default HomeScreen;
