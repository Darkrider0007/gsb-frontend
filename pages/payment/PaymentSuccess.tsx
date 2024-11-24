import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icons from '../../Icons';
import {useNavigation} from '@react-navigation/native';

const PaymentSuccess = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['white', '#FFA800']}
      locations={[0.8, 1]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={styles.container}>
      <View
        style={{marginTop: 180, flexDirection: 'column', alignItems: 'center'}}>
        <Icons.AntDesign name="checkcircle" color={'#FFA800'} size={150} />
        <Text style={{fontSize: 30, fontWeight: '500', color: 'black'}}>
          Success!
        </Text>
        <Text style={{color: 'black'}}>
          Great purchase.Thank you for your purchase
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TabNavigator');
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>DONE</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#F6AF24',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
