import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Icons from '../Icons';
import profile from '../assets/profile.png';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { retrieveData } from '../utils/Storage';
import { BASE_URL } from '../global/server';
import axios from 'axios';

const UserProfileForm = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [fullName, setFullName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [address, setAddress] = useState(user?.address);
  const [profileImage, setProfileImage] = useState(
    user?.userImg || Image.resolveAssetSource(profile).uri,
  );
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
    };
    getToken();

    console.log('user ', user);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('name', fullName);
      formData.append('phoneNumber', phoneNumber);
      formData.append('address', address);

      if (profileImage && profileImage !== user?.userImg?.secure_url) {
        formData.append('file', {
          uri: profileImage,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await axios.put(
        `${BASE_URL}/api/user/${user?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Updated user data:', response.data);
        dispatch(updateUser(response.data));
        Alert.alert('Successfully Updated');
        navigation.goBack();
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Failed to update user data');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          setProfileImage(selectedImage.uri);
        }
      },
    );
  };

  const isSubmitDisabled = !phoneNumber || phoneNumber.length !== 10;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.title}>View Profile</Text>
          <View style={{ width: 25 }}></View>
        </View>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.editIconContainer}
          >
            <Icons.AntDesign name="edit" color={'#F6AF24'} size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={text => setFullName(text)}
            placeholderTextColor={'gray'}
          />
          <TextInput
            style={[styles.input, { backgroundColor: '#f5f5f5' }]} // Slightly different style to indicate disabled
            placeholder="Email"
            value={email}
            editable={false} // Disable the email field
            placeholderTextColor={'gray'}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            keyboardType="phone-pad"
            placeholderTextColor={'gray'}
          />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Address"
            value={address}
            onChangeText={text => setAddress(text)}
            multiline
            placeholderTextColor={'gray'}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitDisabled && { backgroundColor: 'gray' },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserProfileForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600',
  },
  profileImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 50,
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 18,
    paddingHorizontal: 10,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#F6AF24',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
