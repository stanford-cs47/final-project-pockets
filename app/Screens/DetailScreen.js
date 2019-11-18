import * as React from 'react';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  View,
  Button,
} from 'react-native';

import DontShowModal from '../Components/DontShowModal';

const DetailScreen = props => {
  const {navigation} = props;

  const [modalOpen, setModalOpen] = React.useState(false);
  console.log(modalOpen);

  // TODO: error handling if there is no object passed through for an activity
  const activity = JSON.parse(
    JSON.stringify(navigation.getParam('activity', {})),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={modalOpen}
        transparent={true}
        onRequestClose={() => {
          setModalOpen(false);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={{fontSize: 20}}>
              Are you sure you no longer want to see this activity suggestion?
            </Text>
            <Button title="Yes" />
            <Button
              title="No"
              onPress={() => {
                setModalOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Text style={styles.activityText}>{activity.title}</Text>
      <Image
        source={
          activity.img == null ? require('../Images/pocket.png') : activity.img
        }
        style={styles.image}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sounds good</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModalOpen(true);
        }}>
        <Text style={{fontSize: 20, textDecorationLine: 'underline'}}>
          Don't show me this activity again
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  image: {
    width: '75%',
    height: '50%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    marginBottom: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
  activityText: {
    fontSize: 30,
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    height: '60%',
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
  },
});
