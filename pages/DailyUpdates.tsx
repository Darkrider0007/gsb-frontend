import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icons from '../Icons';
import { useNavigation } from '@react-navigation/native';
import { retrieveData } from '../utils/Storage';
import axios from 'axios';
import { BASE_URL } from '../global/server';
import moment from 'moment';

const DailyUpdates = () => {
  const navigation = useNavigation();

  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true); // To show feedback during API calls

  const getDailyUpdates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/update/${userId}`, {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      setDailyUpdates(response.data.reverse());
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false); // Stop loading once the API call is complete
    }
  };

  useEffect(() => {
    const getTokenUserId = async () => {
      try {
        const storedToken = await retrieveData('token');
        setToken(storedToken);
        const storedUserId = await retrieveData('userId');
        setUserId(storedUserId);
      } catch (error) {
        console.log('Error:', error);
      }
    };
    getTokenUserId();
    getDailyUpdates().catch(error => console.log('Error:', error));
  }, []);

  useEffect(() => {
    if (token && userId) {
      getDailyUpdates().catch(error => console.log('Error:', error));
    }
  }, [token, userId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.title}>My Daily Updates</Text>
        <View style={{ width: 25 }}></View>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading updates...</Text>
      ) : dailyUpdates.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven’t added any updates yet!
          </Text>
          <Text style={styles.emptySubText}>
            Click the "Add Update" button below to track your daily progress.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {dailyUpdates.map((item, index) => {
            const imageUrl = item?.updateImg?.secure_url;
            const formattedDate = moment(item.createdAt).format(
              'MMMM Do YYYY, h:mm:ss a',
            );
            return (
              <View key={index} style={styles.updateCard}>
                <View style={styles.imageContainer}>
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
                  ) : (
                    <View style={styles.noImageContainer}>
                      <Text style={styles.noImageText}>No Image</Text>
                    </View>
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>{item?.title}</Text>
                  <Text style={styles.descriptionText}>
                    {item?.description}
                  </Text>
                  <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            navigation.navigate('AddDailyUpdate');
          }}>
          <Text style={styles.submitButtonText}>Add Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DailyUpdates;

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
  scrollView: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  updateCard: {
    width: '100%',
    backgroundColor: '#ffe6c6',
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  imageContainer: {
    height: 220,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: 16,
  },
  noImageContainer: {
    height: '100%',
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: 'gray',
  },
  textContainer: {
    marginTop: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
  descriptionText: {
    color: 'black',
  },
  dateText: {
    color: 'gray',
    marginTop: 5,
  },
  addButtonContainer: {
    padding: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F6AF24',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});
