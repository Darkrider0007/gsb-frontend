// VideoPlayer.tsx
import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import YouTube from 'react-native-youtube-iframe';
import Header from '../Header';
import { useRoute } from '@react-navigation/native';
import Video from 'react-native-video';

const VideoPlayer = () => {
  const route = useRoute();
  const { videoId, title, desc } = route.params;

  console.log(videoId, title, desc);

  const screenWidth = Dimensions.get('window').width;
  const videoWidth = screenWidth - 40;
  const videoHeight = videoWidth * (9 / 16);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Video
          source={
            typeof videoId === 'string'
              ? { uri: videoId }
              : videoId
          }
          style={styles.video}
          resizeMode="cover"
          paused={false}
          controls
        />
        {/* <YouTube
          videoId={videoId}
          height={videoHeight}
          width={videoWidth}
          onError={e => console.log('YouTube Error:', e)}
        /> */}
        <View style={styles.textContainer}>
          <Text style={styles.videoTitle}>{title}</Text>
          <Text style={styles.videoDesc}>{desc}</Text>
        </View>
      </View>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
  },
  textContainer: {
    marginTop: 12,
    paddingVertical: 8,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 6,
  },
  videoDesc: {
    fontSize: 14,
    color: 'black',
    lineHeight: 20,
    opacity: 0.8,
  },
  video: {
    height: 220,
    width: '100%',
    borderRadius: 16,
  },
});
