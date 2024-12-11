import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Header from '../components/Header';
import {Color} from '../assets/constants/Color'; // Make sure this path matches your color constants file

const Horroscope = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <Text style={styles.mainText}>Dare to Discover...</Text>
        <View style={styles.messageBox}>
          <Text style={styles.subText}>
            Something spooky is brewing in the stars. Our Horrorscope feature is
            being summoned and will materialize soon to reveal your darker
            destiny.
          </Text>
        </View>
        <Text style={styles.stayTunedText}>The stars are aligning...</Text>
      </View>
    </View>
  );
};

export default Horroscope;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  mainText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Color.BrightOrange, // Using your vibrant orange for the main heading
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  messageBox: {
    backgroundColor: Color.LightPeach,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  subText: {
    fontSize: 16,
    color: '#000', // Using medium gray for readable text
    textAlign: 'center',
    lineHeight: 24,
  },
  stayTunedText: {
    fontSize: 18,
    fontWeight: '600',
    color: Color.GoldenAmber, // Using golden amber for the call-to-action text
    marginTop: 8,
    letterSpacing: 0.5,
  },
});
