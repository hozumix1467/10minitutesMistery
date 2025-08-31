import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Novel, NovelFormData } from '../types/Novel';

const COLLECTION_NAME = 'novels';

// FirestoreのタイムスタンプをDateに変換
const convertTimestamp = (timestamp: Timestamp | null): Date => {
  if (!timestamp) return new Date();
  return timestamp.toDate();
};

// NovelデータをFirestore用に変換
const convertToFirestore = (novel: NovelFormData) => ({
  ...novel,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  characterCount: novel.content.length,
});

// FirestoreデータをNovel型に変換
const convertFromFirestore = (doc: any): Novel => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    content: data.content,
    tags: data.tags || [],
    author: data.author,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
    characterCount: data.characterCount || 0,
    pendingSync: false,
  };
};

// 小説一覧を取得
export const getNovels = async (): Promise<Novel[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(convertFromFirestore);
  } catch (error) {
    console.error('小説一覧の取得に失敗:', error);
    throw error;
  }
};

// 小説をIDで取得
export const getNovelById = async (id: string): Promise<Novel | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertFromFirestore(docSnap);
    }
    return null;
  } catch (error) {
    console.error('小説の取得に失敗:', error);
    throw error;
  }
};

// 小説を作成
export const createNovel = async (novelData: NovelFormData): Promise<Novel> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), convertToFirestore(novelData));
    const novel = await getNovelById(docRef.id);
    if (!novel) throw new Error('作成した小説の取得に失敗');
    return novel;
  } catch (error) {
    console.error('小説の作成に失敗:', error);
    throw error;
  }
};

// 小説を更新
export const updateNovel = async (id: string, novelData: Partial<NovelFormData>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...novelData,
      updatedAt: serverTimestamp(),
      ...(novelData.content && { characterCount: novelData.content.length }),
    };
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('小説の更新に失敗:', error);
    throw error;
  }
};

// 小説を削除
export const deleteNovel = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('小説の削除に失敗:', error);
    throw error;
  }
};

// 小説を検索
export const searchNovels = async (
  query: string, 
  filters?: {
    tags?: string[];
    author?: string;
    minCharacters?: number;
    maxCharacters?: number;
  }
): Promise<Novel[]> => {
  try {
    let q = collection(db, COLLECTION_NAME);
    
    // 作者フィルター
    if (filters?.author) {
      q = query(q, where('author', '==', filters.author));
    }
    
    // 文字数フィルター
    if (filters?.minCharacters) {
      q = query(q, where('characterCount', '>=', filters.minCharacters));
    }
    if (filters?.maxCharacters) {
      q = query(q, where('characterCount', '<=', filters.maxCharacters));
    }
    
    const querySnapshot = await getDocs(q);
    let novels = querySnapshot.docs.map(convertFromFirestore);
    
    // クエリ検索（クライアントサイド）
    if (query) {
      novels = novels.filter(novel => 
        novel.title.toLowerCase().includes(query.toLowerCase()) ||
        novel.content.toLowerCase().includes(query.toLowerCase()) ||
        novel.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // タグフィルター（クライアントサイド）
    if (filters?.tags && filters.tags.length > 0) {
      novels = novels.filter(novel => 
        filters.tags!.some(tag => novel.tags.includes(tag))
      );
    }
    
    return novels;
  } catch (error) {
    console.error('小説の検索に失敗:', error);
    throw error;
  }
};

// ユーザーの小説を取得
export const getUserNovels = async (userId: string): Promise<Novel[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('author', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFromFirestore);
  } catch (error) {
    console.error('ユーザー小説の取得に失敗:', error);
    throw error;
  }
};

// 人気の小説を取得
export const getPopularNovels = async (limitCount: number = 10): Promise<Novel[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('characterCount', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFromFirestore);
  } catch (error) {
    console.error('人気小説の取得に失敗:', error);
    throw error;
  }
};

// 最新の小説を取得
export const getRecentNovels = async (limitCount: number = 10): Promise<Novel[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFromFirestore);
  } catch (error) {
    console.error('最新小説の取得に失敗:', error);
    throw error;
  }
};
