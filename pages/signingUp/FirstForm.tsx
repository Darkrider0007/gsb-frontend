import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from '../../Icons';
import gsbLogo from '../../assets/gsbtransparent.png';
import {completeSignup} from '../../redux/authSlice';
import {useDispatch} from 'react-redux';
import {retrieveData, storeData} from '../../utils/Storage';
import {getData} from '../../global/server';

const FirstForm = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getTokenUserId = async () => {
      const storedToken = await retrieveData('token');
      setToken(storedToken);
      const storedUserId = await retrieveData('userId');
      setUserId(storedUserId);
    };
    getTokenUserId();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getData('/api/serviceQuestions', token); // Replace with your endpoint
        setQuestions(response);
        setSelectedAnswers(
          Array.from({length: response.length}, () => new Set()),
        );
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [token]);

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
    const selectedSet = newSelectedAnswers[questionIndex];
    if (selectedSet.has(answerIndex)) {
      selectedSet.delete(answerIndex);
    } else {
      selectedSet.add(answerIndex);
    }
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (questions[questionIndex].isMultipleChoice) {
      handleMultipleChoiceSelect(questionIndex, answerIndex);
    } else {
      handleSingleChoiceSelect(questionIndex, answerIndex);
    }
  };

  const handleSubmit = () => {
    const result =
      questions &&
      questions.map((question, index) => ({
        question: question.questionText,
        selectedOptions: Array.from(selectedAnswers[index]).map(
          i => question.options[i],
        ),
      }));
    console.log(result);
    dispatch(completeSignup());
    storeData('isAuth', true);
    navigation.navigate('TabNavigator');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.AntDesign name="arrowleft" size={25} color={'black'} />
        </TouchableOpacity>
        <Image source={gsbLogo} />
        <TouchableOpacity>
          {/* <Icons.Feather name="shopping-bag" size={25} color={'black'} /> */}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}>
        {questions &&
          questions?.map((item, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.question}>{item.questionText}</Text>
              <View
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#FFA800',
                  padding: 10,
                }}>
                {item.options.map((answer: string, i: number) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.answer}
                    onPress={() => handleAnswerSelect(index, i)}>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: selectedAnswers[index]?.has(i)
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
          style={{
            backgroundColor: '#F6AF24',
            padding: 16,
            alignItems: 'center',
            borderRadius: 12,
            marginBottom: 20,
          }}>
          <Text style={{color: 'white', fontWeight: '600', fontSize: 16}}>
            SUBMIT
          </Text>
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
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: 'gray',
  },
  answerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  answer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAnswer: {
    backgroundColor: '#F6AF24',
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
});
