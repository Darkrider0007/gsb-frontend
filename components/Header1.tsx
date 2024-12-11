import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from '../Icons';
import gsbLogo from '../assets/gsbtransparent.png';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
      </TouchableOpacity>
      <Image source={gsbLogo} />
      <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
        <View>
          <Icons.Feather name="shopping-bag" size={25} color={'black'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
  },
});

export default Header;
