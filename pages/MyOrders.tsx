import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icons from '../Icons';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {getData} from '../global/server';
import {retrieveData} from '../utils/Storage';

const MyOrders = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('TO RECEIVE');
  const [token, setToken] = useState(null);
  const fetchedUserId = useSelector((state: RootState) => state.auth.user?._id);
  const [userId, setUserId] = useState(fetchedUserId);
  const [myorderData, setMyOrderData] = useState([]);
  const [products, setProducts] = useState([]);

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

  // Fetch user orders
  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const res = await getData(`/api/order/${userId}`, token);
        setMyOrderData(res);
      } catch (error) {
        console.log('err ', error);
        Alert.alert('Error fetching user orders');
      }
    };
    if (token && userId) {
      getUserOrders();
    }
  }, [token, userId]);

  // Fetch product data
  const getProducts = async () => {
    try {
      const response = await getData('/api/supplement', token);
      setProducts(response);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (token) {
      getProducts();
    }
  }, [token]);

  const getProductImage = productId => {
    const product = products?.find(product => product._id === productId);
    return product?.productImg;
  };

  const getProductName = productId => {
    const product = products?.find(product => product._id === productId);
    return product?.name;
  };

  const getProductPrice = productId => {
    const product = products?.find(product => product._id === productId);
    return product?.price;
  };

  const filteredOrders = myorderData?.filter(order => {
    if (selectedTab === 'TO RECEIVE') {
      return order?.status === 'pending';
    } else if (selectedTab === 'COMPLETED') {
      return order?.status === 'delivered';
    } else if (selectedTab === 'CANCELLED') {
      return order?.status === 'cancelled';
    }
  });

  const handleTabPress = tabName => {
    setSelectedTab(tabName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.Entypo name="chevron-left" size={30} color={'#FFA800'} />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
        <View style={{width: 40}}></View>
      </View>

      {/* Option navigators */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.navigateButton,
            selectedTab === 'TO RECEIVE' && {backgroundColor: '#FFA800'},
          ]}
          onPress={() => handleTabPress('TO RECEIVE')}>
          <Text
            style={[
              styles.navigateButtonText,
              selectedTab === 'TO RECEIVE' && {color: 'white'},
            ]}>
            TO RECEIVE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navigateButton,
            selectedTab === 'COMPLETED' && {backgroundColor: '#FFA800'},
          ]}
          onPress={() => handleTabPress('COMPLETED')}>
          <Text
            style={[
              styles.navigateButtonText,
              selectedTab === 'COMPLETED' && {color: 'white'},
            ]}>
            COMPLETED
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navigateButton,
            selectedTab === 'CANCELLED' && {backgroundColor: '#FFA800'},
          ]}
          onPress={() => handleTabPress('CANCELLED')}>
          <Text
            style={[
              styles.navigateButtonText,
              selectedTab === 'CANCELLED' && {color: 'white'},
            ]}>
            CANCELLED
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filteredOrders?.map((order, index) => (
          <View key={index} style={styles.orderContainer}>
            {order?.products?.map((product, productIndex) => (
              <View key={productIndex} style={styles.productContainer}>
                <Image
                  source={{uri: getProductImage(product.productId)}}
                  style={styles.productImage}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>
                    {getProductName(product.productId)}
                  </Text>
                  <View style={styles.quantityPriceContainer}>
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityText}>
                        x {product.quantity}
                      </Text>
                    </View>
                    <Text style={styles.priceText}>
                      RS {getProductPrice(product.productId)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.orderFooter}>
              <View>
                <Text style={styles.footerText}>
                  <Text style={styles.footerQuantity}>
                    {order.products.reduce(
                      (total, product) => total + product.quantity,
                      0,
                    )}{' '}
                    Item
                  </Text>{' '}
                  | <Text style={styles.footerPrice}>RS {order.amount}</Text>
                </Text>
              </View>
              <Icons.Entypo name="chevron-right" color={'#FFA800'} size={25} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyOrders;

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
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    paddingBottom: 10,
  },
  navigateButton: {
    padding: 10,
    borderRadius: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  navigateButtonText: {
    color: 'black',
    fontSize: 12,
  },
  orderContainer: {
    marginVertical: 30,
    flexDirection: 'column',
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productDetails: {
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  productName: {
    fontWeight: '600',
    color: 'black',
  },
  quantityPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    backgroundColor: '#FEF6F5',
    width: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: 5,
  },
  quantityText: {
    color: '#FFA800',
    fontWeight: '600',
  },
  priceText: {
    color: 'black',
    fontWeight: '600',
    marginTop: 5,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: 'lightgray',
    marginTop: 10,
    padding: 10,
  },
  footerText: {
    color: '#FFA800',
  },
  footerQuantity: {
    color: '#FFA800',
    fontSize: 12,
  },
  footerPrice: {
    color: '#FFA800',
    fontSize: 12,
  },
});
