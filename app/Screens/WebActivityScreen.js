import React from 'react';
import {WebView} from 'react-native-webview';
import NavIcon from '../Components/NavIcon';
import firebase from 'firebase';
import firestore from '../../firebase';

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

  state = {currIndex: 0};

  getIndex = async activity => {
    // TODO make this try catch async?
    const user = firebase.auth().currentUser;

    if (activity.link != null) {
      if (Array.isArray(activity.link)) {
        var indexRef = firestore.doc(
          'users/' + user.uid + '/activityIndex/' + activity.id,
        );

        let currIndex = await indexRef.get();

        if (currIndex.exists) {
          this.setState({currIndex: currIndex.data().index});
        } else {
          this.setState({currIndex: 0});
        }
      }
    } else {
      console.log('No link for this activity');
      this.setState({currIndex: 0});
    }
  };

  componentDidMount = () => {
    const {navigation} = this.props;
    const activity = JSON.parse(
      JSON.stringify(navigation.getParam('activity', {})),
    );
    this.getIndex(activity);
  };

  render() {
    const {navigation} = this.props;
    const activity = JSON.parse(
      JSON.stringify(navigation.getParam('activity', {})),
    );

    return (
      <WebView
        source={
          Array.isArray(activity.link)
            ? {uri: activity.link[this.state.currIndex]}
            : {uri: activity.link}
        }
      />
    );
  }
}

export default WebActivityScreen;
