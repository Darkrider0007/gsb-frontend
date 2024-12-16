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
import Icons from '../../Icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { retrieveData } from '../../utils/Storage';
import { BASE_URL } from '../../global/server';
import axios from 'axios';

const GoalHeight = () => {
  const navigation = useNavigation();

  const [goalHeight, setGoalHeight] = useState<string>('');
  const [unit, setUnit] = useState<'feet' | 'cm'>('feet');

  const [token, setToken] = useState<string>(''); // State to store token
  const userId = useSelector((state: RootState) => state.auth.user?._id); // Fetch user ID from Redux store
  const storedWeight = useSelector(
    (state: RootState) => state.auth.user?.goalHeight,
  ); // Fetch user name from Redux store
  const [submitting, setSubmitting] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      if (storedWeight) {
        navigation.navigate('GetStarted'); // If name is already in Redux store, navigate to next screen
      }
    }, [storedWeight, navigation]),
  );
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token'); // Retrieve token from AsyncStorage
      setToken(storedToken);
    };
    getToken();
  }, []);

  const handleToggleUnit = () => {
    setUnit(unit === 'feet' ? 'cm' : 'feet');
  };

  const handleGoalHeightChange = (text: string) => {
    setGoalHeight(text);
  };

  const handleNextStep = async () => {
    const url = `${BASE_URL}/api/user/${userId}`;

    try {
      const response = await axios.put(
        url,
        { goalHeight: `${goalHeight} ${unit}` },
        { headers: { token: `Bearer ${token}` } },
      );

      console.log('Response from update:', response);

      if (response.data) {
        navigation.navigate('GetStarted');
      } else {
        console.error('Failed to update user data:', response);
      }
    } catch (error) {
      console.error('Error updating user:', error);
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
      <Text style={styles.subtitle}>Step 7 of 8</Text>
      <Text style={styles.title}>What's your goal height?</Text>

      <View style={styles.subcontainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleToggleUnit}>
          <Text style={styles.toggleButtonText}>
            {unit === 'feet' ? 'Feet' : 'cm'}
          </Text>
          <Text style={styles.toggleButtonText}>
            {unit === 'feet' ? 'cm' : 'Feet'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={handleGoalHeightChange}
            value={goalHeight}
            placeholder="175"
            placeholderTextColor={'black'}
          />
          <Text style={styles.unit}>|</Text>
          <Text style={styles.unit}>{unit}</Text>
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

export default GoalHeight;

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
    color: 'black',
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
