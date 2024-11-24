import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icons from '../../Icons';
import image from '../../assets/getstarted4.png';

const GetStarted = () => {
  const navigation = useNavigation();

  const [height, setHeight] = useState<string>('');
  const [unit, setUnit] = useState<'feet' | 'cm'>('feet');

  const handleToggleUnit = () => {
    setUnit(unit === 'feet' ? 'cm' : 'feet');
  };

  const handleHeightChange = (text: string) => {
    setHeight(text);
  };
  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: 20}}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <Text style={styles.title}>Let's get started</Text>
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              paddingHorizontal: 30,
              marginVertical: 10,
              fontSize: 16,
            }}>
            The standard chunk of Lorem Ipsum used since the 1500s is reproduced
            below for those interested.
          </Text>
          <Image source={image} />
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              paddingHorizontal: 30,
              marginVertical: 10,
              fontSize: 16,
            }}>
            Sculpt your ideal body, free your true self, transform your life.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('Goal');
          }}>
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  subcontainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    // paddingLeft: 20,
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    // paddingLeft: 20,
    color: 'black',
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

  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 20,
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '60%',
    justifyContent: 'center',
  },
  input: {
    width: 50,
    height: 40,
    paddingHorizontal: 10,
    color: 'black',
  },
  unit: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
