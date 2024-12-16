import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icons from '../../Icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { retrieveData } from '../../utils/Storage';
import { BASE_URL } from '../../global/server';
import axios from 'axios';
import DatePicker from 'react-native-date-picker'; // Import the date picker

const Name = () => {
  const navigation = useNavigation();
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [openCalendar, setOpenCalendar] = useState<boolean>(false); // State to control the calendar visibility
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [token, setToken] = useState<string>('');
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const storedName = useSelector((state: RootState) => state.auth?.user?.name);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      if (storedName) {
        navigation.navigate('Age');
      }
    }, [storedName, navigation]),
  );

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
    };
    getToken();
  }, []);

  const handleNameChange = (text: string) => {
    setName(text);
    setError(prev => ({ ...prev, name: '' }));
  };

  const handlePhoneChange = (text: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(text) && text.length <= 10) {
      setPhoneNumber(text);
      setError(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    setError(prev => ({ ...prev, address: '' }));
  };

  const handleDobChange = (date: Date) => {
    const formattedDate = date
      .toLocaleDateString('en-GB')
      .replace(/-/g, '/');
    setDob(formattedDate);
    setSelectedDate(date);
    setError(prev => ({ ...prev, dob: '' }));
    setOpenCalendar(false);
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!phoneRegex.test(phoneNumber.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Validate address
    if (!address.trim()) {
      newErrors.address = 'Please enter your address';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    // Validate date of birth
    if (!dob.trim()) {
      newErrors.dob = 'Please select your date of birth';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (!validateInputs()) {
      Alert.alert('Error', 'Please fill all fields correctly to continue');
      return;
    }

    const url = `${BASE_URL}/api/user/${userId}`;
    setSubmitting(true);

    try {
      const response = await axios.put(
        url,
        {
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
          dob: dob.trim()
        },
        { headers: { token: `Bearer ${token}` } },
      );

      if (response?.data) {
        navigation.navigate('Age');
      } else {
        setError(prev => ({ ...prev, submit: 'Failed to update user data' }));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(prev => ({
        ...prev,
        submit: 'An error occurred while saving your data',
      }));
      Alert.alert('Error', 'Failed to save your data. Please try again.');
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    errorKey: string,
    placeholder: string,
    props: any = {},
  ) => (
    <>
      <View style={{ flexDirection: 'row', width: '80%' }}>
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          error[errorKey] ? styles.inputError : null,
        ]}>
        <TextInput
          style={[styles.input, props.multiline && { height: 80 }]}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={'#D3D3D3'} // Light grey hex code
          {...props}
        />
      </View>
      {error[errorKey] ? (
        <Text style={styles.errorText}>{error[errorKey]}</Text>
      ) : null}
    </>
  );

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ marginBottom: 10 }} />
        <Text style={styles.subtitle}>Step 3 of 8</Text>
        <Text style={styles.title}>Enter your Details?</Text>

        <View style={styles.subcontainer}>
          {renderInput(
            'Write your Name',
            name,
            handleNameChange,
            'name',
            'John Doe',
          )}

          {renderInput(
            'Phone Number',
            phoneNumber,
            handlePhoneChange,
            'phone',
            '1234567890',
            {
              maxLength: 10,
              caretHidden: false,
              keyboardType: 'phone-pad',
              returnKeyType: 'done',
              onKeyPress: ({ nativeEvent }: any) => {
                // Allow only numeric input
                if (
                  !/^[0-9]$/.test(nativeEvent.key) &&
                  nativeEvent.key !== 'Backspace'
                ) {
                  nativeEvent.preventDefault();
                }
              },
            },
          )}

          {renderInput(
            'Address',
            address,
            handleAddressChange,
            'address',
            'Enter your full address',
            { multiline: true, numberOfLines: 3 },
          )}

          <View>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                error.dob ? styles.inputError : null,
              ]}
              onPress={() => setOpenCalendar(true)}>
              <Text style={styles.input}>
                {dob || 'Select your date of birth'}
              </Text>
            </TouchableOpacity>
            {error.dob ? (
              <Text style={styles.errorText}>{error.dob}</Text>
            ) : null}
          </View>

          <DatePicker
            modal
            open={openCalendar}
            date={selectedDate || new Date()}
            mode="date"
            maximumDate={new Date()}
            onConfirm={(date) => handleDobChange(date)}
            onCancel={() => setOpenCalendar(false)}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            !(name.trim() && phoneNumber.trim() && address.trim() && dob.trim())
              ? styles.buttonDisabled
              : null,
          ]}
          onPress={handleNextStep}
          disabled={!(name.trim() && phoneNumber.trim() && address.trim() && dob.trim()) || submitting}
        >

          {
            submitting ?
              <ActivityIndicator size="small" color="white" /> :
              <Text style={styles.buttonText}>Next Step</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Name;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  subcontainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
  },
  inputLabel: {
    color: 'black',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#F6AF24',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: '20%',
  },
  buttonDisabled: {
    backgroundColor: '#F6AF2480',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    justifyContent: 'center',
    marginBottom: 15,
  },
  inputError: {
    borderColor: 'red',
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    color: 'black',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
    marginBottom: 10,
  },
});
