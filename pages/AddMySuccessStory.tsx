import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icons from '../Icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL, postData } from '../global/server';
import { retrieveData } from '../utils/Storage';
import axios from 'axios';

const AddMySuccessStory = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false); // State to track whether a story is being submitted
  const [loading, setLoading] = useState(false);

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
          setImage({ uri: selectedImage.uri });
        }
      },
    );
  };
  const handleImage2Upload = () => {
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
          setImage2({ uri: selectedImage.uri });
        }
      },
    );
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    if (!submitting) {
      // Check if a story is already being submitted

      setSubmitting(true); // Set submitting state to true to prevent resubmission
      try {
        if (!token) {
          console.log('Token not available');
          return;
        }
        console.log(token)

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('userId', userId);
        formData.append('beforeStoryImg', {
          uri: image?.uri,
          type: 'image/jpeg',
          name: 'storyImg.jpg',
        });
        formData.append('afterStoryImg', {
          uri: image2?.uri,
          type: 'image/jpeg',
          name: 'storyImg2.jpg',
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
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Your Story</Text>
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
                <Text style={styles.imageText}>Capture Your Photo 'Before' Fitness Journey!</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.inputContainer, styles.imageInput]}
            onPress={handleImage2Upload}>
            {image2 ? (
              <Image source={image2} style={styles.image} />
            ) : (
              <View
                style={{ flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <Icons.MaterialIcons
                  name="add-a-photo"
                  color={'#F6AF24'}
                  size={30}
                />
                <Text style={styles.imageText}>Show Off Your Fitness Transformation!</Text>
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
              { backgroundColor: submitting ? '#fad791' : '#F6AF24' },
            ]}
            onPress={handleFormSubmit}>
            {loading ?
              <ActivityIndicator color="#FFFFFF" size="small" /> :
              <Text style={styles.uploadButtonText}>Upload</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
