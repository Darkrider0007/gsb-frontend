import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Notification from '../pages/Notification';
import Cart from '../pages/Cart';
import Account from '../pages/Account';
import Icons from '../Icons';
import {retrieveData} from '../utils/Storage';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const CartData = useSelector((state: RootState) => state.cart.items);

  console.log(CartData);

  useEffect(() => {
    const fetchCartItems = async () => {
      const storedCartItems = await retrieveData('cartItems');
      if (storedCartItems) {
        const cartItems = JSON.parse(storedCartItems);
        setCartItemCount(cartItems.length);
      }
    };
    fetchCartItems();
  }, [CartData]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFA800',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: {
          backgroundColor: 'transparent',
        },
      }}>
      <Tab.Screen
        name="HOME"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icons.Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NOTIFICATION"
        component={Notification}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icons.Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CART"
        component={Cart}
        options={{
          tabBarIcon: ({color, size}) => (
            <View>
              <Icons.MaterialCommunityIcons
                name="cart"
                size={size}
                color={color}
              />
              {cartItemCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ACCOUNT"
        component={Account}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icons.MaterialCommunityIcons
              name="account"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
