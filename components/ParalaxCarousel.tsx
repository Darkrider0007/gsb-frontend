import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, FlatList, Image, Dimensions} from 'react-native';
import Animated, {
  interpolate,
  Extrapolate,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const SRC_WIDTH = Dimensions.get('window').width;
const CARD_LENGTH = SRC_WIDTH * 0.8;
const SPACING = SRC_WIDTH * 0.02;
const SIDECARD_LENGTH = (SRC_WIDTH * 0.18) / 2;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface ItemProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
  image: any; // Change type as needed
}

function Item({index, scrollX, image}: ItemProps) {
  const size = useSharedValue(0.8);
  const opacity = useSharedValue(1);

  const inputRange = [
    (index + 1) * CARD_LENGTH,
    index * CARD_LENGTH,
    (index - 1) * CARD_LENGTH,
  ];

  size.value = interpolate(
    scrollX.value,
    inputRange,
    [0.5, 1, 0.5], // Adjust scaling values as needed
    Extrapolate.CLAMP,
  );

  opacity.value = interpolate(
    scrollX.value,
    inputRange,
    [0.5, 1, 0.5], // Adjust opacity values as needed
    Extrapolate.CLAMP,
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{scaleY: size.value}],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        cardStyle,
        {
          marginLeft: index === 0 ? SIDECARD_LENGTH : SPACING,
          marginRight: index === 2 ? SIDECARD_LENGTH : SPACING,
        },
      ]}>
      <Image source={image} style={{width: '100%', height: '100%'}} />
    </Animated.View>
  );
}

export default function Carousel() {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const DATA = [
    {
      id: '1',
      image: require('../assets/home/slide1.png'),
    },
    {
      id: '2',
      image: require('../assets/home/slide2.png'),
    },
    {
      id: '3',
      image: require('../assets/home/slide3.png'),
    },
    {
      id: '4',
      image: require('../assets/home/slide4.png'),
    },
    {
      id: '5',
      image: require('../assets/home/slide5.png'),
    },
    {
      id: '6',
      image: require('../assets/home/slide6.png'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const newIndex = Math.floor(scrollX.value / CARD_LENGTH) + 1;
        flatListRef.current.scrollToIndex({
          animated: true,
          index: newIndex % DATA.length,
        });
      }
    }, 3000); // Adjust the interval time as needed (e.g., 3000 ms = 3 seconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{paddingVertical: 5}}>
      <AnimatedFlatList
        ref={flatListRef}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        decelerationRate={0.8}
        snapToInterval={CARD_LENGTH + SPACING * 1.5}
        disableIntervalMomentum={true}
        disableScrollViewPanResponder={true}
        snapToAlignment={'center'}
        data={DATA}
        horizontal={true}
        renderItem={({item, index}) => {
          return <Item index={index} scrollX={scrollX} image={item.image} />;
        }}
        keyExtractor={item => item.id}
        onScroll={event => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_LENGTH,
    height: 150,
    overflow: 'hidden',
    borderRadius: 15,
  },
});
