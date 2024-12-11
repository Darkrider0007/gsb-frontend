import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Color} from '../../assets/constants/Color';
import {useNavigation} from '@react-navigation/native';

const SupplementCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.card} onPress={() => {}}>
      <View style={styles.iconContainer}>
        {/* <Icon source={'cards-heart-outline'} size={25} color={'#8F959E'} /> */}
      </View>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.cardPrice}>INR {item.price}.00</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 12,
    borderColor: Color.BrightOrange,
    borderWidth: 1,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
    position: 'relative', // Added for positioning the icon
  },
  iconContainer: {
    position: 'absolute',
    top: 8, // Adjust based on spacing requirements
    right: 8, // Adjust based on spacing requirements
    zIndex: 1, // Ensures the icon is on top of the image
  },
  cardImage: {
    height: 150,
    width: '80%',
    borderRadius: 12,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: 'black',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: Color.GoldenAmber,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginTop: '5%',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
  },
});

export default SupplementCard;
