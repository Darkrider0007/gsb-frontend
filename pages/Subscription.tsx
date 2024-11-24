import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icons from '../Icons';
import gsbLogo from '../assets/gsbtransparent.png';
import {useNavigation} from '@react-navigation/native';
import nutrition from '../assets/nutrition.png';

const SubscriptionData = [
  {
    title: 'Basic Plan',
    price: 10,
    features: [
      'Access to all basic features',
      'Basic reporting and analytics',
      'Basic chat and email support',
    ],
  },
  {
    title: 'Business Plan',
    price: 100,
    features: [
      'Access to all basic features',
      'Advanced reporting and analytics',
      'Priority chat and email support',
    ],
  },
  {
    title: 'Enterprise Plan',
    price: 40,
    features: [
      'Advanced custom fields',
      'Audit log and data history',
      'Unlimited individual users',
      'Unlimited individual data',
      'Personalised+priotity service',
    ],
  },
];

const Subscription = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: 'black', fontWeight: '800'}}>
          Subscription
        </Text>
        <Image source={gsbLogo} />
      </View>

      <View style={{marginHorizontal: 20, marginBottom: 10}}>
        <Text style={{color: '#FFA800', fontSize: 16}}>Pricing</Text>
        <Text style={{color: 'black', fontSize: 32, fontWeight: '600'}}>
          Simple, transparent pricing
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 50, marginBottom: 20}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'space-between',
            // paddingLeft: 10,
            marginTop: 20,
            // backgroundColor: 'red',
            marginBottom: 20,
          }}>
          {SubscriptionData.map((item, index) => (
            <View
              key={index}
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#FFA800',
                paddingVertical: 30,
                marginBottom: 20,
                padding: 10,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 20,
                }}>
                <Text style={{fontSize: 40, fontWeight: '600', color: 'black'}}>
                  ${item.price}
                </Text>
                <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}>
                  {item.title}
                </Text>
                <Text style={{color: 'gray'}}>Billed annually</Text>
              </View>
              <View style={{marginVertical: 20}}>
                {item.features.map((feature, index) => (
                  <View
                    style={{flexDirection: 'row', gap: 10, marginBottom: 10}}
                    key={index}>
                    <Icons.AntDesign
                      name="checkcircle"
                      size={18}
                      color={'#ffb13e'}
                    />

                    <Text style={{color: 'gray'}}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PaymentMethod');
                }}
                style={{
                  marginTop: 10,
                  backgroundColor: '#FFA800',
                  width: '100%',
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
