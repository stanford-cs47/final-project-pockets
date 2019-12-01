import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  Button,
} from 'react-native';
import {material} from 'react-native-typography';
import firestore from '../../firebase';
import firebase from 'firebase';
import DefaultActivities from '../Activities/DefaultActivities';

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
    };
  }

  // Check out this link to learn more about firebase.auth()
  // https://firebase.google.com/docs/reference/node/firebase.auth.Auth
  signUp = async () => {
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
      console.log(err);
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
      console.log(err);
    }
  };

  // TODO: give error messages for login
  render() {
    return (
      <SafeAreaView style={styles.container}>
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
          onChangeText={signUpPassword => this.setState({signUpPassword})}
          placeholder="Password"
        />
        <Button
          title="Sign Up"
          onPress={() => this.signUp()}
          color="cornflowerblue"
        />

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
        <Button
          title="Login"
          onPress={() => this.login()}
          color="cornflowerblue"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
    fontSize: 20,
    marginBottom: 10,
    backgroundColor: 'whitesmoke',
    padding: 5,
    borderRadius: 5,
  },
  button: {
    marginBottom: 50,
  },
});
