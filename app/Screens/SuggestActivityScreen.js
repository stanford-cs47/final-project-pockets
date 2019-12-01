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
          color={navigation.getParam('color', '#000')}
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
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.headerText}>
            Suggest an activity for all users to see
          </Text>
          <Text style={styles.text}>We're always looking for more ideas!</Text>
          <Text style={styles.text}>
            Be creative, but remember that you're suggesting an activity for{' '}
            <Text style={{fontStyle: 'italic'}}>everyone</Text> to see.{' '}
            {'\u263A'}
          </Text>
          {/* TODO: show alert modal when you have suggested an activity */}

          <View style={styles.inputContainer}>
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
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: '11%',
    height: '100%',
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 15,
  },
  input: {
    fontSize: 20,
    fontWeight: '700',
    flex: 2,
    backgroundColor: 'whitesmoke',
    padding: 10,
    paddingTop: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: 'cornflowerblue',
    flex: 1,
    width: '100%',
    borderRadius: 5,
    //   aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SuggestActivityScreen;
