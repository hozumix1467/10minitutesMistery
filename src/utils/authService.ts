import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from './firebase';

// ユーザー認証状態の型
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Google認証プロバイダー
const googleProvider = new GoogleAuthProvider();

// サインイン
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('サインインに失敗:', error);
    throw error;
  }
};

// Googleログイン
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Googleログインに失敗:', error);
    throw error;
  }
};

// サインアップ
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('サインアップに失敗:', error);
    throw error;
  }
};

// サインアウト
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('サインアウトに失敗:', error);
    throw error;
  }
};

// 現在のユーザーを取得
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// 認証状態の変更を監視
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ユーザーがログインしているかチェック
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

// ユーザーIDを取得
export const getUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};

// ユーザーメールアドレスを取得
export const getUserEmail = (): string | null => {
  return auth.currentUser?.email || null;
};
