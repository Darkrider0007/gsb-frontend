import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color } from '../../assets/constants/Color';
import Icons from '../../Icons';

const MeditationCard = ({ item }: any) => {
  console.log(item);
  const navigation = useNavigation();

  const handleVideoPress = () => {
    navigation.navigate('VideoPlayer', {
      videoId: item.videoUrl,
      title: item.title,
      desc: item.description,
    });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={handleVideoPress}
        style={styles.imageContainer}>
        <Image source={{ uri: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg" }} style={styles.cardImage} />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <TouchableOpacity onPress={handleVideoPress} style={styles.videoButton}>
          <Icons.Feather name="play-circle" color={'#FFA800'} size={18} />
          <Text style={styles.videoButtonText}>Watch Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#ffe6c6',
    borderRadius: 12,
  },
  imageContainer: {
    height: 120,
    width: 180,
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  cardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 18,
  },
  cardContent: {
    padding: 10,
    width: '50%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  cardDescription: {
    color: '#667085',
  },
  videoButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  videoButtonText: {
    color: Color.BrightOrange,
    fontSize: 16,
  },
});

export default MeditationCard;
