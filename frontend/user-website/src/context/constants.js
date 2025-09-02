// Action types
export const ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
};

// Initial state
export const initialState = {
  theme: 'light',
  user: null,
  isLoading: false,
  error: null,
  notifications: []
};
