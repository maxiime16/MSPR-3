import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    // Stocker les informations de l'utilisateur dans AsyncStorage
    storeUserData(userData);
  };

  const logout = () => {
    setUser(null);
    // Supprimer les informations de l'utilisateur de AsyncStorage lors de la déconnexion
    AsyncStorage.removeItem('userData').catch(error => console.error('Erreur lors de la suppression des données utilisateur :', error));
  };
  
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
