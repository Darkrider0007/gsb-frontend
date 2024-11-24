import React, {useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';

const ScrollNumberInput = ({
  setAge,
}: {
  setAge: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const flatListRef = useRef(null);
  const data = Array.from({length: 100}, (_, index) => index + 1);

  const [selectedIndex, setSelectedIndex] = useState(18);

  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const _selectedIndex = Math.floor(contentOffsetY / 40); // Assuming each item has a height of 40
    setSelectedIndex(_selectedIndex);
    setAge(selectedIndex.toString());
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{height: 200}}>
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={({item}) => (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  opacity:
                    item === selectedIndex
                      ? 1
                      : Math.abs(selectedIndex - item) === 1
                      ? 0.6
                      : 0.5,
                  fontSize:
                    item === selectedIndex
                      ? 24
                      : Math.abs(selectedIndex - item) === 1
                      ? 20
                      : 16,
                  fontWeight: item === selectedIndex ? 'bold' : 'normal',
                  color: 'black',
                }}>
                {item}
              </Text>
            </View>
          )}
          keyExtractor={item => item.toString()}
          getItemLayout={(data, index) => ({
            length: 40,
            offset: 40 * index,
            index,
          })}
          onScroll={handleScroll}
          initialScrollIndex={18} // Start with item 1 in the middle
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default ScrollNumberInput;

const styles = StyleSheet.create({});
