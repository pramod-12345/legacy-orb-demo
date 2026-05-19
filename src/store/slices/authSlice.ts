import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  accountStatus: string;
  aiConsent: boolean;
  bio: string;
  countryCode: string;
  dateOfBirth?: string;
  deviceType: string;
  firstName: string;
  gender: string;
  isEmailVerified: boolean;
  jurisdiction: string;
  lastActive: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  preferredLanguage: string;
  profilePictureUrl: string;
  pushToken: string;
  roles: string[];
  timezone?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  validTill: number | null;
  refreshValidTill: number | null;
  refreshToken: string | null;
  user: AuthUser | null;
  lastActivityTime: number;
  inActiveTime: number;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  validTill: null,
  refreshValidTill: null,
  refreshToken: null,
  lastActivityTime: Date.now(),
  inActiveTime: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        validTill: number;
        refreshValidTill: number;
        user: AuthUser
      }>,
    ) => {
      const now = Date.now();
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.refreshToken = action.payload.refreshToken;
      // Convert seconds from API into absolute timestamps
      state.validTill = now + action.payload.validTill * 1000;
      state.refreshValidTill = now + action.payload.refreshValidTill * 1000;
    },
    setInActiveTime: (state, action) => {
      state.inActiveTime = action.payload;
    },
    setLastActivityTime: (state, action) => {
      state.lastActivityTime = action.payload;
    },
    setUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload as AuthUser;
      }
    },
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.refreshToken = null;
      state.validTill = null;
      state.refreshValidTill = null;
      state.lastActivityTime = Date.now();
      state.inActiveTime = 0;
    },
  },
});

export const { setCredentials, setUser, logout, setLastActivityTime, setInActiveTime } = authSlice.actions;
export default authSlice.reducer;
