import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icons from '../../Icons';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {retrieveData} from '../../utils/Storage';
import {BASE_URL} from '../../global/server';
import axios from 'axios';

const Name = () => {
  const navigation = useNavigation();
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [error, setError] = useState<{[key: string]: string}>({});
  const [token, setToken] = useState<string>('');
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const storedName = useSelector((state: RootState) => state.auth?.user?.name);

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
    setError(prev => ({...prev, name: ''}));
  };

  const handlePhoneChange = (text: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(text) && text.length <= 10) {
      setPhoneNumber(text);
      setError(prev => ({...prev, phone: ''}));
    }
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    setError(prev => ({...prev, address: ''}));
  };

  const handleDobChange = (text: string) => {
    // Format input as DD/MM/YYYY
    const formatted = text
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substr(0, 10);
    setDob(formatted);
    setError(prev => ({...prev, dob: ''}));
  };

  const validateInputs = () => {
    const newErrors: {[key: string]: string} = {};

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
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
    if (!dob.trim()) {
      newErrors.dob = 'Please enter your date of birth';
    } else if (!dobRegex.test(dob.trim())) {
      newErrors.dob = 'Please enter a valid date in DD/MM/YYYY format';
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

    try {
      const response = await axios.put(
        url,
        {name: name.trim()},
        {headers: {token: `Bearer ${token}`}},
      );

      if (response?.data) {
        navigation.navigate('Age');
      } else {
        setError(prev => ({...prev, submit: 'Failed to update user data'}));
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
      <View style={{flexDirection: 'row', width: '80%'}}>
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          error[errorKey] ? styles.inputError : null,
        ]}>
        <TextInput
          style={[styles.input, props.multiline && {height: 80}]}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={'black'}
          {...props}
        />
      </View>
      {error[errorKey] ? (
        <Text style={styles.errorText}>{error[errorKey]}</Text>
      ) : null}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}} />
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
            keyboardType: 'numeric',
            maxLength: 10,
            caretHidden: false,
            keyboardType: 'number-pad',
            returnKeyType: 'done',
            onKeyPress: ({nativeEvent}) => {
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
          {multiline: true, numberOfLines: 3},
        )}

        {renderInput(
          'Date of Birth',
          dob,
          handleDobChange,
          'dob',
          'DD/MM/YYYY',
          {keyboardType: 'numeric', maxLength: 10},
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          !(name.trim() && phoneNumber.trim() && address.trim() && dob.trim())
            ? styles.buttonDisabled
            : null,
        ]}
        onPress={handleNextStep}>
        <Text style={styles.buttonText}>Next Step</Text>
      </TouchableOpacity>
    </View>
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
