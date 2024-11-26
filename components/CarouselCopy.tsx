import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import logo from '../assets/gsb.png';

const CarouselCopy = () => {
  const flatlistRef = useRef<FlatList<any>>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const carouselHeight = screenHeight * 0.6;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      flatlistRef.current?.scrollToIndex({
        animated: true,
        index: activeIndex === carouselData.length - 1 ? 0 : activeIndex + 1,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const getItemLayout = (_: any, index: number) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  const carouselData = [
    {
      id: '01',
      image: require('../assets/3Slide1.png'),
      topText: 'REVERSE YOUR',
      bottomText: 'IBS & IBD',
    },
    {
      id: '02',
      image: require('../assets/3Slide2.png'),
      topText: 'NON DRUG',
      bottomText: 'TREATMENT',
    },
    {
      id: '03',
      image: require('../assets/3Slide3.png'),
      topText: 'DOCTOR & DIETICIAN',
      bottomText: 'CONSULTATION',
    },
  ];

  const renderItem = ({item}: {item: any}) => {
    return (
      <View >
        <Image
          source={item.image}
          style={{height: carouselHeight, width: screenWidth}}
        />
        <LinearGradient
          colors={['transparent', 'rgba(255, 170, 0, 1.0)']}
          style={styles.gradientOverlay}
        />
        <View style={styles.textContainer}>
          <Text style={styles.blackText}>{item.topText}</Text>
          <Text style={styles.goldenText}>{item.bottomText}</Text>
        </View>
      </View>
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / screenWidth);
    setActiveIndex(index);
  };

  const renderDotIndicators = () => {
    return carouselData.map((_, index) => (
      <View
        key={index}
        style={{
          backgroundColor: activeIndex === index ? 'white' : 'gray',
          height: 5,
          width: 40,
          // borderRadius: 5,
          marginHorizontal: 6,
        }}
      />
    ));
  };

  return (
    <View>
      <FlatList
        data={carouselData}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
      />
      {/* <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 30,
                }}
            >
                {renderDotIndicators()}
            </View> */}
      <View style={styles.dotIndicatorsContainer}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dotIndicator,
              {backgroundColor: activeIndex === index ? 'white' : 'gray'},
            ]}
          />
        ))}
      </View>

      <View style={styles.logoContainer}>
        <Image source={logo} />
      </View>
    </View>
  );
};

export default CarouselCopy;

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  dotIndicatorsContainer: {
    position: 'absolute',
    bottom: 40, // Adjust this value as per your need
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dotIndicator: {
    width: 50,
    height: 3,
    // borderRadius: 5,
    marginHorizontal: 6,
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 60,
    display: 'flex',
  },
  goldenText: {
    color: 'white',
    fontSize: 32,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '900',
  },
  blackText: {
    color: 'black',
    fontSize: 32,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '900',
  },
  logoContainer: {
    position: 'absolute',
    width: '100%',
    top: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    right: 10,
  },
});
