import { Novel, NovelFormData } from '../types/Novel';
import { apiClient, isOnline, syncWithLocalStorage } from './api';

const STORAGE_KEY = 'mystery-novels';

// データ管理クラス
class DataManager {
  // 作品一覧を取得（オンライン時はAPI、オフライン時はローカルストレージ）
  async getNovels(): Promise<Novel[]> {
    try {
      if (isOnline()) {
        // オンライン時：APIから取得
        const novels = await apiClient.getNovels();
        
        // ローカルストレージにキャッシュ
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novels));
        return novels;
      } else {
        // オフライン時：ローカルストレージから取得
        return this.getFromLocalStorage();
      }
    } catch (error) {
      console.warn('API取得に失敗、ローカルストレージから取得:', error);
      return this.getFromLocalStorage();
    }
  }

  // 作品を作成
  async createNovel(novelData: NovelFormData): Promise<Novel> {
    const novel: Novel = {
      id: this.generateId(),
      ...novelData,
      createdAt: new Date(),
      updatedAt: new Date(),
      characterCount: novelData.content.length,
      pendingSync: !isOnline(), // オフライン時は同期待ちフラグ
    };

    try {
      if (isOnline()) {
        // オンライン時：APIに送信
        const createdNovel = await apiClient.createNovel(novelData);
        novel.id = createdNovel.id;
        novel.pendingSync = false;
      }
    } catch (error) {
      console.warn('API作成に失敗、ローカルストレージに保存:', error);
      novel.pendingSync = true;
    }

    // ローカルストレージに保存
    this.saveToLocalStorage(novel);
    return novel;
  }

  // 作品を更新
  async updateNovel(id: string, novelData: Partial<NovelFormData>): Promise<Novel> {
    const novels = this.getFromLocalStorage();
    const novelIndex = novels.findIndex(n => n.id === id);
    
    if (novelIndex === -1) {
      throw new Error('作品が見つかりません');
    }

    const updatedNovel: Novel = {
      ...novels[novelIndex],
      ...novelData,
      updatedAt: new Date(),
      characterCount: novelData.content ? novelData.content.length : novels[novelIndex].characterCount,
      pendingSync: !isOnline(),
    };

    try {
      if (isOnline()) {
        // オンライン時：APIに送信
        await apiClient.updateNovel(id, novelData);
        updatedNovel.pendingSync = false;
      }
    } catch (error) {
      console.warn('API更新に失敗、ローカルストレージに保存:', error);
      updatedNovel.pendingSync = true;
    }

    // ローカルストレージを更新
    novels[novelIndex] = updatedNovel;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novels));
    
    return updatedNovel;
  }

  // 作品を削除
  async deleteNovel(id: string): Promise<void> {
    try {
      if (isOnline()) {
        // オンライン時：APIに送信
        await apiClient.deleteNovel(id);
      }
    } catch (error) {
      console.warn('API削除に失敗、ローカルストレージから削除:', error);
    }

    // ローカルストレージから削除
    const novels = this.getFromLocalStorage();
    const filteredNovels = novels.filter(novel => novel.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNovels));
  }

  // 作品を検索
  async searchNovels(query: string, filters?: {
    tags?: string[];
    author?: string;
    minCharacters?: number;
    maxCharacters?: number;
  }): Promise<Novel[]> {
    try {
      if (isOnline()) {
        // オンライン時：APIで検索
        return await apiClient.searchNovels(query, filters);
      }
    } catch (error) {
      console.warn('API検索に失敗、ローカル検索を実行:', error);
    }

    // オフライン時またはAPI失敗時：ローカル検索
    return this.searchLocalNovels(query, filters);
  }

  // ユーザーの作品を取得
  async getUserNovels(userId: string): Promise<Novel[]> {
    try {
      if (isOnline()) {
        // オンライン時：APIから取得
        return await apiClient.getUserNovels(userId);
      }
    } catch (error) {
      console.warn('API取得に失敗、ローカルストレージから取得:', error);
    }

    // オフライン時またはAPI失敗時：ローカル検索
    const novels = this.getFromLocalStorage();
    return novels.filter(novel => novel.author === userId);
  }

  // 人気の作品を取得
  async getPopularNovels(limit: number = 10): Promise<Novel[]> {
    try {
      if (isOnline()) {
        // オンライン時：APIから取得
        return await apiClient.getPopularNovels(limit);
      }
    } catch (error) {
      console.warn('API取得に失敗、ローカルストレージから取得:', error);
    }

    // オフライン時またはAPI失敗時：ローカル検索（文字数順）
    const novels = this.getFromLocalStorage();
    return novels
      .sort((a, b) => b.characterCount - a.characterCount)
      .slice(0, limit);
  }

  // 最新の作品を取得
  async getRecentNovels(limit: number = 10): Promise<Novel[]> {
    try {
      if (isOnline()) {
        // オンライン時：APIから取得
        return await apiClient.getRecentNovels(limit);
      }
    } catch (error) {
      console.warn('API取得に失敗、ローカルストレージから取得:', error);
    }

    // オフライン時またはAPI失敗時：ローカル検索（日付順）
    const novels = this.getFromLocalStorage();
    return novels
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // データを同期
  async syncData(): Promise<void> {
    if (isOnline()) {
      await syncWithLocalStorage();
    }
  }

  // ローカルストレージから取得
  private getFromLocalStorage(): Novel[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const novels = JSON.parse(stored);
      return novels.map((novel: any) => ({
        ...novel,
        createdAt: new Date(novel.createdAt),
        updatedAt: new Date(novel.updatedAt),
        userId: novel.userId || 'anonymous', // 既存データの互換性を確保
        likes: novel.likes || [], // いいね機能の互換性を確保
        comments: novel.comments ? novel.comments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        })) : [], // コメント機能の互換性を確保
      }));
    } catch (error) {
      console.error('ローカルストレージの読み込みに失敗:', error);
      return [];
    }
  }

  // ローカルストレージに保存
  private saveToLocalStorage(novel: Novel): void {
    const novels = this.getFromLocalStorage();
    const existingIndex = novels.findIndex(n => n.id === novel.id);
    
    if (existingIndex >= 0) {
      novels[existingIndex] = novel;
    } else {
      novels.push(novel);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novels));
  }

  // ローカル検索
  private searchLocalNovels(query: string, filters?: {
    tags?: string[];
    author?: string;
    minCharacters?: number;
    maxCharacters?: number;
  }): Novel[] {
    const novels = this.getFromLocalStorage();
    
    return novels.filter(novel => {
      // クエリ検索
      const matchesQuery = !query || 
        novel.title.toLowerCase().includes(query.toLowerCase()) ||
        novel.content.toLowerCase().includes(query.toLowerCase()) ||
        novel.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

      if (!matchesQuery) return false;

      // タグフィルター
      if (filters?.tags && filters.tags.length > 0) {
        const hasMatchingTags = filters.tags.some(tag => 
          novel.tags.includes(tag)
        );
        if (!hasMatchingTags) return false;
      }

      // 作者フィルター
      if (filters?.author && novel.author !== filters.author) {
        return false;
      }

      // 文字数フィルター
      if (filters?.minCharacters && novel.characterCount < filters.minCharacters) {
        return false;
      }
      if (filters?.maxCharacters && novel.characterCount > filters.maxCharacters) {
        return false;
      }

      return true;
    });
  }

  // ID生成
  private generateId(): string {
    return `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// データマネージャーのインスタンスを作成
export const dataManager = new DataManager();

// 従来のlocalStorage関数との互換性を保つ
export const loadNovels = (): Novel[] => {
  return dataManager.getFromLocalStorage();
};

export const saveNovel = (novel: Novel): void => {
  dataManager.saveToLocalStorage(novel);
};

export const deleteNovel = (id: string): void => {
  const novels = dataManager.getFromLocalStorage();
  const filteredNovels = novels.filter(novel => novel.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNovels));
};

