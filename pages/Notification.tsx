import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icons from '../Icons';
import gsbLogo from '../assets/gsbtransparent.png';

const Notification = () => {
  const navigation = useNavigation();

  const orderNotification = [
    {
      id: 1,
      message: 'Your order has been placed',
      timestamp: '2024-05-06T12:30:00Z',
    },
    {
      id: 2,
      message: 'Your order has been shipped',
      timestamp: '2024-05-06T12:30:00Z',
    },
    {
      id: 3,
      message: 'Your order has been delivered',
      timestamp: '2024-05-03T12:30:00Z',
    },
  ];

  const getTimeDifference = timestamp => {
    const givenTime = new Date(timestamp);
    const timeDifference = Date.now() - givenTime;
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return givenTime.toString();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
        <Image source={gsbLogo} />
      </View>

      {orderNotification.map((order, index) => (
        <View style={styles.notificationItem} key={index}>
          <View style={styles.avatarContainer}>
            <Icons.MaterialCommunityIcons
              name="account"
              color={'black'}
              size={40}
            />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>{order.message}</Text>
            <Text style={styles.timestamp}>
              {getTimeDifference(order.timestamp)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Notification;

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
    fontWeight: '400',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderColor: '#FFA800',
    borderWidth: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'gray',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    marginLeft: 15,
    flex: 1,
  },
  notificationText: {
    color: 'gray',
  },
  timestamp: {
    color: 'gray',
  },
});
