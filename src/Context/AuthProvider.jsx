import React, { useCallback, useEffect, useState } from "react";
import { auth } from "../../firebase.init";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { axiosSecure } from "../api/apiClient";
import { loadDbProfile } from "./loadDbProfile";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState({});
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const handleLogOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUser = (profile) => {
    setLoading(true);
    return updateProfile(auth.currentUser, profile);
  };

  const verifyEmail = () => {
    return sendEmailVerification(auth.currentUser);
  };

  const fetchDbUser = useCallback(async (currentUser) => {
    return loadDbProfile({ client: axiosSecure, currentUser, auth, setDbUser });
  }, []);

  useEffect(() => {
    let authStateVersion = 0;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const version = ++authStateVersion;
      setLoading(true);
      if (!currentUser) {
        setUser(null);
        setDbUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      await fetchDbUser(currentUser);
      if (version === authStateVersion) setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [fetchDbUser]);

  const authInfo = {
    user,
    dbUser,
    setDbUser,
    loading,
    setLoading,
    createUser,
    signInUser,
    googleSignIn,
    handleLogOut,
    updateUser,
    verifyEmail,
    fetchDbUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
