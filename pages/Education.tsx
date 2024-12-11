import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Header from '../components/InnerPeaceHeader/Header';
import {EducationData} from '../components/Education/constants';
import EducationCard from '../components/Education/EducationCard';

const Education = () => {
  return (
    <View style={styles.container}>
      <Header title="Education" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {EducationData.map((item, index) => (
            <EducationCard key={index} item={item} />
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
