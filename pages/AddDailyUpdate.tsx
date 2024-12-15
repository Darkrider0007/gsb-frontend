import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icons from '../Icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from '../global/server';
import { retrieveData } from '../utils/Storage';
import axios from 'axios';

const AddDailyUpdate = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const descriptionInputRef = useRef(null);

  useEffect(() => {
    const getTokenUserId = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
      const storedUserId = await retrieveData('userId');
      setUserId(storedUserId);
    };
    getTokenUserId();
  }, []);

  useEffect(() => {
    const keyboardDidShow = () => setKeyboardVisible(true);
    const keyboardDidHide = () => setKeyboardVisible(false);

    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, []);

  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (
          !response.didCancel &&
          !response.error &&
          response.assets.length > 0
        ) {
          const selectedImage = response.assets[0];
          setImage({ uri: selectedImage.uri });
        }
      },
    );
  };

  const handleFormSubmit = async () => {
    if (!title || !description || !image) return; // Ensure form validation
    setLoading(true);
    if (!submitting) {
      setSubmitting(true);
      try {
        if (!token) {
          console.log('Token not available');
          return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('userId', userId);
        formData.append('file', {
          uri: image?.uri,
          type: 'image/jpeg',
          name: 'updateImg.jpg',
        });

        const response = await axios.post(`${BASE_URL}/api/update/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          navigation.navigate('DailyUpdates');
        } else {
          console.log('Upload failed');
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    }
  };

  const isFormValid = title && description && image; // Check form validity

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Today's Update</Text>
          <View style={{ width: 25 }}></View>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.inputContainer, styles.imageInput]}
            onPress={handleImageUpload}>
            {image ? (
              <Image source={image} style={styles.image} />
            ) : (
              <View
                style={{ flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <Icons.MaterialIcons
                  name="add-a-photo"
                  color={'#F6AF24'}
                  size={30}
                />
                <Text style={styles.imageText}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.inputContainer}
            placeholder="Enter your title here..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={'gray'}
            returnKeyType="next"
            onSubmitEditing={() => descriptionInputRef.current?.focus()}
          />
          <TextInput
            style={[styles.inputContainer, styles.textInput]}
            placeholder="Enter your update here..."
            multiline
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={'gray'}
            ref={descriptionInputRef}
          />
          <TouchableOpacity
            style={[
              styles.uploadButton,
              {
                backgroundColor: isFormValid ? '#F6AF24' : '#fad791',
              },
            ]}
            onPress={handleFormSubmit}
            disabled={!isFormValid || submitting}>
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.uploadButtonText}>
                {isFormValid ? 'Upload' : 'Fill All Fields'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddDailyUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50, // Add padding to prevent button from hiding
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: 'black',
  },
  imageInput: {
    borderStyle: 'dotted',
    borderWidth: 2,
    borderColor: 'gray',
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    textAlign: 'center',
    color: 'gray',
  },
  image: {
    width: 280,
    height: 160,
    borderRadius: 5,
  },
  textInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  uploadButton: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
