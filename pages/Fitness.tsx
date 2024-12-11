import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import FitnessCard from '../components/Fitness/FitnessCard';
import {fitnessData} from '../components/Fitness/constants';

const Fitness = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {fitnessData.map((item, index) => (
            <FitnessCard key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Fitness;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
});
