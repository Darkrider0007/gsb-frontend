import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video'; // Import the Video component
import splashVideo from '../assets/splash2.mp4';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.navigate('SignUp');
    }, 4000); // Adjust timeout to match video duration

    // Clean up the timeout when the component unmounts or when the effect runs again
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Video
        source={splashVideo} // Provide the source of your splash video
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject} // Make the video fullscreen
        onEnd={() => navigation.replace('SignUp')} // Navigate to 'SignUp' screen when the video ends
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
