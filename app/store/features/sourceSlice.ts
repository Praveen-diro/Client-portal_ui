import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { env } from '../../config/environment';
import { refreshToken as refreshAuth } from './authSlice';
import { cookies } from '../../services/cookie.service';

interface SourceData {
  category: string;
  country: string;
  countryid: string;
  id?: string;
  link: string;
  nickname: string;
  subcategory: string;
  type: string;
  uniquekey?: string;
}

interface SourceState {
  createSource: boolean;
  loading: boolean;
  error: string | null;
}

interface ApiResponse {
  msg: string;
  success: boolean;
  data?: any;
}

const initialState: SourceState = {
  createSource: false,
  loading: false,
  error: null
};

let createAttempts = 0;

// Create axios instance with interceptors
const api: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = cookies.get("apikey");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    // Also add token to headers directly
    config.headers['apikey'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = cookies.get("refreshToken");
      
      if (refreshToken && createAttempts < 5) {
        createAttempts++;
        return Promise.reject({ ...error, shouldRefresh: true });
      }
    }
    return Promise.reject(error);
  }
);

type CreateSourceResponse = string;

export const createSource = createAsyncThunk<CreateSourceResponse, SourceData>(
  'source/create',
  async (data: SourceData, { dispatch, rejectWithValue }) => {
    const apiKey = cookies.get("apikey");
    if (!apiKey) {
      return rejectWithValue('JWT token is missing or incorrect');
    }

    const json = {
      category: data.category,
      country: data.country,
      countryid: data.uniquekey || data.countryid,
      id: data.id,
      link: data.link,
      nickname: data.nickname,
      subcategory: data.subcategory,
      submit: {
        apikey: apiKey,
        country: data.country,
        countryid: data.uniquekey || data.countryid,
        mobile: cookies.get("email"),
      },
      type: "link"
    };

    try {
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'apikey': apiKey,
        'Content-Type': 'application/json'
      };

      const response: AxiosResponse<ApiResponse> = await api.post(env.createsource, json, { headers });
      console.log("Response:", response.data);
      
      if (response.status === 200 || response.status === 204) {
        createAttempts = 0;
        return response.data.msg;
      }
      
      return rejectWithValue('Failed to create source');
    } catch (err: any) {
      console.error('Create source error:', err.response?.data || err.message);
      
      if (err.shouldRefresh) {
        try {
          // Try to refresh the token
          const refreshResult = await dispatch(refreshAuth({ action: "createSource", data, isBackground: false }));
          console.log('Token refresh result:', refreshResult);
          
          // Get the new token
          const newToken = cookies.get("apikey");
          if (!newToken) {
            console.error('No new token after refresh');
            return rejectWithValue('Failed to refresh token');
          }

          // Retry the request with new token
          const retryHeaders = {
            'Authorization': `Bearer ${newToken}`,
            'apikey': newToken,
            'Content-Type': 'application/json'
          };

          const retryResponse: AxiosResponse<ApiResponse> = await api.post(
            env.createsource, 
            {
              ...json,
              submit: { ...json.submit, apikey: newToken }
            },
            { headers: retryHeaders }
          );
          
          return retryResponse.data.msg;
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError);
          return rejectWithValue('Failed to refresh token');
        }
      }
      
      if (err.response?.status === 401) {
        return rejectWithValue('JWT token is missing or incorrect');
      }
      
      return rejectWithValue(err.message || 'Failed to create source');
    }
  }
);

const sourceSlice = createSlice({
  name: 'source',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSource.fulfilled, (state) => {
        state.loading = false;
        state.createSource = !state.createSource;
      })
      .addCase(createSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sourceSlice.reducer; 