import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

export default function MessageModal({
  visible,
  message,
  buttonText,
  onPress,
  success,
  isDarkMode,
}) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
              borderColor: isDarkMode ? '#404040' : '#e0e0e0',
            },
          ]}>
          <Text
            style={[styles.modalText, {color: isDarkMode ? '#fff' : '#333'}]}>
            {message}
          </Text>
          <TouchableOpacity
            style={[
              styles.modalButton,
              {backgroundColor: success ? '#4CAF50' : '#f44336'},
              isDarkMode && {opacity: 0.9},
            ]}
            onPress={onPress}>
            <Text style={styles.modalButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: width * 0.85,
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
  },
  successBorder: {
    borderColor: '#4CAF50',
  },
  failureBorder: {
    borderColor: '#f44336',
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    color: '#333',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  failureButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
