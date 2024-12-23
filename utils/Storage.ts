import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    let stringified = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringified);
    return true;
  } catch (error) {
    return false;
  }
};

export const retrieveData = async (key: string) => {
  try {
    let data = await AsyncStorage.getItem(key);
    return JSON.parse(data);
  } catch (error) {
    return false;
  }
};

export const removeDataByKey = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};
