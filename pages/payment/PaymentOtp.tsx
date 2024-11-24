import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useRef} from 'react';
import Icons from '../../Icons';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const PaymentOtp = () => {
  const et1 = useRef<TextInput>(null);
  const et2 = useRef<TextInput>(null);
  const et3 = useRef<TextInput>(null);
  const et4 = useRef<TextInput>(null);
  const et5 = useRef<TextInput>(null);
  const et6 = useRef<TextInput>(null);
  const navigation = useNavigation();

  const phoneNumber = '91';

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
      </View>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          marginTop: '45%',
        }}>
        <Text style={styles.headerText}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          We send code to your registed mobile number
        </Text>
        <View style={{flexDirection: 'row', gap: 20}}>
          <Text style={styles.subtitle}>+91*******239</Text>
          <TouchableOpacity>
            <Text style={{color: 'gray', textDecorationLine: 'underline'}}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.otpView}>
        <TextInput
          ref={et1}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          onChangeText={txt => {
            if (txt.length >= 1) {
              et2.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et2}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          onChangeText={txt => {
            if (txt.length >= 1) {
              et3.current?.focus();
            } else if (txt.length < 1) {
              et1.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et3}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          onChangeText={txt => {
            if (txt.length >= 1) {
              et4.current?.focus();
            } else if (txt.length < 1) {
              et2.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et4}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          onChangeText={txt => {
            if (txt.length >= 1) {
              et5.current?.focus();
            } else if (txt.length < 1) {
              et3.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et5}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          onChangeText={txt => {
            if (txt.length >= 1) {
              et6.current?.focus();
            } else if (txt.length < 1) {
              et4.current?.focus();
            }
          }}
        />
        <TextInput
          ref={et6}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          onChangeText={txt => {
            if (txt.length < 1) {
              et5.current?.focus();
            }
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('PaymentSuccess');
        }}>
        <Text style={styles.buttonText}>VERIFY</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default PaymentOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 20,
  },
  otpView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 5,
  },
  inputView: {
    height: 40,
    width: 40,
    borderBottomWidth: 1,
    borderColor: 'black',
    textAlign: 'center',
    color: 'black',
  },
  button: {
    backgroundColor: '#F6AF24',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
