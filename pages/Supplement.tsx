import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icons from '../Icons';
import gsbLogo from '../assets/gsbtransparent.png';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {getData} from '../global/server';
import {retrieveData, storeData} from '../utils/Storage';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  setCartItems,
} from '../redux/cartSlice';

import {
  PinchGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import ImageViewer from 'react-native-image-zoom-viewer';

const Supplement = () => {
  const navigation = useNavigation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [SupplementData, setSupplementData] = useState([]);
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
    };
    getToken();
  }, []);

  const fetchSupplementData = async () => {
    if (token) {
      const data = await getData('/api/supplement', token);
      setSupplementData(data);
      console.log('fetched supplement data');
    }
  };

  useEffect(() => {
    fetchSupplementData();
    console.log(token);
    console.log('SupplementData');
    console.log(SupplementData);
  }, [token]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const storedCartItems = await retrieveData('cartItems');
      if (storedCartItems) {
        dispatch(setCartItems(JSON.parse(storedCartItems)));
      }
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    const storeCartItems = async () => {
      await storeData('cartItems', JSON.stringify(cartItems));
    };
    storeCartItems();
  }, [cartItems]);

  const handleAddToCart = item => {
    dispatch(addToCart({...item, id: item._id, quantity: 1}));
  };

  const handleIncrementQuantity = id => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrementQuantity = id => {
    dispatch(decrementQuantity(id));
  };

  const getCartItemQuantity = id => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const handleImageTap = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // console.log(cartItems);

  const handleCardPress = productId => {
    navigation.navigate('SingleSupplement', {productId});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Image source={gsbLogo} />
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <View>
            <Icons.Feather name="shopping-bag" size={25} color={'black'} />
            {totalCartItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCartItems}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.headerContent}>
        <View style={{paddingVertical: 10}}>
          <Text style={styles.headerText}>{SupplementData?.length} Items</Text>
          <Text style={{color: 'black'}}>Available in Stock</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 20}}>
        <View style={styles.cardContainer}>
          {SupplementData?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => handleCardPress(item._id)}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: item?.productImgs[0]?.secure_url}}
                    style={styles.cardImage}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item?.name}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardPrice}>INR {item.price}.00</Text>
                    {getCartItemQuantity(item._id) > 0 ? (
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          onPress={() => handleDecrementQuantity(item._id)}>
                          <Icons.MaterialCommunityIcons
                            name="minus"
                            size={20}
                            color={'black'}
                          />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>
                          {getCartItemQuantity(item._id)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleIncrementQuantity(item._id)}>
                          <Icons.MaterialCommunityIcons
                            name="plus"
                            size={20}
                            color={'black'}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => handleAddToCart(item)}>
                        <Icons.MaterialCommunityIcons
                          name="cart"
                          size={20}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}>
            <Icons.AntDesign name="closecircle" size={30} color="white" />
            {/* <Text style={styles.closeButtonText}>Close</Text> */}
          </TouchableOpacity>
          {/* <PinchGestureHandler onGestureEvent={pinchHandler}> */}
          {/* <Animated.View style={styles.modalScrollView}>
            <Animated.Image
              source={{uri: selectedImage}}
              style={[styles.modalImage, animatedStyle]}
            />
          </Animated.View> */}
          <ImageViewer
            imageUrls={[{url: selectedImage}]}
            renderIndicator={() => null}
            style={styles.imageViewer}
            backgroundColor="rgba(0,0,0,0.2)"
          />

          <View
            style={{
              height: 50,
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.2)',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {/* <Text style={{fontSize: 20}}>Pinch to Zoom</Text> */}
          </View>

          {/* </PinchGestureHandler> */}
        </View>
      </Modal>
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
  badge: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#FFA800',
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
  },
  imageContainer: {
    height: 150,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 16,
    color: 'black',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalScrollView: {
    width: '90%',
    height: '90%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  imageViewer: {
    flex: 1,
    maxHeight: '100%',
    width: '100%',
  },
});

export default Supplement;
