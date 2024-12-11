import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  headerText: string;
  bodyContent: string;
  onOkPress: () => void;
  onCancelPress?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  headerText,
  bodyContent,
  onOkPress,
}) => {
  if (!visible) return null;

  const {width, height} = Dimensions.get('window');

  return (
    <View style={[styles.overlay, {width, height}]}>
      <View style={styles.modalContainer}>
        <Text style={styles.headerText}>{headerText}</Text>
        <Text style={styles.bodyText}>{bodyContent}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.okButton} onPress={onOkPress}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  } as ViewStyle,
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: 'black',
  } as TextStyle,
  bodyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  } as TextStyle,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  } as ViewStyle,
  okButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  } as ViewStyle,
  okButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  } as TextStyle,
  closeButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  } as ViewStyle,
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  } as TextStyle,
});

export default CustomModal;
