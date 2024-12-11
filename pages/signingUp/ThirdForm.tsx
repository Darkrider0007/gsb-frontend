import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icons from '../../Icons';
import gsbLogo from '../../assets/gsbtransparent.png';
import {completeSignup} from '../../redux/authSlice';
import {useDispatch} from 'react-redux';
import {retrieveData, storeData} from '../../utils/Storage';
import {getData} from '../../global/server';

const ServiceData = [
  {
    questionText: 'Do you feel down or hopeless most of the time?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Have you lost interest in activities you used to enjoy?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText:
      'Do you experience difficulty concentrating or making decisions?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Do you have trouble sleeping or sleeping too much?',
    options: ['Yes, I have trouble sleeping', 'Yes, I sleep too much', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Do you often feel tired or low on energy?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Do you feel worthless or guilty for no reason?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText:
      'Have you experienced any changes in your appetite or weight?',
    options: ['Yes, loss of appetite', 'Yes, increased appetite', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Do you have thoughts of harming yourself or others?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Do you experience mood swings or feel easily irritated?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
  {
    questionText: 'Do you feel disconnected from friends or family?',
    options: ['Yes', 'No'],
    isMultipleChoice: false,
  },
];

const ThirdForm = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const {nextIndex, selectedGoals, onReturn} = route.params || {};

  const [selectedAnswers, setSelectedAnswers] = useState(
    Array.from({length: ServiceData.length}, () => new Set()),
  );
  const [isFormComplete, setIsFormComplete] = useState(false);
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

  const handleSubmit = async () => {
    try {
      // Prepare the results
      const result = ServiceData.map((question, index) => ({
        question: question.questionText,
        selectedOptions: Array.from(selectedAnswers[index]).map(
          i => question.options[i],
        ),
      }));

      console.log('Form Results:', result);

      // Check if there are more goals to process
      if (nextIndex < selectedGoals.length) {
        const nextPage =
          selectedGoals[nextIndex] === 2
            ? 'SecondForm'
            : selectedGoals[nextIndex] === 3
            ? 'ThirdForm'
            : 'FirstForm';

        navigation.navigate(nextPage as never, {
          nextIndex: nextIndex + 1,
          selectedGoals,
          onReturn,
        });
      } else {
        onReturn(); // Go back to the selection page after the last page
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
        <View style={{width: 25}} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <Text style={styles.title}>Mental Depression</Text>

        {ServiceData.map((item, questionIndex) => (
          <View key={questionIndex} style={styles.questionContainer}>
            <Text style={styles.question}>{item.questionText}</Text>
            <View style={styles.answersContainer}>
              {item.options.map((answer, answerIndex) => (
                <TouchableOpacity
                  key={answerIndex}
                  style={styles.answer}
                  onPress={() =>
                    handleSingleChoiceSelect(questionIndex, answerIndex)
                  }>
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
          style={[styles.submitButton, {opacity: isFormComplete ? 1 : 0.5}]}
          disabled={!isFormComplete}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ThirdForm;

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
