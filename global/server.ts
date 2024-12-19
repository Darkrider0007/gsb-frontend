import axios from 'axios';

export const BASE_URL = 'https://gsb-backend-fs0t.onrender.com';
// export const BASE_URL = 'http://192.168.1.5:5000';

export const getData = async (url: string, token: string | null) => {
  let headerObj = {};
  if (token) {
    headerObj = {
      ...headerObj,
      'Content-Type': 'application/json',
      token: `Bearer ${token}`,
    };
  }
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {headers: headerObj});
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postData = async (
  url: string,
  data: any,
  token: string | null,
  type: string | null,
) => {
  let headerObj = {};
  if (token) {
    headerObj = {
      ...headerObj,
      token: `Bearer ${token}`,
    };
  }
  if (type === 'media') {
    headerObj = {
      ...headerObj,
      'Content-Type': 'multipart/form-data',
    };
  }
  try {
    const response = await axios.post(`${BASE_URL}${url}`, data, {
      headers: headerObj,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
