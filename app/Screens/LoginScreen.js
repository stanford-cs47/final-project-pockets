import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {material} from 'react-native-typography';
import firestore from '../../firebase';
import firebase from 'firebase';
import DefaultActivities from '../Activities/DefaultActivities';
import {ScrollView} from 'react-native-gesture-handler';

export default class LoginScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};

    return {
      headerTitle: (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={material.body2}>Unsplash</Text>
          <Text style={[material.caption, {fontSize: 10}]}>Login</Text>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      signUpName: '',
      signUpEmail: '',
      signUpPassword: '',
      loginEmail: '',
      loginPassword: '',
      errorMessageLogin: '',
      newUser: false,
    };
  }

  // Check out this link to learn more about firebase.auth()
  // https://firebase.google.com/docs/reference/node/firebase.auth.Auth
  signUp = async () => {
    if (this.state.signUpName === '') {
      Alert.alert('Oh no!', 'You must enter a name to sign up');
      return;
    }

    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.state.signUpEmail,
          this.state.signUpPassword,
        );
      if (response.user) {
        const user = firebase.auth().currentUser;
        var userDocRef = firestore.doc('users/' + user.uid);

        // creates new user document
        userDocRef.set({
          name: this.state.signUpName,
        });

        // Reloads activities from default activities - delete collection on firebase and do this when we want to change/add things
        // let activitiesCollRef = firestore.collection('/activities');
        // DefaultActivities.forEach(async act => {
        //   let newActRef = activitiesCollRef.doc();
        //   newActRef.set(act);
        // });
      }
    } catch (err) {
      console.log(err.message);
      Alert.alert('Oh no!', err.message);
    }
  };

  // Check out this link to learn more about firebase.auth()
  // https://firebase.google.com/docs/reference/node/firebase.auth.Auth
  login = async () => {
    try {
      // Note that we don't have to tell the app that the user has logged in.
      // firebase.auth().onAuthStateChanged() in App.js communicates this for us!
      await firebase
        .auth()
        .signInWithEmailAndPassword(
          this.state.loginEmail,
          this.state.loginPassword,
        );
    } catch (err) {
      console.log(err.message);
      Alert.alert('Oh no!', err.message);
    }
  };

  render() {
    return (
      <SafeAreaView style={{height: '100%'}}>
        <KeyboardAvoidingView
          style={{height: '100%'}}
          behavior="position"
          enabled>
          <ScrollView>
            <View style={styles.container}>
              <Image
                style={{width: 200, height: 200}}
                source={require('../Images/Logo.png')}
              />
            </View>
            <Text style={styles.headerText}>
              {this.state.newUser
                ? 'New Pockets Account'
                : 'Welcome Back to Pockets'}
            </Text>
            {this.state.newUser && (
              <>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  value={this.state.signUpName}
                  onChangeText={signUpName => this.setState({signUpName})}
                  placeholder="Name"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  value={this.state.signUpEmail}
                  onChangeText={signUpEmail => this.setState({signUpEmail})}
                  placeholder="Email"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  value={this.state.signUpPassword}
                  secureTextEntry={true}
                  onChangeText={signUpPassword =>
                    this.setState({signUpPassword})
                  }
                  placeholder="Password"
                />
                <TouchableOpacity
                  onPress={() => this.signUp()}
                  style={styles.button}>
                  <Text
                    style={{fontWeight: '700', color: 'white', fontSize: 20}}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({newUser: false})}>
                  <Text style={styles.textButton}>
                    Already have an account?
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {!this.state.newUser && (
              <>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, {marginTop: 50}]}
                  value={this.state.loginEmail}
                  onChangeText={loginEmail => this.setState({loginEmail})}
                  placeholder="Email"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  value={this.state.loginPassword}
                  secureTextEntry={true}
                  onChangeText={loginPassword => this.setState({loginPassword})}
                  placeholder="Password"
                />
                <TouchableOpacity
                  onPress={() => this.login()}
                  style={styles.button}>
                  <Text
                    style={{fontWeight: '700', color: 'white', fontSize: 20}}>
                    Log In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({newUser: true})}>
                  <Text style={styles.textButton}>New to Pockets?</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 65,
    paddingBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    padding: 32,
    textAlign: 'center',
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
  button: {
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
  textButton: {
    padding: 16,
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
    color: 'cornflowerblue',
  },
});
