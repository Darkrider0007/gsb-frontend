import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icons from '../../Icons';
import weight from '../../assets/weightMachine.png';
import mental from '../../assets/mentalHealth.png';
import {useDispatch, useSelector} from 'react-redux';
import {completeSignup} from '../../redux/authSlice';
import {BASE_URL} from '../../global/server';
import axios from 'axios';
import {RootState} from '../../redux/store';
import {retrieveData, storeData} from '../../utils/Storage';

const Goal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [token, setToken] = useState<string>(''); // State to store token
  const userId = useSelector((state: RootState) => state.auth.user?._id); // Fetch user ID from Redux storeconst {userId, token} = useSelector(state => state.auth); // Assume auth state has userId and token
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token'); // Retrieve token from AsyncStorage
      setToken(storedToken);
    };
    getToken();
  }, []);

  const handleGoalSelection = async (goal: string, navigateTo: string) => {
    const url = `${BASE_URL}/api/user/${userId}`;
    console.log(url);

    try {
      const response = await axios.put(
        url,
        {goal},
        {headers: {token: `Bearer ${token}`}},
      );
      console.log('Response from update:', response);

      if (response.status === 200) {
        if (navigateTo === 'FirstForm') {
          navigation.navigate('FirstForm', {goal});
        } else {
          dispatch(completeSignup());
          await storeData('isAuth', true);

          navigation.reset({
            index: 0,
            routes: [{name: 'TabNavigator'}],
          });
        }
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
        {/* <Text style={styles.subtitle}>Step 7 of 8</Text> */}
        <Text style={styles.title}>What's your goal?</Text>
        <Text style={{color: 'black', fontSize: 16, marginVertical: 10}}>
          you can change more than one. Don’t worry, you can always change it
          later
        </Text>
      </View>

      <View style={{flexDirection: 'column', gap: 40}}>
        <TouchableOpacity
          onPress={() => {
            handleGoalSelection("IBS Colitis & Crohn's", 'FirstForm');
          }}
          style={{
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
          }}>
          <Image source={weight} style={{width: 20, height: 20}} />
          <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
            IBS Colitis & Crohn's
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleGoalSelection('Diabetes', 'FirstForm');
          }}
          style={{
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
          }}>
          <Icons.MaterialCommunityIcons
            name="diabetes"
            size={25}
            color={'black'}
          />
          <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
            Diabetes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleGoalSelection('Mental Depression', 'TabNavigator');
          }}
          style={{
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
          }}>
          <Image source={mental} style={{width: 22, height: 20}} />
          <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
            Mental Depression
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleGoalSelection('E-Commerce', 'TabNavigator');
          }}
          style={{
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
          }}>
          <Icons.Feather name="shopping-bag" size={20} color={'black'} />
          <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
            E-Commerce
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'TabNavigator'}],
          });
        }}>
        <Text style={styles.buttonText}>Next Step</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Goal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
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
