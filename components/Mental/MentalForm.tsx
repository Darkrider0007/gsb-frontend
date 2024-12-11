import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomModal from '../CustomModal'; // Import CustomModal
import {Color} from '../../assets/constants/Color';

interface MentalFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
  };
  handleChange: (field: string, value: string) => void;
  handleSubmit: () => void;
}

const MentalForm: React.FC<MentalFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Track submit button state
  const navigation = useNavigation();

  // Check if all fields are filled
  useEffect(() => {
    const isFormValid =
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phoneNumber &&
      formData.message;
    setIsSubmitEnabled(isFormValid); // Enable submit button if all fields are filled
  }, [formData]);

  const handleFormSubmit = () => {
    try {
      handleSubmit(); // Perform the form submission logic
      setModalMessage('Form submitted successfully!');
      setModalVisible(true);
    } catch (error) {
      setModalMessage('An error occurred. Please try again.');
      setModalVisible(true);
    }
  };

  const handleOkPress = () => {
    setModalVisible(false);
    navigation.navigate('Home'); // Navigate to the Home page
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mental Depression</Text>
        <Text style={styles.subtitle}>
          Consult from our top doctors and certified members who will help you
          in your journey of GSB.
        </Text>
      </View>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.firstName}
        placeholderTextColor={'#000'}
        onChangeText={text => handleChange('firstName', text)}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.lastName}
        placeholderTextColor={'#000'}
        onChangeText={text => handleChange('lastName', text)}
      />
      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="you@company.com"
        value={formData.email}
        placeholderTextColor={'#000'}
        onChangeText={text => handleChange('email', text)}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={formData.phoneNumber}
        placeholderTextColor={'#000'}
        onChangeText={text => handleChange('phoneNumber', text)}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
        placeholder="Enter Message"
        value={formData.message}
        placeholderTextColor={'#000'}
        onChangeText={text => handleChange('message', text)}
        multiline
      />

      <Text style={styles.infoText}>
        We will connect you within 24hrs or call us.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: isSubmitEnabled ? Color.GoldenAmber : '#ccc'},
        ]}
        onPress={handleFormSubmit}
        disabled={!isSubmitEnabled} // Disable the button if the form is not filled
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* CustomModal Integration */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        headerText="Submission Status"
        bodyContent={modalMessage}
        onOkPress={handleOkPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 20,
    color: 'black',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    marginVertical: 10,
  },
  subtitle: {
    textAlign: 'center',
    width: '60%',
    color: 'black',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: Color.MediumGray,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 15,
    color: 'black',
  },
  infoText: {
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default MentalForm;
