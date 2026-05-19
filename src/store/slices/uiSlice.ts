import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  // Add other UI related states here if needed
}

const initialState: UIState = {
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Add other UI related reducers here if needed
  },
});

export default uiSlice.reducer;
