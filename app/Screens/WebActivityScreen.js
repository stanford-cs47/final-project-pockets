import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import {WebView} from 'react-native-webview';

const WebActivityScreen = props => {
  const {navigation} = props;
  const activity = JSON.parse(
    JSON.stringify(navigation.getParam('activity', {})),
  );
  console.log('checking out a web activity', activity);
  return <WebView source={{uri: activity.link}} />;
};

export default WebActivityScreen;
