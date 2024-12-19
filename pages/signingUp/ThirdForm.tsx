import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from '../../Icons';
import gsbLogo from '../../assets/gsbtransparent.png';
import { retrieveData } from '../../utils/Storage';
import { getData, BASE_URL } from '../../global/server';
import axios from 'axios';

const ThirdForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { nextIndex, selectedGoals, onReturn } = route.params || {};

  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const getTokenUserId = async () => {
      try {
        const storedToken = await retrieveData('token');
        const storedUserId = await retrieveData('userId');
        if (storedToken && storedUserId) {
          setToken(storedToken);
          setUserId(storedUserId);
        } else {
          throw new Error('Token or User ID missing');
        }
      } catch (error) {
        console.error('Error retrieving token/userId:', error);
      }
    };
    getTokenUserId();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getData('/api/depressionQuestions', token);
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
          setSelectedAnswers(Array.from({ length: data.length }, () => new Set()));
        } else {
          throw new Error('Invalid data format or empty questions');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (token) fetchQuestions();
  }, [token]);

  useEffect(() => {
    const isComplete = selectedAnswers.every((answerSet) => answerSet.size > 0);
    setIsFormComplete(isComplete);
  }, [selectedAnswers]);

  const handleSingleChoiceSelect = (questionIndex, answerIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = new Set([answerIndex]);
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = questions.map((question, index) => ({
        question: question.questionText,
        selectedOptions: Array.from(selectedAnswers[index]).map(
          (i) => question.options[i]
        ),
      }));

      const res = await axios.put(`${BASE_URL}/api/user/${userId}`, {
        depressionQuestions: result,
      });

      // console.log('Response from submitting form:', res);
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
    } finally {
      setSubmitting(false);
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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        <Text style={styles.title}>Mental Depression</Text>

        {questions.map((item, questionIndex) => (
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
                        backgroundColor: selectedAnswers[questionIndex]?.has(
                          answerIndex
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
          {
            submitting ? <ActivityIndicator color={'white'} /> :
              <Text style={styles.submitButtonText}>SUBMIT</Text>
          }
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
