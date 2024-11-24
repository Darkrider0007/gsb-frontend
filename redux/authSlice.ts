import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {postData} from '../global/server';

const initialState = {
  isAuth: false,
  user: null,
  isFetching: false,
  error: false,
  signupStage: 'idle', // idle, phoneSubmitted, verifyingOtp, completed
};

export const uploadProfileImage = createAsyncThunk(
  'auth/uploadProfileImage',
  async ({id, image, token}, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });

      const response = await postData(
        `/api/user/upload-profile-image/${id}`,
        formData,
        token,
        'media',
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signupStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    signupSuccess: state => {
      state.isFetching = false;
      state.signupStage = 'phoneSubmitted';
      state.error = false;
    },
    signupFailure: state => {
      state.isFetching = false;
      state.error = true;
    },
    verificationStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    verificationSuccess: (state, action) => {
      state.isFetching = false;
      state.signupStage = 'completed';
      state.error = false;
      state.user = action.payload;
    },
    verificationFailure: state => {
      state.isFetching = false;
      state.error = true;
    },
    completeSignup: state => {
      state.isAuth = true;
      state.signupStage = 'idle';
      state.error = false;
    },
    logout: state => {
      state.isAuth = false;
      state.user = null;
      state.signupStage = 'idle';
      state.tempUser = null;
    },
    updateUser: (state, action) => {
      state.user = {...state.user, ...action.payload};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(uploadProfileImage.pending, state => {
        state.isFetching = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isFetching = false;
        state.user = {...state.user, ...action.payload};
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const {
  signupStart,
  signupSuccess,
  signupFailure,
  verificationStart,
  verificationSuccess,
  verificationFailure,
  completeSignup,
  logout,
  updateUser, // Add the updateUser action
} = authSlice.actions;

export default authSlice.reducer;
