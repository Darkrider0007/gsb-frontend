import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from '../Icons';

const MySubscription = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const handlePlanSelect = plan => {
    setSelectedPlan(plan);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.Entypo name="chevron-left" size={30} color={'#FFA800'} />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>My Subscription</Text>
          <Text style={styles.description}>
            Unlock all the power of this mobile tool and enjoy digital
            experience like never before!
          </Text>
          <Image
            source={require('../assets/subscription.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Rest of your subscription content... */}
        <View style={styles.optionsContainer}>
          {/* Monthly Option */}
          <TouchableOpacity
            style={[
              styles.option,
              selectedPlan === 'monthly'
                ? styles.selectedOption
                : styles.unselectedOption,
            ]}
            onPress={() => handlePlanSelect('monthly')}>
            <View style={styles.planHeader}>
              <Text style={styles.optionTitle}>Monthly</Text>
              {selectedPlan === 'monthly' && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.optionDescription}>
              First 7 days free - Then $12/Month
            </Text>
            <Text style={styles.priceDetail}>Total $144/year</Text>
          </TouchableOpacity>

          {/* Annual Option */}
          <TouchableOpacity
            style={[
              styles.option,
              selectedPlan === 'annual'
                ? styles.selectedOption
                : styles.unselectedOption,
            ]}
            onPress={() => handlePlanSelect('annual')}>
            <View style={styles.planHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.optionTitle}>Annual</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>Save 30%</Text>
                </View>
              </View>
              {selectedPlan === 'annual' && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.optionDescription}>
              First 30 days free - Then $100/Year
            </Text>
            <Text style={styles.priceDetail}>$8.33/month, billed annually</Text>
          </TouchableOpacity>
        </View>

        {/* Upgrade Button */}
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.buttonText}>
            upgrade to {selectedPlan === 'annual' ? 'annual' : 'monthly'} plan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerSection: {
    width: '80%',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  // ... rest of your styles remain the same
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
  },
  description: {
    color: 'black',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  option: {
    width: '90%',
    padding: 15,
    borderRadius: 12,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#FFA800',
    backgroundColor: '#FFF',
  },
  unselectedOption: {
    backgroundColor: '#f3f4f8',
    borderWidth: 2,
    borderColor: '#f3f4f8',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  optionDescription: {
    color: 'black',
    marginBottom: 4,
  },
  priceDetail: {
    color: '#666',
    fontSize: 12,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFA800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  savingsBadge: {
    backgroundColor: '#FFA800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  savingsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  upgradeButton: {
    backgroundColor: '#FFA800',
    width: '90%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textTransform: 'capitalize',
  },
});

export default MySubscription;
