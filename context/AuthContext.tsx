'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, 
  signOut,
  getAuth,
  Auth
} from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, token: string) => Promise<void>;
  login: (email: string, password: string, token: string) => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const app = getFirebaseApp();
      const authInstance = getAuth(app);
      setAuth(authInstance);

      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Failed to initialize Firebase for Auth", err);
      setLoading(false);
      setError("Could not connect to authentication service.");
    }
  }, []);

  const signup = async (email: string, password: string, token: string) => {
    setError(null);
    if (!auth) {
        setError("Authentication service is not available.");
        return;
    }
    if (!token) {
        setError("reCAPTCHA check failed. Please try again.");
        return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/'); 
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const login = async (email: string, password: string, token: string) => {
    setError(null);
    if (!auth) {
        setError("Authentication service is not available.");
        return;
    }
     if (!token) {
        setError("reCAPTCHA check failed. Please try again.");
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider | GithubAuthProvider) => {
    setError(null);
    if (!auth) {
        setError("Authentication service is not available.");
        return;
    }
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const signInWithGoogle = () => handleSignIn(new GoogleAuthProvider());
  const signInWithFacebook = () => handleSignIn(new FacebookAuthProvider());
  const signInWithGithub = () => handleSignIn(new GithubAuthProvider());
  
  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/auth');
  };

  const value = {
    user,
    currentUser: user,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
