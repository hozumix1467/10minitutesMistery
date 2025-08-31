import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Novel, NovelFormData, Comment } from '../types/Novel';

const COLLECTION_NAME = 'novels';

// FirestoreのタイムスタンプをDateに変換
const convertTimestamp = (timestamp: Timestamp | null): Date => {
  if (!timestamp) return new Date();
  return timestamp.toDate();
};

// FirestoreデータをNovel型に変換
const convertFromFirestore = (doc: any): Novel => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    content: data.content,
    author: data.author,
    tags: data.tags || [],
    characterCount: data.characterCount,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
    pendingSync: data.pendingSync || false,
    userId: data.userId || 'anonymous',
    likes: data.likes || [],
    comments: data.comments ? data.comments.map((comment: any) => ({
      ...comment,
      createdAt: convertTimestamp(comment.createdAt)
    })) : []
  };
};

// 全小説を取得
export const getAllNovels = async (): Promise<Novel[]> => {
  try {
    const novelsRef = collection(db, COLLECTION_NAME);
    const q = query(novelsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(convertFromFirestore);
  } catch (error) {
    console.error('小説の取得に失敗:', error);
    throw error;
  }
};

// 特定の小説を取得
export const getNovel = async (id: string): Promise<Novel | null> => {
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

// ユーザーの小説を取得
export const getUserNovels = async (userId: string): Promise<Novel[]> => {
  try {
    const novelsRef = collection(db, COLLECTION_NAME);
    const q = query(
      novelsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(convertFromFirestore);
  } catch (error) {
    console.error('ユーザー小説の取得に失敗:', error);
    throw error;
  }
};

// 小説を作成
export const createNovel = async (novelData: NovelFormData, userId: string): Promise<Novel> => {
  try {
    const novelsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(novelsRef, {
      ...novelData,
      characterCount: novelData.content.length,
      userId,
      likes: [],
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // 作成された小説を取得
    const createdNovel = await getNovel(docRef.id);
    if (!createdNovel) throw new Error('小説の作成に失敗');
    
    return createdNovel;
  } catch (error) {
    console.error('小説の作成に失敗:', error);
    throw error;
  }
};

// 小説を更新
export const updateNovel = async (id: string, novelData: Partial<NovelFormData>): Promise<Novel> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...novelData,
      characterCount: novelData.content ? novelData.content.length : undefined,
      updatedAt: serverTimestamp(),
    });
    
    // 更新された小説を取得
    const updatedNovel = await getNovel(id);
    if (!updatedNovel) throw new Error('小説の更新に失敗');
    
    return updatedNovel;
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

// いいねを追加/削除
export const toggleLike = async (novelId: string, userId: string): Promise<Novel> => {
  try {
    const novel = await getNovel(novelId);
    if (!novel) throw new Error('小説が見つかりません');
    
    const likes = novel.likes || [];
    const isLiked = likes.includes(userId);
    
    const updatedLikes = isLiked 
      ? likes.filter(uid => uid !== userId)
      : [...likes, userId];
    
    const docRef = doc(db, COLLECTION_NAME, novelId);
    await updateDoc(docRef, {
      likes: updatedLikes,
      updatedAt: serverTimestamp(),
    });
    
    // 更新された小説を取得
    const updatedNovel = await getNovel(novelId);
    if (!updatedNovel) throw new Error('小説の更新に失敗');
    
    return updatedNovel;
  } catch (error) {
    console.error('いいねの更新に失敗:', error);
    throw error;
  }
};

// コメントを追加
export const addComment = async (novelId: string, comment: Comment): Promise<Novel> => {
  try {
    const novel = await getNovel(novelId);
    if (!novel) throw new Error('小説が見つかりません');
    
    const comments = novel.comments || [];
    const newComment = {
      ...comment,
      createdAt: comment.createdAt, // 元の日時を保持
    };
    
    const docRef = doc(db, COLLECTION_NAME, novelId);
    await updateDoc(docRef, {
      comments: [...comments, newComment],
      updatedAt: serverTimestamp(),
    });
    
    // 更新された小説を取得
    const updatedNovel = await getNovel(novelId);
    if (!updatedNovel) throw new Error('小説の更新に失敗');
    
    return updatedNovel;
  } catch (error) {
    console.error('Firebaseでのコメント追加に失敗:', error);
    
    // Firebaseが利用できない場合はローカルで更新
    if (error.code === 'permission-denied' || error.code === 'unavailable') {
      console.log('Firebaseが利用できないため、ローカルでコメントを追加...');
      return addCommentLocalFallback(novelId, comment);
    }
    
    throw error;
  }
};

// ローカルフォールバック: コメントを追加
const addCommentLocalFallback = (novelId: string, comment: Comment): Novel => {
  try {
    const novels = JSON.parse(localStorage.getItem('novels') || '[]');
    const novelIndex = novels.findIndex((n: Novel) => n.id === novelId);
    
    if (novelIndex === -1) {
      throw new Error('小説が見つかりません');
    }
    
    const novel = novels[novelIndex];
    const comments = novel.comments || [];
    const updatedNovel = {
      ...novel,
      comments: [...comments, comment],
      updatedAt: new Date(),
    };
    
    novels[novelIndex] = updatedNovel;
    localStorage.setItem('novels', JSON.stringify(novels));
    
    console.log('ローカルストレージにコメントを追加完了:', updatedNovel);
    return updatedNovel;
  } catch (error) {
    console.error('ローカルでのコメント追加に失敗:', error);
    throw error;
  }
};

// ローカルストレージからのデータ移行
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const stored = localStorage.getItem('mystery-novels');
    if (!stored) return;
    
    const localNovels = JSON.parse(stored);
    console.log('ローカルストレージから移行する小説数:', localNovels.length);
    
    for (const novel of localNovels) {
      try {
        // 既存の小説かチェック
        const existingNovel = await getNovel(novel.id);
        if (existingNovel) {
          console.log(`小説 "${novel.title}" は既にFirebaseに存在します`);
          continue;
        }
        
        // Firebaseに移行（作者名を修正）
        const novelsRef = collection(db, COLLECTION_NAME);
        await addDoc(novelsRef, {
          ...novel,
          // 作者名が「あなたの名前」の場合は「匿名ユーザー」に変更
          author: novel.author === 'あなたの名前' ? '匿名ユーザー' : novel.author,
          createdAt: novel.createdAt ? new Date(novel.createdAt) : serverTimestamp(),
          updatedAt: novel.updatedAt ? new Date(novel.updatedAt) : serverTimestamp(),
        });
        
        console.log(`小説 "${novel.title}" をFirebaseに移行しました`);
      } catch (error) {
        console.error(`小説 "${novel.title}" の移行に失敗:`, error);
      }
    }
    
    console.log('データ移行が完了しました');
  } catch (error) {
    console.error('データ移行に失敗:', error);
    throw error;
  }
};
