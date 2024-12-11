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
import {Color} from '../assets/constants/Color';

const HomeCarousel = () => {
  const flatlistRef = useRef<FlatList<any>>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const carouselHeight = screenHeight * 0.2;
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
      image: require('../assets/home/home1.png'),
    },
    {
      id: '02',
      image: require('../assets/home/home2.png'),
    },
    {
      id: '03',
      image: require('../assets/home/home3.png'),
    },
    {
      id: '04',
      image: require('../assets/home/home4.png'),
    },
    {
      id: '05',
      image: require('../assets/home/home5.png'),
    },
    {
      id: '06',
      image: require('../assets/home/home6.png'),
    },
  ];

  const renderItem = ({item}: {item: any}) => {
    return (
      <View>
        <Image
          source={item.image}
          style={{
            height: carouselHeight,
            width: screenWidth - 40,
            marginHorizontal: 20,
          }}
        />
        {/* <LinearGradient
          colors={['transparent', 'rgba(255, 170, 0, 1.0)']}
          style={styles.gradientOverlay}
        /> */}
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
    return (
      <View style={styles.dotIndicatorsContainer}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dotIndicator,
              {
                backgroundColor:
                  activeIndex === index ? Color.BrightOrange : Color.LightGray,
              },
            ]}
          />
        ))}
      </View>
    );
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

      {renderDotIndicators()}

      {/* <View style={styles.logoContainer}>
        <Image source={logo} />
      </View> */}
    </View>
  );
};

export default HomeCarousel;

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
    marginTop: 10, // Positioned below the image
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dotIndicator: {
    width: 10, // Circular size
    height: 10, // Circular size
    borderRadius: 5, // Makes it circular
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
