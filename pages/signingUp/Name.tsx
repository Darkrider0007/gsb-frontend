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
  const [error, setError] = useState<string>('');
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
    setError(''); // Clear error when user starts typing
  };

  const validateName = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (!validateName()) {
      Alert.alert('Error', 'Please enter a valid name to continue');
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
        setError('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('An error occurred while saving your name');
      Alert.alert('Error', 'Failed to save your name. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}} />
      <Text style={styles.subtitle}>Step 3 of 8</Text>
      <Text style={styles.title}>What's your Name?</Text>

      <View style={styles.subcontainer}>
        <View style={{flexDirection: 'row', width: '80%'}}>
          <Text
            style={{
              color: 'black',
              textAlign: 'left',
              fontSize: 18,
              fontWeight: '600',
            }}>
            Write your Name
          </Text>
        </View>
        <View style={[styles.inputContainer, error ? styles.inputError : null]}>
          <TextInput
            style={styles.input}
            onChangeText={handleNameChange}
            value={name}
            placeholder="John Doe"
            placeholderTextColor={'black'}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <TouchableOpacity 
        style={[
          styles.button, 
          !name.trim() ? styles.buttonDisabled : null
        ]} 
        onPress={handleNextStep}
      >
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
  button: {
    backgroundColor: '#F6AF24',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: '20%',
  },
  buttonDisabled: {
    backgroundColor: '#F6AF2480', // Adding opacity to show disabled state
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
  },
});