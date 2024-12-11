import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import gsbLogo from '../../assets/gsbtransparent.png';
import Icons from '../../Icons';

const Header = ({title, showLogo = true}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      {showLogo && (
        <Image source={gsbLogo} style={styles.logo} resizeMode="contain" />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white', // Optional: Adjust background color
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
});
