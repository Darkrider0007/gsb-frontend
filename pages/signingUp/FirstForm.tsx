import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icons from '../../Icons';
import gsbLogo from '../../assets/gsbtransparent.png';
import { completeSignup } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { retrieveData, storeData } from '../../utils/Storage';
import { getData } from '../../global/server';

// Type definitions for better type safety
type RootStackParamList = {
  FirstForm: {
    nextIndex: number;
    selectedGoals: number[];
    onReturn: () => void;
  };
  SecondForm: {
    nextIndex: number;
    selectedGoals: number[];
    onReturn: () => void;
  };
  ThirdForm: {
    nextIndex: number;
    selectedGoals: number[];
    onReturn: () => void;
  };
};

const ServiceData = [
  {
    questionText: 'Are you suffering from IBS?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Which type of IBS are you suffering from?',
    options: ['IBS-C', 'IBS-B', 'IBS-M'],
    isMultipleChoice: false,
  },
  {
    questionText: 'What Are Your Symptoms?',
    options: [
      'Diarrhea',
      'Constipation',
      'Gas',
      'Abdominal Pain',
      'Mucus with Stool',
      'Disturbed Sleep Cycle',
      'Weakness',
      'Stress',
      'Anxiety',
      'Overthinking',
      'Irritable',
      'Lack of focus',
      'Depression',
      'Weight loss',
      'Palpitation',
    ],
    isMultipleChoice: true,
  },
  {
    questionText: 'How is the environment of your family?',
    options: [
      'Stressful',
      'Slightly stressful',
      'Slightly happy',
      'Normal',
      'Happy',
    ],
    isMultipleChoice: false,
  },
  {
    questionText: 'How long have you had this problem?',
    options: [
      '0-1 years',
      '1-5 years',
      '5-10 years',
      '10-15 years',
      'More than 15 years',
    ],
    isMultipleChoice: false,
  },
  {
    questionText: 'Have you taken any treatment for IBS ?',
    options: ['Allopathy', 'Homeopathic', 'Ayurvedic', 'Unani', 'None'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Which type of test have you taken?',
    options: [
      'Sonography',
      'Ultrasound',
      'Endoscopy',
      'CBC',
      'LFT',
      'Thyroid profile',
      'KFT',
      'Lipid profile',
      'Stool Test',
    ],
    isMultipleChoice: true,
  },
  {
    questionText: 'How is your lifestyle?',
    options: ['Sedentary / very less work ', 'Moderate work', 'Heavy work'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Are you addicted to any of the following:',
    options: ['Alcohol', 'Smoking', 'Junk Food', 'Phone', 'Tobacco'],
    isMultipleChoice: true,
  },
  {
    questionText: 'Do you have any other medical condition?',
    options: [
      'Diabetes',
      'High blood pressure/ Hypertension',
      'Low blood pressure/ Hypotension',
      'Heart disease',
      'Lung disease',
      'Kidney disease',
      'Vitamin Deficiency',
      'Anemia',
      'Allergy',
      'PCOD',
    ],
    isMultipleChoice: true,
  },
];

const FirstForm = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const route = useRoute();
  const { nextIndex, selectedGoals, onReturn } = route.params || {};

  const [selectedAnswers, setSelectedAnswers] = useState(
    Array.from({ length: ServiceData.length }, () => new Set()),
  );
  const [isFormComplete, setIsFormComplete] = useState(false); // New state
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getTokenUserId = async () => {
      try {
        const storedToken = await retrieveData('token');
        setToken(storedToken);
        const storedUserId = await retrieveData('userId');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error retrieving token/userId:', error);
      }
    };
    getTokenUserId();
  }, []);

  useEffect(() => {
    // Check if all questions are answered
    const isComplete = selectedAnswers.every(answerSet => answerSet.size > 0);
    setIsFormComplete(isComplete);
  }, [selectedAnswers]);

  const handleSingleChoiceSelect = (
    questionIndex: number,
    answerIndex: number,
  ) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = new Set([answerIndex]);
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleMultipleChoiceSelect = (
    questionIndex: number,
    answerIndex: number,
  ) => {
    const newSelectedAnswers = [...selectedAnswers];
    const selectedSet = new Set(newSelectedAnswers[questionIndex]);

    if (selectedSet.has(answerIndex)) {
      selectedSet.delete(answerIndex);
    } else {
      selectedSet.add(answerIndex);
    }

    newSelectedAnswers[questionIndex] = selectedSet;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = async () => {
    try {
      const result = ServiceData.map((question, index) => ({
        question: question.questionText,
        selectedOptions: Array.from(selectedAnswers[index]).map(
          i => question.options[i],
        ),
      }));

      console.log('Form Results:', result);

      if (nextIndex < selectedGoals.length) {
        const nextPage =
          selectedGoals[nextIndex] === 2
            ? 'SecondForm'
            : selectedGoals[nextIndex] === 3
              ? 'ThirdForm'
              : 'FirstForm';

        navigation.navigate(nextPage, {
          nextIndex: nextIndex + 1,
          selectedGoals,
          onReturn,
        });
      } else {
        onReturn();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Image source={gsbLogo} />
        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <Text style={styles.title}>IBS Colitis & Crohn's</Text>

        {ServiceData.map((item, questionIndex) => (
          <View key={questionIndex} style={styles.questionContainer}>
            <Text style={styles.question}>{item.questionText}</Text>
            <View style={styles.answersContainer}>
              {item.options.map((answer, answerIndex) => (
                <TouchableOpacity
                  key={answerIndex}
                  style={styles.answer}
                  onPress={() => {
                    if (item.isMultipleChoice) {
                      handleMultipleChoiceSelect(questionIndex, answerIndex);
                    } else {
                      handleSingleChoiceSelect(questionIndex, answerIndex);
                    }
                  }}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: selectedAnswers[questionIndex].has(
                          answerIndex,
                        )
                          ? '#F6AF24'
                          : 'transparent',
                      },
                    ]}
                  />
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.submitButton, { opacity: isFormComplete ? 1 : 0.5 }]}
          disabled={!isFormComplete}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FirstForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: 'black',
    borderBottomWidth: 1,
    fontWeight: '500',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#344054',
  },
  answersContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFA800',
    padding: 10,
  },
  answer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  answerText: {
    fontSize: 16,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#F6AF24',
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
