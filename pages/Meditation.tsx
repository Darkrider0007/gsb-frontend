import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Header from '../components/InnerPeaceHeader/Header';
import MeditationCard from '../components/Meditation/MeditationCard';
// import { MeditationData } from '../components/Meditation/constants';
import { getData } from '../global/server';

const Meditation = () => {
  const [MedicationData, setMedicationData] = useState([]);

  useEffect(() => {
    const fetchMeditationData = async () => {
      const res = await getData('/api/video', null);
      setMedicationData(res);
    }
    fetchMeditationData();
  }, []);
  return (
    <View style={styles.container}>
      <Header title="Meditation" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {MedicationData.map((item, index) => (
            item?.category == "meditation" && <MeditationCard key={index} item={item} />
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
