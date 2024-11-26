import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { responsiveHeight, responsiveFontSize, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import axios from 'axios';


const FirstScreen = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [phoneNumber, setPhoneNumber] = useState('');

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const navigation = useNavigation();

    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
          navigation.navigate('SecondScreen');
        }, 3000); // Adjust timeout to match video duration
    
        // Clean up the timeout when the component unmounts or when the effect runs again
        return () => clearTimeout(timeoutId);
      }, []);



    return (
        <SafeAreaView>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}

                translucent backgroundColor="transparent"
            />

            <View style={styles.container}>
                <View style={{ zIndex: 1, position: 'absolute' }}>
                    <Image source={require('../assets/Shape1.png')} style={{ width: responsiveWidth(100), height: responsiveHeight(43) }} />
                </View>
                <View style={{ zIndex: 2, alignSelf: 'flex-end' }}>
                    <Image source={require('../assets/Subshape1.png')} style={{ width: responsiveWidth(56), height: responsiveHeight(24) }} />
                </View>

            </View>
            <View style={{ width: responsiveWidth(70), marginLeft: "5%", position: 'absolute', marginTop: "35%", borderBottomWidth: 1, borderColor: "#FFFFFF", justifyContent: 'center' }}>
                <Text style={{ color: "#FFFFFF", fontFamily: 'Raleway-SemiBold', fontSize: responsiveFontSize(3), }}>Welcome to GSBpathy</Text>
            </View>
            <Text style={{ fontFamily: 'Raleway-SemiBoldItalic', fontSize: responsiveFontSize(2), width: responsiveWidth(55), color: "black", marginTop: "10%", marginLeft: '5%' }}>Non-Medicine Treatment Of Lifestyle Disorders</Text>


            <View style={{flexDirection: 'row', width: responsiveWidth(70), marginTop: '20%',  alignSelf: 'center',  justifyContent: 'space-around'}}>
                <Image source={require('../assets/man.png')} style={{width: responsiveWidth(40), height: responsiveHeight(35)}}/>
                <Image source={require('../assets/welcome.png')}  style={{width: responsiveWidth(50), height: responsiveHeight(35)}}/>
            </View>
            <Text style={{fontFamily: 'Raleway-BoldItalic', fontSize: responsiveFontSize(3), color: '#242424', textAlign: 'center', marginTop: '12%'}}>Funded by the Ministry of Commerce</Text>
        </SafeAreaView>
    );
};
export default FirstScreen;

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    container: {


        alignItems: 'center',
        backgroundColor: "#ffffff",
    },
})