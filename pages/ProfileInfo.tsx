import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icons from '../Icons';
import profile from '../assets/profile.png';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser, uploadProfileImage} from '../redux/authSlice'; // Adjust the path as needed
import {RootState} from '../redux/store';
import {retrieveData} from '../utils/Storage';
import {BASE_URL, postData} from '../global/server';
import axios from 'axios';

const UserProfileForm = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [fullName, setFullName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [address, setAddress] = useState(user?.address);
  const [profileImage, setProfileImage] = useState(
    user?.userImg?.secure_url || Image.resolveAssetSource(profile).uri,
  );
  const [token, setToken] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
    };
    getToken();

    console.log('user ', user?.data);
  }, []);

  const handleUploadProfileImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profileImage.jpg',
      });
      const response = await postData(
        `/api/user/upload-profile-image/${user?._id}`,
        formData,
        token,
        'media',
      );
      if (response && response.secure_url) {
        return response.secure_url;
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const handleSubmit = async () => {
    const imgUrl = await handleUploadProfileImage();
    if (imgUrl) {
      const updatedUser = await axios.put(
        `${BASE_URL}/api/user/${user?._id}`,
        {
          name: fullName,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
          userImg: {secure_url: imgUrl},
        },
        {headers: {token: `Bearer ${token}`}},
      );

      dispatch(updateUser(updatedUser));
      console.log('Updated user data:', updatedUser);
    } else {
      const updatedUser = await axios.put(
        `${BASE_URL}/api/user/${user?._id}`,
        {
          name: fullName,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
        },
        {headers: {token: `Bearer ${token}`}},
      );

      dispatch(updateUser(updatedUser.data));
      console.log('Updated user data:', updatedUser.data);
    }
    Alert.alert('Successfully Updated');
    navigation.goBack();
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.title}>View Profile</Text>
        <View style={{width: 25}}></View>
      </View>
      <View style={styles.profileImageContainer}>
        <Image source={{uri: profileImage}} style={styles.profileImage} />
        <TouchableOpacity
          onPress={handleImagePicker}
          style={styles.editIconContainer}>
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
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
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
          style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
          placeholder="Address"
          value={address}
          onChangeText={text => setAddress(text)}
          multiline
          placeholderTextColor={'gray'}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
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
