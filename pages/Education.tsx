import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icons from '../Icons';
import gsbLogo from '../assets/gsbtransparent.png';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL, getData} from '../global/server';
import {retrieveData} from '../utils/Storage';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import Video from 'react-native-video';
import axios from 'axios';

const Education = () => {
  const navigation = useNavigation();
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const fetchedUserId = useSelector((state: RootState) => state.auth.user?._id);
  const [userId, setUserId] = useState(fetchedUserId);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch userId and token
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
    };

    const getUserId = async () => {
      const storedUserId = await retrieveData('userId');
      setUserId(storedUserId);
    };
    getToken();
    getUserId();
  }, []);

  useEffect(() => {
    const fetchContentVideos = async () => {
      try {
        const response = await getData('/api/contentVideo', token);

        const filteredData = response?.filter(
          video => video.category === 'education',
        );
        setEducationData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content videos', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchContentVideos();
    }
  }, [token]);

  // Helper function to truncate text to a specified number of words
  const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFA800" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meditation</Text>
        <Image source={gsbLogo} style={styles.logo} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {educationData?.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.videoContainer}>
                <Video
                  source={{uri: item?.videoMedia?.secure_url}}
                  style={styles.video}
                  controls={true}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{truncateText(item.title, 3)}</Text>
                <Text style={styles.description}>
                  {truncateText(item.description, 5)}
                </Text>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => {
                    setSelectedVideo(item?.videoMedia?.secure_url);
                    setModalVisible(true);
                  }}>
                  <Icons.Feather
                    name="play-circle"
                    color={'#FFA800'}
                    size={18}
                  />
                  <Text style={styles.playButtonText}>Watch Video</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedVideo && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setSelectedVideo(null);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.closeButton}>
                <TouchableOpacity
                  style={styles.closeButtonIcon}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setSelectedVideo(null);
                  }}>
                  <Icons.AntDesign name="closecircle" size={30} color="black" />
                </TouchableOpacity>
              </View>

              <Video
                source={{uri: selectedVideo}}
                style={styles.modalVideo}
                controls={true}
                resizeMode="cover"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Education;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: '800',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  scrollView: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contentContainer: {
    flexDirection: 'column',
    gap: 14,
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#ffe6c6',
    borderRadius: 12,
  },
  videoContainer: {
    height: 120,
    width: 180,
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  video: {
    height: '100%',
    width: '100%',
    borderRadius: 18,
  },
  textContainer: {
    padding: 10,
    width: '50%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  description: {
    color: 'black',
  },
  playButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFA800',
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  modalVideo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  closeButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonIcon: {
    backgroundColor: 'white',
  },
});
