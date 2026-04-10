import { deleteApp, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  type User as FirebaseUser,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import type { User, UserRole } from "../types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  appUser: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createCollaboratorAccount: (
    email: string,
    password: string,
    name: string,
  ) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        if (snap.exists()) {
          setAppUser({ uid: fbUser.uid, ...snap.data() } as User);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setAppUser(null);
  };

  const createCollaboratorAccount = async (
    email: string,
    password: string,
    name: string,
  ): Promise<string> => {
    // Create isolated secondary app — admin session stays untouched
    const secondaryApp = initializeApp(firebaseConfig, "secondary");
    const secondaryAuth = getAuth(secondaryApp);

    try {
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password,
      );

      // Firestore write uses main admin session (still intact)
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        name,
        role: "collaborator" as UserRole,
        createdAt: new Date().toISOString(),
      });

      return cred.user.uid;
    } finally {
      // Always clean up secondary app
      await deleteApp(secondaryApp);
    }
  };

  const role = appUser?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        appUser,
        role,
        loading,
        login,
        logout,
        createCollaboratorAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
