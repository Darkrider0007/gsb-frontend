import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import Icons from '../../Icons';
import gsbLogo from '../../assets/gsbtransparent.png';
import LinearGradient from 'react-native-linear-gradient';
import qr from '../../assets/qr.png';
import card from '../../assets/card.png';

const PaymentMethod = ({navigation}) => {
  const [cardOwnerName, setCardOwnerName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCVV] = useState('');

  const handleCardNumberChange = value => {
    // Remove non-digit characters
    const cleanedValue = value.replace(/\D/g, '');
    // Limit to 16 characters
    const formattedValue = cleanedValue.slice(0, 16);
    setCardNumber(formattedValue);
  };

  const handleExpDateChange = value => {
    // Remove non-digit characters
    const cleanedValue = value.replace(/\D/g, '');
    // Insert '/' after the 2nd character
    const formattedValue = cleanedValue.slice(0, 4).replace(/(\d{2})/, '$1/');
    setExpDate(formattedValue);
  };

  const handleCVVChange = value => {
    // Remove non-digit characters
    const cleanedValue = value.replace(/\D/g, '');
    // Limit to 3 characters
    const formattedValue = cleanedValue.slice(0, 3);
    setCVV(formattedValue);
  };

  return (
    <LinearGradient
      colors={['white', '#FFA800']}
      locations={[0.8, 1]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payment Method</Text>
        <Image source={gsbLogo} />
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton}>
          <Image source={card} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.qrOptionButton}>
          <Image source={qr} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.codOptionButton}>
          <Text style={styles.optionText}>Cash on Delivery</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formItem}>
          <Text style={styles.label}>Card Owner Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={cardOwnerName}
            onChangeText={setCardOwnerName}
            placeholderTextColor={'gray'}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9101 1121"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholderTextColor={'gray'}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.formRow}>
          <View style={[styles.formItem, {flex: 1, marginRight: 10}]}>
            <Text style={styles.label}>Exp Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expDate}
              onChangeText={handleExpDateChange}
              keyboardType="numeric"
              placeholderTextColor={'gray'}
            />
          </View>
          <View style={[styles.formItem, {flex: 1, marginLeft: 10}]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              value={cvv}
              onChangeText={handleCVVChange}
              keyboardType="numeric"
              placeholderTextColor={'gray'}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('PaymentOtp');
          }}>
          <Text style={styles.buttonText}>PAY NOW</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default PaymentMethod;

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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  optionButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFA800',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrOptionButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFA800', // Background color for QR option
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codOptionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFA800', // Background color for Cash on Delivery option
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  formItem: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    color: 'black',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    color: 'black',
  },
  button: {
    backgroundColor: '#F6AF24',
    borderRadius: 5,
    paddingVertical: 12,
    // marginHorizontal: ,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
