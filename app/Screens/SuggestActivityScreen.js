import * as React from 'react';
import firebase from 'firebase';
import firestore from '../../firebase';

import {
  Alert,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import NavIcon from '../Components/NavIcon';

class SuggestActivityScreen extends React.Component {
  state = {suggestionText: ''};

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <NavIcon
          onPress={() => navigation.goBack()}
          icon={require('../Images/Exit.png')}
          color={'#202020'}
        />
      ),
    };
  };

  makeSuggestion = async () => {
    try {
      const user = firebase.auth().currentUser;
      let suggestedRef = firestore.collection('/suggestedActivities');
      if (this.state.suggestionText !== '') {
        let newSuggestion = suggestedRef.doc();
        newSuggestion.set({
          suggestion: this.state.suggestionText,
          uid: user.uid,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <SafeAreaView style={{height: '100%'}}>
        <View>
          <Text style={styles.headerText}>
            Suggest an activity for all users to see
          </Text>
          <Text style={styles.text}>
            We're always looking for more ideas! {'\n\n'}Be creative, but
            remember that you're suggesting an activity for{' '}
            <Text style={{fontStyle: 'italic'}}>everyone</Text> to see.{' '}
            {'\u263A'}
          </Text>
          {/* TODO: show alert modal when you have suggested an activity */}
          <TextInput
            style={[styles.input]}
            placeholder={'Your suggested activity here'}
            onChangeText={suggestion =>
              this.setState({suggestionText: suggestion})
            }
            value={this.state.suggestionText}
            multiline={true}
          />
          <TouchableOpacity
            onPress={() => {
              console.log(this.state.suggestionText);
              this.makeSuggestion();
              this.setState({suggestionText: ''});
              Alert.alert(
                'Submit Suggestion',
                'Are you sure you want to submit this suggestion?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () =>
                      Alert.alert(
                        'Thanks for your suggestion!',
                        "We'll review it, and if it looks good we'll add it to everyone's activities.",
                      ),
                  },
                ],
                {cancelable: true},
              );
            }}
            style={styles.submitButton}>
            <Text style={{fontWeight: '700', color: 'white', fontSize: 20}}>
              {/* TODO: make button disabled when nothing is entered */}
              Submit Suggestion
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    padding: 32,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    padding: 32,
    color: 'grey',
  },
  input: {
    marginLeft: 32,
    marginRight: 32,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 8,
    backgroundColor: 'whitesmoke',
    fontSize: 20,
    fontWeight: '700',
  },
  submitButton: {
    height: 64,
    marginLeft: 32,
    marginRight: 32,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cornflowerblue',
  },
});

export default SuggestActivityScreen;
