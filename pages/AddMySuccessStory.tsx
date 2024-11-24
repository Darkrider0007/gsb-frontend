import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from '../Icons';
import {launchImageLibrary} from 'react-native-image-picker';
import {BASE_URL, postData} from '../global/server';
import {retrieveData} from '../utils/Storage';
import axios from 'axios';

const AddMySuccessStory = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false); // State to track whether a story is being submitted

  useEffect(() => {
    const getTokenUserId = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
      const storedUserId = await retrieveData('userId');
      setUserId(storedUserId);
    };
    getTokenUserId();
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
          setImage({uri: selectedImage.uri});
        }
      },
    );
  };

  const handleFormSubmit = async () => {
    if (!submitting) {
      // Check if a story is already being submitted
      setSubmitting(true); // Set submitting state to true to prevent resubmission
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
          name: 'storyImg.jpg',
        });

        const response = await axios.post(`${BASE_URL}/api/story/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          navigation.navigate('MySuccessStories');
        } else {
          console.log('Upload failed');
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setSubmitting(false); // Reset submitting state after submission completes
      }
    }
  };

  console.log('create story token ', token);
  console.log('create story userId ', userId);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Story</Text>
        <View style={{width: 25}}></View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.inputContainer, styles.imageInput]}
          onPress={handleImageUpload}>
          {image ? (
            <Image source={image} style={styles.image} />
          ) : (
            <View
              style={{flexDirection: 'column', alignItems: 'center', gap: 5}}>
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
        />
        <TextInput
          style={[styles.inputContainer, styles.textInput]}
          placeholder="Enter your story here..."
          multiline
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={'gray'}
        />
        <TouchableOpacity
          style={[
            styles.uploadButton,
            {backgroundColor: submitting ? '#fad791' : '#F6AF24'},
          ]}
          onPress={handleFormSubmit}>
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddMySuccessStory;

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    borderWidth: 2, // Increase border width for spacing between dots
    borderColor: 'gray', // Same as container border color
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
    height: 150, // Increase the height as needed
    textAlignVertical: 'top', // Ensure text starts from the first line
  },
  uploadButton: {
    backgroundColor: '#F6AF24',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
