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
    ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { responsiveHeight, responsiveFontSize, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import axios from 'axios';


const SecondScreen = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [phoneNumber, setPhoneNumber] = useState('');

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const navigation = useNavigation();

    const dispatch = useDispatch();
    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //       navigation.navigate('SignUp');
    //     }, 4000); // Adjust timeout to match video duration

    //     // Clean up the timeout when the component unmounts or when the effect runs again
    //     return () => clearTimeout(timeoutId);
    //   }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const loadingTime = 1000; // 1 second in milliseconds

    const handleSignIn = () => {
        setIsLoading(true);

        // Start loading animation
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
            navigation.navigate('SignIn');
        }, loadingTime);

        // Cleanup if component unmounts during loading
        return () => clearTimeout(loadingTimer);
    };

    const handleSignUP = () => {
        setLoading(true);

        // Start loading animation
        const loadingTimer = setTimeout(() => {
            setLoading(false);
            navigation.navigate('SignUp');
        }, loadingTime);

        // Cleanup if component unmounts during loading
        return () => clearTimeout(loadingTimer);
    };

    return (
        <SafeAreaView>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}

                translucent backgroundColor="transparent"
            />
            <View style={{ position: 'absolute' }}>
                <View style={styles.container}>
                    <Image source={require('../assets/2nd.png')} style={{ width: responsiveWidth(100), height: responsiveHeight(75) }} />
                </View>
                <View style={{ zIndex: 2, marginTop: "15%", marginLeft: "5%" }}>
                    <Image source={require('../assets/image2.png')} style={{ width: "15%", height: responsiveHeight(5) }} />
                </View>
                <View style={{ zIndex: 2, marginTop: "75%" }}>
                    <Image source={require('../assets/Rectangle31.png')} style={{ width: responsiveWidth(100), height: responsiveHeight(25) }} />
                </View>
            </View>
            <View style={styles.rectangle}>
                <Text style={{ width: responsiveWidth(80), fontFamily: 'Raleway-BoldItalic', fontSize: responsiveFontSize(3), color: "#000000", alignSelf: 'center', marginTop: "5%" }}>All Fitness and Nutrition
                    Content is Accredited by SPAA INDIA</Text>
                <View style={{ width: responsiveWidth(60), flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', height: responsiveHeight(6), marginTop: "10%" }}>
                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={isLoading}
                        style={{
                            backgroundColor: '#000000',
                            width: "45%",
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 20,
                            padding: 10,
                            minHeight: 40
                        }}
                    >
                        {isLoading ? (
                            <ActivityIndicator
                                color="#FFFFFF"
                                size="small"
                            />
                        ) : (
                            <Text style={{ color: '#FFFFFF' }}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSignUP}
                        disabled={loading}
                        style={{ borderColor: '#000000', width: "45%", alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 20 }}>
                        {loading ? (
                            <ActivityIndicator
                                color="#000000"
                                size="small"
                            />
                        ) : (
                            <Text style={{ color: "#000000" }}>Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
export default SecondScreen;

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    container: {

        position: 'absolute',
        width: responsiveWidth(100),
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: "#ffffff",
    },
    rectangle: {
        zIndex: 3,
        backgroundColor: "#FFFFFF",
        height: responsiveHeight(35),
        marginTop: "140%"


    }
})