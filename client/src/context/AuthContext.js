import React, { createContext, useReducer, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

// Initial state
const initialState = {
  currentUser: null,
  isAdmin: false,
  isLoading: true
};

// Actions
const SET_USER = 'SET_USER';
const SET_LOADING = 'SET_LOADING';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isAdmin: action.payload?.email.endsWith('@booknest.com'),
        isLoading: false
      };
    case SET_LOADING:
      return { ...state, isLoading: true };
    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const auth = getAuth();

  useEffect(() => {
    dispatch({ type: SET_LOADING });
    const unsubscribe = auth.onAuthStateChanged(user => {
      dispatch({ type: SET_USER, payload: user });
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
