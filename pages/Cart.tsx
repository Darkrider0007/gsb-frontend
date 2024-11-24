import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icons from '../Icons';
import gsbLogo from '../assets/gsbtransparent.png';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  setCartItems,
  clearCart,
} from '../redux/cartSlice';
import {retrieveData, storeData} from '../utils/Storage';
import axios from 'axios';
import {BASE_URL, postData} from '../global/server';

const Cart = ({navigation}: {navigation: any}) => {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // New state for payment method
  const dispatch = useDispatch();
  const CartData = useSelector((state: RootState) => state.cart.items);
  const [token, setToken] = useState(null);
  const fetchedUserId = useSelector((state: RootState) => state.auth.user?._id);
  const [userId, setUserId] = useState(fetchedUserId);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token'); // Retrieve token from AsyncStorage
      setToken(storedToken);
    };

    const getUserId = async () => {
      const storedUserId = await retrieveData('userId'); // Retrieve userId from AsyncStorage
      setUserId(storedUserId);
    };
    getToken();
    getUserId();
  }, []);
  console.log(token);
  console.log(userId);

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
      await storeData('cartItems', JSON.stringify(CartData));
    };
    storeCartItems();
  }, [CartData]);

  const handleIncrementQuantity = (id: string) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrementQuantity = (id: string) => {
    dispatch(decrementQuantity(id));
  };

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const getCartItemQuantity = id => {
    const item = CartData.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const handlePlaceOrder = async () => {
    // Check if the cart is empty
    if (CartData.length === 0) {
      Alert.alert('No products in the cart');
      navigation.navigate('Supplement');
      return;
    }

    const order = {
      userId: userId,
      products: CartData.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      amount: CartData.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      receiverName,
      receiverPhoneNumber: phoneNumber,
      address: {details: deliveryAddress},
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    };

    try {
      const res = await postData(`/api/order`, order, token, null);
      console.log(res);
      if (res._id) {
        Alert.alert('Order placed successfully!');
        dispatch(clearCart());
        await storeData('cartItems', JSON.stringify([]));
        navigation.goBack();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to place order');
    }
  };

  return (
    <LinearGradient
      colors={['white', '#FFA800']}
      locations={[0.95, 1]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cart</Text>
        <Image source={gsbLogo} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 20, marginBottom: 20}}>
        {CartData.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: item?.productImgs[0]?.secure_url}}
                style={styles.itemImage}
              />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemPrice}>INR {item.price}.00</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleIncrementQuantity(item.id)}>
                  <Icons.AntDesign
                    name="upcircleo"
                    color={'#FFA800'}
                    size={18}
                  />
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {getCartItemQuantity(item.id)}
                </Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleDecrementQuantity(item.id)}>
                  <Icons.AntDesign
                    name="downcircleo"
                    color={'#FFA800'}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)}>
                  <Icons.MaterialCommunityIcons
                    name="delete-outline"
                    size={25}
                    color={'red'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Delivery Address</Text>
            <Icons.AntDesign name="right" size={16} color={'black'} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Delivery Address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholderTextColor={'black'}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Receiver Information</Text>
            <Icons.AntDesign name="right" size={16} color={'black'} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Receiver's Name"
            value={receiverName}
            onChangeText={setReceiverName}
            placeholderTextColor={'black'}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor={'black'}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Payment Method</Text>
            <Icons.AntDesign name="right" size={16} color={'black'} />
          </View>
          <View style={styles.paymentMethodContainer}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'cod' && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod('cod')}>
              <Text style={styles.paymentOptionText}>
                Cash on Delivery (COD)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'online' && styles.selectedPaymentOption,
              ]}
              disabled={true} // Disable online payment option
              onPress={() => setPaymentMethod('online')}>
              <Text style={styles.paymentOptionTextDisabled}>
                Online Payment (Unavailable)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (paymentMethod === 'cod') {
            handlePlaceOrder();
          } else {
            navigation.navigate('PaymentMethod');
          }
        }}>
        <Text style={styles.buttonText}>
          {paymentMethod === 'cod' ? 'PLACE ORDER' : 'CHECK OUT'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '800',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFA800',
    padding: 10,
    elevation: 15,
    shadowColor: '#FFA800',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginBottom: 20,
  },
  imageContainer: {
    height: 120,
    width: '30%',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFA800',
    paddingHorizontal: 10,
  },
  itemImage: {
    height: '100%',
    width: '100%',
    borderRadius: 18,
  },
  itemDetails: {
    padding: 10,
    width: '70%',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  itemPrice: {
    color: 'black',
    fontWeight: '600',
  },
  quantityContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    gap: 5,
  },
  quantityButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: '#FFA800',
    fontSize: 16,
  },
  infoContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFA800',
    padding: 12,
    marginBottom: 20,
    minHeight: 120, // Set a minimum height to prevent overflow
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#F6AF24',
    borderRadius: 5,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 10,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  paymentOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFA800',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedPaymentOption: {
    backgroundColor: '#FFA800',
  },
  paymentOptionText: {
    color: 'black',
  },
  paymentOptionTextDisabled: {
    color: 'gray',
  },
});
