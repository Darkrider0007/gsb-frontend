import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import StockInfo from '../components/Supplements/StockInfo';
import SupplementCard from '../components/Supplements/SupplementCard';
import {SupplementData} from '../components/Supplements/constants';
import Header1 from '../components/Header1';

const Supplements = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header1 />
      <StockInfo count={SupplementData.length} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {SupplementData.map((item, index) => (
            <SupplementCard key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Supplements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 20,
  },
});
