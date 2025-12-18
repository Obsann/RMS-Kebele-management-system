import { createContext } from 'react';

// Create the context with safe default values
export const AuthContext = createContext({
  user: null,
  login: () => false, 
  logout: () => {},
  register: () => false,
});