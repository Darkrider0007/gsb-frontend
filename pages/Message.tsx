import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import admin from '../assets/admin.png';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {retrieveData} from '../utils/Storage';
import {updateUser} from '../redux/authSlice';
import {getData} from '../global/server';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const fetchedUserId = useSelector((state: RootState) => state.auth.user?._id);
  const [userId, setUserId] = useState<string | null>(fetchedUserId || null);
  const fetchedUser = useSelector((state: RootState) => state.auth.user);
  const [user, setUser] = useState(fetchedUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = async () => {
      const response = await getData(`/api/user/find/${userId}`, token);
      console.log('response ', response);
      setUser(response);
    };
    userData();
    //update the userdata in the redux
    dispatch(updateUser(user));
    console.log('fetched user');
  }, [userId, token]);

  console.log(user);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await retrieveData('token'); // Retrieve token from AsyncStorage
      setToken(storedToken);
    };

    const getUserId = async () => {
      const storedUserId = await retrieveData('userId'); // Retrieve userId from AsyncStorage
      setUserId(storedUserId);
    };
    getToken();
    getUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadMessages = async () => {
      const messagesRef = firestore()
        .collection('chats')
        .doc(userId)
        .collection('messages')
        .orderBy('createdAt', 'desc');

      const unsubscribe = messagesRef.onSnapshot(snapshot => {
        const loadedMessages: IMessage[] = [];
        snapshot?.forEach(doc => {
          const data = doc.data();
          loadedMessages.push({
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
          });
        });
        setMessages(loadedMessages);
      });

      return () => unsubscribe();
    };

    loadMessages();
  }, [userId]);

  const onSend = useCallback(
    (messages: IMessage[] = []) => {
      if (!userId) return;

      const messagesRef = firestore()
        .collection('chats')
        .doc(userId)
        .collection('messages');

      const batch = firestore().batch();
      messages.forEach(message => {
        const docRef = messagesRef.doc();
        batch.set(docRef, {
          ...message,
          createdAt: firestore.Timestamp.now(),
        });
      });

      batch.commit();
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    },
    [userId],
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: userId || '',
        name: user?.name || 'User', // Replace with dynamic user name or email
      }}
    />
  );
};

export default ChatScreen;
