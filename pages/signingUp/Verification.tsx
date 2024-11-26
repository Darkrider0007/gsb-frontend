import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icons from '../../Icons';
import {postData} from '../../global/server';
import {
  verificationFailure,
  verificationStart,
  verificationSuccess,
} from '../../redux/authSlice';
import {useDispatch} from 'react-redux';
import {storeData} from '../../utils/Storage';

const Verification = () => {
  const inputRefs = Array(6)
    .fill(null)
    .map(() => useRef<TextInput>(null));
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendEnabled, setResendEnabled] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const {phoneNumber} = route.params as {phoneNumber: string};
  const dispatch = useDispatch();

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length === 6) {
      try {
        dispatch(verificationStart());

        const response = await postData(
          '/api/auth/verify-otp',
          {phone: phoneNumber, otp: fullOtp},
          null,
          null,
        );

        if (response.success) {
          // Store token and user ID
          await storeData('token', response.token);
          await storeData('userId', response._id);

          dispatch(verificationSuccess(response));

          // Navigate based on backend response
          if (response.firstTimeLogin) {
            navigation.navigate('Name');
          } else {
            navigation.navigate('Home');
          }
        } else {
          dispatch(verificationFailure());
          alert(response.message || 'OTP verification failed. Please try again.');
        }
      } catch (error: any) {
        dispatch(verificationFailure());
        console.error(
          'OTP verification error:',
          error.response ? error.response.data : error.message,
        );
        alert('An error occurred during OTP verification. Please try again.');
      }
    } else {
      alert('Please enter the complete OTP.');
    }
  };

  const handleChange = (text: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    // Focus next input or stay on the current one if backspacing
    if (text && index < 5) {
      inputRefs[index + 1].current?.focus();
    } else if (!text && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResend = async () => {
    setResendEnabled(false);
    try {
      const response = await postData('/api/auth/phone-login', {phone: phoneNumber});
      if (response.success) {
        alert('OTP resent successfully.');
      } else {
        alert(response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error.response ? error.response.data : error.message);
      alert('An error occurred while resending OTP. Please try again.');
    } finally {
      // Enable resend button after 30 seconds
      setTimeout(() => setResendEnabled(true), 30000);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icons.AntDesign name="arrowleft" size={25} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Verify Account</Text>
      <Text style={styles.subtitle}>
        Verify your account by entering the verification code we sent to{' '}
        {phoneNumber}
      </Text>

      <View style={styles.otpView}>
        {inputRefs.map((ref, index) => (
          <TextInput
            key={index}
            ref={ref}
            style={styles.inputView}
            maxLength={1}
            keyboardType="phone-pad"
            value={otp[index]}
            onChangeText={text => handleChange(text, index)}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={handleResend}
        disabled={!resendEnabled}
      >
        <Text style={[styles.resend, !resendEnabled && styles.resendDisabled]}>
          Resend
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 50,
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginVertical: 20,
  },
  otpView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  inputView: {
    height: 40,
    width: 40,
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
  resend: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 10,
  },
  resendDisabled: {
    color: 'gray',
  },
  button: {
    backgroundColor: '#F6AF24',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
