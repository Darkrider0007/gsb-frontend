import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Icons from '../Icons';
import ImageViewer from 'react-native-image-zoom-viewer';

const {width} = Dimensions.get('window');

const ImageCarousel = ({images}) => {
  const scrollX = useSharedValue(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef(null);

  const handleImageClick = image => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const handleScroll = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const newIndex = Math.floor(scrollX.value / width) + 1;
        if (newIndex >= images.length) {
          flatListRef.current.scrollToIndex({
            animated: true,
            index: 0,
          });
        } else {
          flatListRef.current.scrollToIndex({
            animated: true,
            index: newIndex,
          });
        }
      }
    }, 3000); // Adjust the interval time as needed (e.g., 3000 ms = 3 seconds)

    return () => clearInterval(interval);
  }, [images]);

  console.log(images);

  return (
    <View style={{marginVertical: 14}}>
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.secure_url}-${index}`}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleImageClick(item)}>
            <View style={{width, height: 200}}>
              <Image source={{uri: item.secure_url}} style={styles.image} />
            </View>
          </TouchableOpacity>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}>
            <Icons.AntDesign name="closecircle" size={30} color="white" />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={[{url: selectedImage?.secure_url}]}
            renderIndicator={() => null}
            style={styles.imageViewer}
            backgroundColor="rgba(0,0,0,0.2)"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  imageViewer: {
    flex: 1,
    maxHeight: '100%',
    width: '100%',
  },
});

export default ImageCarousel;
