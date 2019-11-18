import * as React from 'react';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';

const DontShowModal = props => {
  return (
    <SafeAreaView>
      <Modal>
        <View>
          <Text>Hello</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DontShowModal;
