import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Test from '../../components/ScrollNumberInput';
import ScrollNumberInput from '../../components/ScrollNumberInput';
import Icons from '../../Icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { retrieveData } from '../../utils/Storage';
import axios from 'axios';
import { BASE_URL } from '../../global/server';

const Weight = () => {
  const navigation = useNavigation();

  const [age, setAge] = useState<string>('18');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [token, setToken] = useState<string>(''); // State to store token
  const userId = useSelector((state: RootState) => state.auth.user._id); // Fetch user ID from Redux store, corrected property access
  const storedAge = useSelector((state: RootState) => state.auth.user.age); // Fetch user name from Redux store
  const [submitting, setSubmitting] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      if (storedAge) {
        navigation.navigate('Weight'); // If name is already in Redux store, navigate to next screen
      }
    }, [storedAge, navigation]),
  );

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token'); // Retrieve token from AsyncStorage
      setToken(storedToken);
    };
    getToken();
  }, []);

  const handleToggleUnit = () => {
    setUnit(unit === 'kg' ? 'lbs' : 'kg');
  };

  const handleAgeChange = (text: string) => {
    setAge(text);
  };

  const handleNextStep = async () => {
    const url = `${BASE_URL}/api/user/${userId}`;

    setSubmitting(true);

    try {
      const response = await axios.put(
        url,
        { age },
        { headers: { token: `Bearer ${token}` } },
      );
      console.log('Response from update:', response); // Add this line
      if (response) {
        navigation.navigate('Weight');
      } else {
        console.error('Failed to update user data:', response);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Step 4 of 8</Text>
      <Text style={styles.title}>What's your Age?</Text>

      <View style={styles.subcontainer}>
        <ScrollNumberInput setAge={setAge} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            editable={false}
            onChangeText={handleAgeChange}
            value={age}
            placeholderTextColor={'black'}
          // placeholder={18}
          />
          <Text style={styles.unit}>|</Text>
          <Text style={styles.unit}>Years</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        {
          submitting ? <ActivityIndicator color={'white'} /> :
            <Text style={styles.buttonText}>Next Step</Text>
        }
      </TouchableOpacity>
    </View>
  );
};

export default Weight;

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
    // paddingLeft: 20,
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    // paddingLeft: 20,
    color: 'black',
  },
  button: {
    backgroundColor: '#F6AF24',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: '20%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 20,
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButtonText: {
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
    width: '60%',
    justifyContent: 'center',
  },
  input: {
    width: 50,
    height: 40,
    paddingHorizontal: 10,
    color: 'black',
  },
  unit: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
