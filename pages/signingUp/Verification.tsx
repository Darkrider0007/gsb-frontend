import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icons from '../../Icons';
import {postData} from '../../global/server';
import {
  completeSignup,
  verificationFailure,
  verificationStart,
  verificationSuccess,
} from '../../redux/authSlice';
import {useDispatch} from 'react-redux';
import {retrieveData, storeData} from '../../utils/Storage';

const Verification = () => {
  const et1 = useRef<TextInput>(null);
  const et2 = useRef<TextInput>(null);
  const et3 = useRef<TextInput>(null);
  const et4 = useRef<TextInput>(null);
  const et5 = useRef<TextInput>(null);
  const et6 = useRef<TextInput>(null);

  const [otp, setOtp] = useState({
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
    otp5: '',
    otp6: '',
  });

  const navigation = useNavigation();
  const route = useRoute();
  const {phoneNumber} = route.params as {phoneNumber: string};
  const dispatch = useDispatch();

  const handleVerify = async () => {
    const fullOtp = `${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}${otp.otp5}${otp.otp6}`;
    if (fullOtp.length === 6) {
      try {
        dispatch(verificationStart()); // Dispatch verification start action
        const response = await postData(
          '/api/auth/verify-otp',
          {phone: phoneNumber, otp: fullOtp},
          null,
          null,
        );
        console.log(response);

        if (response.success) {
          // Store the token in AsyncStorage
          await storeData('token', response.token);
          await storeData('userId', response._id);

          dispatch(verificationSuccess(response)); // Dispatch verification success action with user data

          if (response.user.name) {
            navigation.navigate('Age');
          } else {
            navigation.navigate('Name');
          }
        } else {
          dispatch(verificationFailure()); // Dispatch verification failure action
          alert('OTP verification failed. Please try again.');
        }
      } catch (error: any) {
        dispatch(verificationFailure()); // Dispatch verification failure action
        console.error(
          'OTP verification error:',
          error.response ? error.response.data : error.message,
        );
      }
    } else {
      alert('Please enter the complete OTP.');
    }
  };

  const handleChange = (text, currentRef, nextRef, pos) => {
    setOtp(prevOtp => ({...prevOtp, [pos]: text}));
    if (text.length >= 1 && nextRef) {
      nextRef.current?.focus();
    } else if (text.length < 1 && currentRef) {
      currentRef.current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Verify Account</Text>
      <Text style={styles.subtitle}>
        Verify your account by entering the verification code we sent to{' '}
        {phoneNumber}
      </Text>

      <View style={styles.otpView}>
        <TextInput
          ref={et1}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          value={otp.otp1}
          onChangeText={text => handleChange(text, null, et2, 'otp1')}
        />
        <TextInput
          ref={et2}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          value={otp.otp2}
          onChangeText={text => handleChange(text, et1, et3, 'otp2')}
        />
        <TextInput
          ref={et3}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          value={otp.otp3}
          onChangeText={text => handleChange(text, et2, et4, 'otp3')}
        />
        <TextInput
          ref={et4}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          value={otp.otp4}
          onChangeText={text => handleChange(text, et3, et5, 'otp4')}
        />
        <TextInput
          ref={et5}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          value={otp.otp5}
          onChangeText={text => handleChange(text, et4, et6, 'otp5')}
        />
        <TextInput
          ref={et6}
          style={styles.inputView}
          maxLength={1}
          keyboardType="phone-pad"
          value={otp.otp6}
          onChangeText={text => handleChange(text, et5, null, 'otp6')}
        />
      </View>

      <Text style={styles.resend}>Resend</Text>

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
  },
  otpView: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '40%',
    // backgroundColor: 'red',
  },
  inputView: {
    height: 40,
    width: 40,
    borderWidth: 1,
    marginLeft: 5,
    borderRadius: 10,
    textAlign: 'center',
    color: 'black',
  },
  resend: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#F6AF24',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: '20%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
