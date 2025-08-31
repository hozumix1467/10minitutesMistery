import { Draft, DraftFormData } from '../types/Draft';

const STORAGE_KEY = 'mystery-drafts';

// 下書きを保存
export const saveDraft = (draft: Draft): void => {
  try {
    const drafts = getDrafts();
    const existingIndex = drafts.findIndex(d => d.id === draft.id);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('下書きの保存に失敗:', error);
  }
};

// 下書きを取得
export const getDrafts = (): Draft[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const drafts = JSON.parse(stored);
    return drafts.map((draft: any) => ({
      ...draft,
      createdAt: new Date(draft.createdAt),
      updatedAt: new Date(draft.updatedAt),
    }));
  } catch (error) {
    console.error('下書きの読み込みに失敗:', error);
    return [];
  }
};

// ユーザーの下書きを取得
export const getUserDrafts = (userId: string): Draft[] => {
  const allDrafts = getDrafts();
  return allDrafts.filter(draft => draft.userId === userId);
};

// 下書きを削除
export const deleteDraft = (id: string): void => {
  try {
    const drafts = getDrafts();
    const filteredDrafts = drafts.filter(draft => draft.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDrafts));
  } catch (error) {
    console.error('下書きの削除に失敗:', error);
  }
};

// 下書きをIDで取得
export const getDraftById = (id: string): Draft | null => {
  const drafts = getDrafts();
  return drafts.find(draft => draft.id === id) || null;
};

// 下書きを作成
export const createDraft = (draftData: DraftFormData, userId: string): Draft => {
  const now = new Date();
  const draft: Draft = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...draftData,
    userId,
    createdAt: now,
    updatedAt: now,
  };
  
  saveDraft(draft);
  return draft;
};

// 下書きを更新
export const updateDraft = (id: string, draftData: Partial<DraftFormData>): Draft | null => {
  const draft = getDraftById(id);
  if (!draft) return null;
  
  const updatedDraft: Draft = {
    ...draft,
    ...draftData,
    updatedAt: new Date(),
  };
  
  saveDraft(updatedDraft);
  return updatedDraft;
};
