import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const StockInfo = ({count}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>Available in Stock</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textContainer: {
    paddingVertical: 10,
  },
  count: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    color: 'black',
  },
});

export default StockInfo;
