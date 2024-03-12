import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext();

const checkToken = () => {
  const token = Cookies.get("tokenf");
  if(token) {
    return true;
  }
  else  {
    return false;
  }
}

const AuthProvider = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(checkToken);

  useEffect(() => {
    checkToken();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, server }}>
      {children}
    </AuthContext.Provider>
  );
};

const server =  "https://api.w3yogesh.com/api/v1";
export { AuthContext, AuthProvider, server };