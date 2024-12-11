import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Header from '../components/InnerPeaceHeader/Header';
import MeditationCard from '../components/Meditation/MeditationCard';
import {MeditationData} from '../components/Meditation/constants';

const Meditation = () => {
  return (
    <View style={styles.container}>
      <Header title="Meditation" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {MeditationData.map((item, index) => (
            <MeditationCard key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Meditation;

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
