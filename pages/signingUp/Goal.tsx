// Goal.tsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Icons from '../../Icons';
import weight from '../../assets/weightMachine.png';
import mental from '../../assets/mentalHealth.png';
import { completeSignup } from '../../redux/authSlice';
import { BASE_URL } from '../../global/server';
import { RootState } from '../../redux/store';
import { retrieveData, storeData } from '../../utils/Storage';

const Goal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [token, setToken] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const goalToFormMapping = {
    "IBS Colitis & Crohn's": 'FirstForm',
    Diabetes: 'SecondForm',
    'Mental Depression': 'ThirdForm',
    'E-Commerce': null,
  };

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
    };
    getToken();
  }, []);

  const toggleGoalSelection = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal],
    );
  };

  const getFormForGoal = (goal: string) => {
    return goalToFormMapping[goal];
  };

  const navigateToNextSelectedGoal = async (index = 0) => {
    if (index < selectedGoals.length) {
      const currentGoal = selectedGoals[index];
      const url = `${BASE_URL}/api/user/${userId}`;

      try {
        const response = await axios.put(
          url,
          { goal: selectedGoals },
          { headers: { token: `Bearer ${token}` } },
        );

        if (response.status === 200) {
          const formName = goalToFormMapping[currentGoal];

          if (formName) {
            navigation.navigate(formName as never, {
              goal: currentGoal,
              nextIndex: index + 1,
              selectedGoals: selectedGoals
                .map(goal => {
                  switch (goalToFormMapping[goal]) {
                    case 'FirstForm':
                      return 1;
                    case 'SecondForm':
                      return 2;
                    case 'ThirdForm':
                      return 3;
                    default:
                      return 0;
                  }
                })
                .filter(num => num !== 0),
              onReturn: () => navigateToNextSelectedGoal(index + 1),
            });
          } else {
            navigateToNextSelectedGoal(index + 1);
          }
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      dispatch(completeSignup());
      await storeData('isAuth', true);
      navigation.reset({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      });
    }
  };

  const goalOptions = [
    {
      id: "IBS Colitis & Crohn's",
      image: weight,
      type: 'image',
      form: 'FirstForm',
    },
    {
      id: 'Diabetes',
      icon: 'diabetes',
      type: 'icon',
      form: 'SecondForm',
    },
    {
      id: 'Mental Depression',
      image: mental,
      type: 'image',
      form: 'ThirdForm',
    },
    {
      id: 'E-Commerce',
      icon: 'shopping-bag',
      type: 'icon',
      form: null,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.title}>What's your goal?</Text>
        <Text style={{ color: 'black', fontSize: 16, marginVertical: 10 }}>
          You can select more than one. Don't worry, you can always change it
          later
        </Text>
      </View>

      <View style={{ flexDirection: 'column', gap: 40 }}>
        {goalOptions.map(goal => (
          <TouchableOpacity
            key={goal.id}
            onPress={() => toggleGoalSelection(goal.id)}
            style={[
              styles.goalOption,
              selectedGoals.includes(goal.id) && {
                backgroundColor: '#D9D9D9',
              },
            ]}>
            {goal.type === 'image' ? (
              <Image source={goal.image} style={{ width: 20, height: 20 }} />
            ) : goal.id === 'Diabetes' ? (
              <Icons.MaterialCommunityIcons
                name={goal.icon}
                size={25}
                color={'black'}
              />
            ) : (
              <Icons.Feather name={goal.icon} size={20} color={'black'} />
            )}
            <Text style={styles.goalText}>{goal.id}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { opacity: selectedGoals.length === 0 ? 0.5 : 1 }]}
        disabled={selectedGoals.length === 0}
        onPress={() => navigateToNextSelectedGoal()}>
        <Text style={styles.buttonText}>Next Step</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    color: 'black',
  },
  goalOption: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  button: {
    backgroundColor: '#F6AF24',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: '20%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Goal;
