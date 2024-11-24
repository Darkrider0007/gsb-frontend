import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icons from '../Icons';
import gsbLogo from '../assets/gsbtransparent.png';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {retrieveData} from '../utils/Storage';
import {getData} from '../global/server';

const Nutrition = () => {
  const navigation = useNavigation();
  const [dietData, setDietData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const fetchedUserId = useSelector(state => state.auth.user?._id);
  const [userId, setUserId] = useState(fetchedUserId);

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
    const fetchDietPdfs = async () => {
      try {
        const response = await getData('/api/dietPdf', token);
        setDietData(response);
        console.log(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching diet PDFs', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchDietPdfs();
    }
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Diet</Text>
        <Image source={gsbLogo} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {dietData.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.iconContainer}>
                <Icons.FontAwesome
                  name="file-pdf-o"
                  color={'black'}
                  size={35}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => {
                    // Logic to download the PDF
                    Linking.openURL(item.url);
                  }}>
                  <Icons.AntDesign
                    name="download"
                    color={'#FFA800'}
                    size={18}
                  />
                  <Text style={styles.downloadText}>Download pdf</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Nutrition;

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
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '800',
  },
  scrollView: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#ffe6c6',
    borderRadius: 12,
    marginBottom: 10,
  },
  iconContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'center',
  },
  textContainer: {
    padding: 10,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  description: {
    color: 'black',
  },
  downloadButton: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  downloadText: {
    color: '#FFA800',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
