import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import subscription from '../assets/subscription.png';

const MySubscription = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '80%',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          marginTop: 50,
          //   backgroundColor: 'red',
        }}>
        <Text style={{color: 'black', fontSize: 28, fontWeight: '800'}}>
          My Subscription
        </Text>
        <Text style={{color: 'black', textAlign: 'center'}}>
          Unlock all the power of this mobile tool and enjoy digital experience
          like never before!
        </Text>
        <Image source={subscription} />
      </View>

      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderWidth: 2,
            borderColor: 'black',
            width: '90%',
            padding: 15,
            marginTop: 20,
            borderRadius: 12,
          }}>
          <Text style={{color: 'black', fontSize: 18, fontWeight: '600'}}>
            Annual
          </Text>
          <Text style={{color: 'black'}}>
            First 30 days free - Then $100/Year
          </Text>
        </View>
        <View
          style={{
            // borderWidth: 2,
            // borderColor: 'black',
            backgroundColor: '#f3f4f8',
            width: '90%',
            padding: 15,
            marginTop: 20,
            borderRadius: 12,
          }}>
          <Text style={{color: 'black', fontSize: 18, fontWeight: '600'}}>
            Annual
          </Text>
          <Text style={{color: 'black'}}>
            First 30 days free - Then $100/Year
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#F6AF24',
          width: '90%',
          padding: 16,
          borderRadius: 12,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white', fontSize: 16}}>upgrade plan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MySubscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
});
