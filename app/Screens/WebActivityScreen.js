import React from 'react';
import {WebView} from 'react-native-webview';
import NavIcon from '../Components/NavIcon';

class WebActivityScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <NavIcon
          onPress={() => navigation.navigate('Home')}
          icon={require('../Images/Exit.png')}
          color={'#202020'}
        />
      ),
    };
  };

  render() {
    const {navigation} = this.props;
    const activity = JSON.parse(
      JSON.stringify(navigation.getParam('activity', {})),
    );
    console.log('checking out a web activity', activity);
    return <WebView source={{uri: activity.link}} />;
  }
}

export default WebActivityScreen;
