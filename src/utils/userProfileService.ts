import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserProfileFormData } from '../types/User';

const COLLECTION_NAME = 'userProfiles';

// FirestoreのタイムスタンプをDateに変換
const convertTimestamp = (timestamp: Timestamp | null): Date => {
  if (!timestamp) return new Date();
  return timestamp.toDate();
};

// FirestoreデータをUserProfile型に変換
const convertFromFirestore = (doc: any): UserProfile => {
  const data = doc.data();
  return {
    uid: doc.id,
    email: data.email,
    displayName: data.displayName,
    favoriteGenre: data.favoriteGenre,
    bio: data.bio || '',
    favoriteAuthor: data.favoriteAuthor || '',
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

// ユーザープロフィールを取得
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const profile = convertFromFirestore(docSnap);
      console.log('getUserProfile - 取得したプロフィール:', profile);
      return profile;
    }
    console.log('getUserProfile - プロフィールが見つかりません');
    return null;
  } catch (error) {
    console.error('ユーザープロフィールの取得に失敗:', error);
    
    // Firebaseが利用できない場合のフォールバック
    if (error.code === 'permission-denied' || error.code === 'unavailable') {
      console.log('Firebaseが利用できないため、ローカルストレージから取得を試行...');
      return getFromLocalStorageFallback(uid);
    }
    
    throw error;
  }
};

// ローカルストレージからのフォールバック取得
const getFromLocalStorageFallback = (uid: string): UserProfile | null => {
  try {
    const data = localStorage.getItem(`userProfile_${uid}`);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    }
    return null;
  } catch (error) {
    console.error('ローカルストレージからの取得に失敗:', error);
    return null;
  }
};

// ユーザープロフィールを作成・更新
export const upsertUserProfile = async (
  uid: string, 
  email: string, 
  profileData: UserProfileFormData
): Promise<UserProfile> => {
  try {
    console.log('upsertUserProfile - 保存データ:', profileData);
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // 既存プロフィールを更新
      console.log('既存プロフィールを更新');
      await updateDoc(docRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // 新規プロフィールを作成
      console.log('新規プロフィールを作成');
      await setDoc(docRef, {
        ...profileData,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    
    // 更新後のプロフィールを取得
    const updatedProfile = await getUserProfile(uid);
    if (!updatedProfile) throw new Error('プロフィールの取得に失敗');
    return updatedProfile;
  } catch (error) {
    console.error('ユーザープロフィールの作成・更新に失敗:', error);
    
    // Firebaseが利用できない場合のフォールバック
    if (error.code === 'permission-denied' || error.code === 'unavailable') {
      console.log('Firebaseが利用できないため、ローカルストレージに保存...');
      return saveToLocalStorageFallback(uid, email, profileData);
    }
    
    throw error;
  }
};

// ローカルストレージへのフォールバック保存
const saveToLocalStorageFallback = (
  uid: string, 
  email: string, 
  profileData: UserProfileFormData
): UserProfile => {
  const now = new Date();
  const profile: UserProfile = {
    uid,
    email,
    ...profileData,
    createdAt: now,
    updatedAt: now,
  };
  
  try {
    localStorage.setItem(`userProfile_${uid}`, JSON.stringify(profile));
    console.log('ローカルストレージに保存完了:', profile);
    return profile;
  } catch (error) {
    console.error('ローカルストレージへの保存に失敗:', error);
    throw error;
  }
};

// ユーザープロフィールを更新
export const updateUserProfile = async (
  uid: string, 
  profileData: Partial<UserProfileFormData>
): Promise<UserProfile> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    });
    
    // 更新後のプロフィールを取得
    const updatedProfile = await getUserProfile(uid);
    if (!updatedProfile) throw new Error('プロフィールの取得に失敗');
    return updatedProfile;
  } catch (error) {
    console.error('ユーザープロフィールの更新に失敗:', error);
    throw error;
  }
};
