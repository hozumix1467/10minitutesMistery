import { Novel } from '../types/Novel';

const STORAGE_KEY = 'mystery-novels';

export const saveNovels = (novels: Novel[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(novels));
};

export const loadNovels = (): Novel[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const novels = JSON.parse(stored);
    return novels.map((novel: any) => ({
      ...novel,
      createdAt: new Date(novel.createdAt),
      updatedAt: new Date(novel.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading novels:', error);
    return [];
  }
};

export const saveNovel = (novel: Novel): void => {
  const novels = loadNovels();
  const existingIndex = novels.findIndex(n => n.id === novel.id);
  
  if (existingIndex >= 0) {
    novels[existingIndex] = novel;
  } else {
    novels.push(novel);
  }
  
  saveNovels(novels);
};

export const deleteNovel = (id: string): void => {
  const novels = loadNovels().filter(novel => novel.id !== id);
  saveNovels(novels);
};