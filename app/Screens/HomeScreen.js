import * as React from 'react';

import defaultActivites from '../Activities/DefaultActivities';
import Tile from '../Components/ActivityTile';

import {SafeAreaView, FlatList, TouchableOpacity, Text} from 'react-native';

class HomeScreen extends React.Component {
  render() {
    return (
      <SafeAreaView>
        <TouchableOpacity onPress={() => this.props.navigation.push('Profile')}>
          <Text>Profile</Text>
        </TouchableOpacity>
        <FlatList
          data={defaultActivites}
          numColumns={2}
          renderItem={({item}) => (
            <Tile navigation={this.props.navigation} activity={item} />
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

export default HomeScreen;
