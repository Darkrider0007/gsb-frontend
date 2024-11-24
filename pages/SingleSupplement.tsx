import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getData} from '../global/server';
import {useDispatch} from 'react-redux';
import {addToCart} from '../redux/cartSlice';
import ImageViewer from 'react-native-image-zoom-viewer';
import {retrieveData} from '../utils/Storage';
import Icons from '../Icons';
import ImageCarousel from '../components/ImageCarousel';
import gsbLogo from '../assets/gsbtransparent.png';

const SingleSupplement = () => {
  const route = useRoute();
  const {productId} = route.params;
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token');
      console.log(storedToken);
      setToken(storedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (token) {
        try {
          const data = await getData(`/api/supplement/${productId}`, token);
          setProduct(data);
          console.log(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }
    };
    if (token) {
      fetchProduct();
    }
  }, [token, productId]);

  const handleAddToCart = item => {
    dispatch(addToCart({...item, id: item._id, quantity: 1}));
  };

  const handleImageTap = image => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!product) {
    return <Text>No product found</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Image source={gsbLogo} />
        <View style={{width: 10}}>
          {/* <Text style={{color: 'white'}}>GSB</Text> */}
        </View>
      </View>

      <ScrollView>
        <ImageCarousel images={product.productImgs} />
        <Text style={styles.productTitle}>{product.name}</Text>
        <Text style={styles.productPrice}>INR {product.price}.00</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(product)}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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
    paddingHorizontal: 16,
  },

  imageContainer: {
    backgroundColor: 'red',
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productImage: {
    width: '100%',
    height: '100%',
    margin: 5,
  },
  productTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
  },
  productPrice: {
    fontSize: 18,
    color: 'gray',
    margin: 10,
  },
  productDescription: {
    color: 'black',
    fontSize: 16,
    margin: 10,
  },
  addToCartButton: {
    backgroundColor: '#FFA800',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  imageViewer: {
    flex: 1,
    maxHeight: '100%',
    width: '100%',
  },
});

export default SingleSupplement;
