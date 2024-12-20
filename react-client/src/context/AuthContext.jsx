import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/FireBaseConfig";
import CircularProgress from "@mui/material/CircularProgress";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let myListener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log("onAuthStateChanged", user);
      setLoadingUser(false);
    });
    return () => {
      if (myListener) myListener();
    };
  }, []);

  if (loadingUser) {
    return (
      <div>
        {/* <h1>Loading....Loading....Loading....Loading....Loading....</h1> */}
        <CircularProgress />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
