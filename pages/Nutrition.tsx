import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Header from '../components/InnerPeaceHeader/Header';
import {NutritionData} from '../components/Diet/constants';
import NutritionCard from '../components/Diet/NutritionCard';

const Education = () => {
  return (
    <View style={styles.container}>
      <Header title="Nutrition" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {NutritionData.map((item, index) => (
            <NutritionCard key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Education;

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
