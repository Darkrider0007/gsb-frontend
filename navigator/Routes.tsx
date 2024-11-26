import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all your screens
import SignUp from '../pages/signingUp/SignUp';
import Verification from '../pages/signingUp/Verification';
import Age from '../pages/signingUp/Age';
import Weight from '../pages/signingUp/Weight';
import GoalHeight from '../pages/signingUp/GoalHeight';
import GoalWeight from '../pages/signingUp/GoalWeight';
import Splash from '../pages/Splash';
import Home from '../pages/Home';
import Notification from '../pages/Notification';
import Cart from '../pages/Cart';
import Account from '../pages/Account';
import TabNavigator from './TabNavigator';
import Meditation from '../pages/Meditation';
import Education from '../pages/Education';
import Nutrition from '../pages/Nutrition';
import Services from '../pages/Services';
import Consultant from '../pages/Consultant';
import Supplement from '../pages/Supplement';
import Fitness from '../pages/Fitness';
import GetStarted from '../pages/signingUp/GetStarted';
import Goal from '../pages/signingUp/Goal';
import FirstForm from '../pages/signingUp/FirstForm';
import Subscription from '../pages/Subscription';
import PaymentMethod from '../pages/payment/PaymentMethod';
import PaymentOtp from '../pages/payment/PaymentOtp';
import PaymentSuccess from '../pages/payment/PaymentSuccess';
import Name from '../pages/signingUp/Name';
import MyOrders from '../pages/MyOrders';
import MySubscription from '../pages/MySubscription';
import ProfileInfo from '../pages/ProfileInfo';
import SuccessStories from '../pages/SuccessStories';
import MySuccessStories from '../pages/MySuccessStories';
import AddMySuccessStory from '../pages/AddMySuccessStory';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {getData} from '../global/server';
import {completeSignup, verificationSuccess} from '../redux/authSlice';
import Message from '../pages/Message';
import DailyUpdates from '../pages/DailyUpdates';
import AddDailyUpdate from '../pages/AddDailyUpdate';
import SingleSupplement from '../pages/SingleSupplement';
import FirstScreen from '../pages/firstScreen';
import SecondScreen from '../pages/secondScreen';
import SignIn from '../pages/signingUp/SignIn';

const Stack = createNativeStackNavigator();

const PreAuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='FirstScreen' component={FirstScreen} />
    <Stack.Screen name='SecondScreen' component={SecondScreen} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="Verification" component={Verification} />
  </Stack.Navigator>
);

const PostVerificationStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Name" component={Name} />
    <Stack.Screen name="Age" component={Age} />
    <Stack.Screen name="Weight" component={Weight} />
    <Stack.Screen name="GoalHeight" component={GoalHeight} />
    <Stack.Screen name="GoalWeight" component={GoalWeight} />
    <Stack.Screen name="GetStarted" component={GetStarted} />
    <Stack.Screen name="Goal" component={Goal} />
    <Stack.Screen name="FirstForm" component={FirstForm} />
  </Stack.Navigator>
);

const PostAuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="TabNavigator" component={TabNavigator} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Notification" component={Notification} />
    <Stack.Screen name="Message" component={Message} />
    <Stack.Screen name="Cart" component={Cart} />
    <Stack.Screen name="Account" component={Account} />
    <Stack.Screen name="Meditation" component={Meditation} />
    <Stack.Screen name="Education" component={Education} />
    <Stack.Screen name="Diet" component={Nutrition} />
    <Stack.Screen name="Subscription" component={Subscription} />
    <Stack.Screen name="MySubscription" component={MySubscription} />
    <Stack.Screen name="MyOrders" component={MyOrders} />
    <Stack.Screen name="ProfileInfo" component={ProfileInfo} />
    <Stack.Screen name="SuccessStories" component={SuccessStories} />
    <Stack.Screen name="MySuccessStories" component={MySuccessStories} />
    <Stack.Screen name="AddMySuccessStory" component={AddMySuccessStory} />
    <Stack.Screen name="Services" component={Services} />
    <Stack.Screen name="Consultant" component={Consultant} />
    <Stack.Screen name="Supplement" component={Supplement} />
    <Stack.Screen name="SingleSupplement" component={SingleSupplement} />
    <Stack.Screen name="Fitness" component={Fitness} />
    <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
    <Stack.Screen name="PaymentOtp" component={PaymentOtp} />
    <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
    <Stack.Screen name="DailyUpdates" component={DailyUpdates} />
    <Stack.Screen name="AddDailyUpdate" component={AddDailyUpdate} />
  </Stack.Navigator>
);

const Routes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState(null as string | null);
  const [token, setToken] = useState(null as string | null);
  const dispatch = useDispatch();
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const signupStage = useSelector((state: RootState) => state.auth.signupStage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const auth = await AsyncStorage.getItem('isAuth');

        console.log('user id ', userId);
        console.log('token ', token);

        setUserId(userId);
        setToken(token);

        if (auth === 'true') {
          dispatch(completeSignup());
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      } finally {
        // Keep isLoading true to show splash screen initially
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      if (userId !== null && token !== null) {
        try {
          // Fetch user data with the authentication token
          const response = await getData(`/api/user/find/${userId}`, token);
          console.log('response ', response);
          setUser(response);

          if (response?._id !== undefined) {
            dispatch(verificationSuccess(response));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle unauthorized error (401) here if needed
        }
      }
    };
    getUser();
  }, [userId, token]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <NavigationContainer>
        <Splash />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isAuth ? (
        <PostAuthStack />
      ) : signupStage === 'completed' ? (
        <PostVerificationStack />
      ) : (
        <PreAuthStack />
      )}
    </NavigationContainer>
  );
};

export default Routes;
