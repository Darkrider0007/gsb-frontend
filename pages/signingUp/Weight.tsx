import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icons from '../../Icons';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {retrieveData} from '../../utils/Storage';
import {BASE_URL} from '../../global/server'; // Assuming BASE_URL is exported from here
import axios from 'axios';

const Weight = () => {
  const navigation = useNavigation();

  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  const [token, setToken] = useState<string>(''); // State to store token
  const userId = useSelector((state: RootState) => state.auth.user?._id); // Fetch user ID from Redux store
  const storedWeight = useSelector(
    (state: RootState) => state.auth.user?.weight,
  ); // Fetch user name from Redux store

  console.log(storedWeight);

  useFocusEffect(
    React.useCallback(() => {
      if (storedWeight) {
        navigation.navigate('GoalWeight'); // If name is already in Redux store, navigate to next screen
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
    setUnit(unit === 'kg' ? 'lbs' : 'kg');
  };

  const handleWeightChange = (text: string) => {
    setWeight(text);
  };

  const handleNextStep = async () => {
    const url = `${BASE_URL}/api/user/${userId}`;

    try {
      const response = await axios.put(
        url,
        {weight: `${weight} ${unit}`},
        {headers: {token: `Bearer ${token}`}},
      );

      console.log('Response from update:', response);

      if (response.data) {
        navigation.navigate('GoalWeight');
      } else {
        console.error('Failed to update user data:', response);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Step 5 of 8</Text>
      <Text style={styles.title}>What's your weight?</Text>

      <View style={styles.subcontainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleToggleUnit}>
          <Text style={styles.toggleButtonText}>
            {unit === 'kg' ? 'LBS' : 'KG'}
          </Text>
          <Text style={styles.toggleButtonText}>
            {unit === 'lbs' ? 'LBS' : 'KG'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={handleWeightChange}
            value={weight}
            placeholderTextColor={'black'}
            placeholder="60"
          />
          <Text style={styles.unit}>|</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Next Step</Text>
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
