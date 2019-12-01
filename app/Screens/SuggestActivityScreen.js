import * as React from 'react';
import firebase from 'firebase';
import firestore from '../../firebase';

import {
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

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.headerText}>
            Recommend an activity for all users to see!
          </Text>
          <Text style={styles.text}>
            Be creative, but remember that this is a suggestion for everyone.{' '}
            {'\u263A'}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input]}
              placeholder={'Your activity here'}
              onChangeText={suggestion =>
                this.setState({suggestionText: suggestion})
              }
              value={this.state.suggestionText}
            />
            <TouchableOpacity
              onPress={() => {
                console.log(this.state.suggestionText);
                this.setState({suggestionText: ''});
              }}>
              <View
                style={{
                  backgroundColor: 'blue',
                  flex: 1,
                  borderRadius: 5,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>Ok</Text>
              </View>
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
    marginBottom: 15,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 15,
  },
  input: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginTop: 10,
    backgroundColor: 'whitesmoke',
    padding: 5,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SuggestActivityScreen;
