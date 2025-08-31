import { Novel, NovelFormData } from '../types/Novel';

// API設定
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// APIクライアントクラス
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 共通のHTTPリクエスト処理
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 作品一覧を取得
  async getNovels(): Promise<Novel[]> {
    return this.request<Novel[]>('/novels');
  }

  // 作品を取得（ID指定）
  async getNovel(id: string): Promise<Novel> {
    return this.request<Novel>(`/novels/${id}`);
  }

  // 作品を作成
  async createNovel(novelData: NovelFormData): Promise<Novel> {
    return this.request<Novel>('/novels', {
      method: 'POST',
      body: JSON.stringify(novelData),
    });
  }

  // 作品を更新
  async updateNovel(id: string, novelData: Partial<NovelFormData>): Promise<Novel> {
    return this.request<Novel>(`/novels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(novelData),
    });
  }

  // 作品を削除
  async deleteNovel(id: string): Promise<void> {
    return this.request<void>(`/novels/${id}`, {
      method: 'DELETE',
    });
  }

  // ユーザーの作品を取得
  async getUserNovels(userId: string): Promise<Novel[]> {
    return this.request<Novel[]>(`/users/${userId}/novels`);
  }

  // 作品を検索
  async searchNovels(query: string, filters?: {
    tags?: string[];
    author?: string;
    minCharacters?: number;
    maxCharacters?: number;
  }): Promise<Novel[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters?.tags) {
      filters.tags.forEach(tag => params.append('tags', tag));
    }
    if (filters?.author) {
      params.append('author', filters.author);
    }
    if (filters?.minCharacters) {
      params.append('minCharacters', filters.minCharacters.toString());
    }
    if (filters?.maxCharacters) {
      params.append('maxCharacters', filters.maxCharacters.toString());
    }

    return this.request<Novel[]>(`/novels/search?${params.toString()}`);
  }

  // 人気の作品を取得
  async getPopularNovels(limit: number = 10): Promise<Novel[]> {
    return this.request<Novel[]>(`/novels/popular?limit=${limit}`);
  }

  // 最新の作品を取得
  async getRecentNovels(limit: number = 10): Promise<Novel[]> {
    return this.request<Novel[]>(`/novels/recent?limit=${limit}`);
  }
}

// APIクライアントのインスタンスを作成
export const apiClient = new ApiClient(API_BASE_URL);

// エラーハンドリング用のユーティリティ
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// オフライン対応のためのフォールバック
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// ローカルストレージとの同期
export const syncWithLocalStorage = async (): Promise<void> => {
  if (!isOnline()) return;

  try {
    const localNovels = JSON.parse(localStorage.getItem('mystery-novels') || '[]');
    const pendingNovels = localNovels.filter((novel: any) => novel.pendingSync);

    for (const novel of pendingNovels) {
      try {
        if (novel.id.startsWith('local-')) {
          // 新規作成
          const createdNovel = await apiClient.createNovel({
            title: novel.title,
            content: novel.content,
            author: novel.author,
            tags: novel.tags,
            synopsis: novel.synopsis,
          });
          
          // ローカルIDをサーバーIDに置き換え
          const updatedNovels = localNovels.map((n: any) => 
            n.id === novel.id ? { ...createdNovel, pendingSync: false } : n
          );
          localStorage.setItem('mystery-novels', JSON.stringify(updatedNovels));
        } else {
          // 更新
          await apiClient.updateNovel(novel.id, {
            title: novel.title,
            content: novel.content,
            author: novel.author,
            tags: novel.tags,
            synopsis: novel.synopsis,
          });
          
          // 同期完了フラグを更新
          const updatedNovels = localNovels.map((n: any) => 
            n.id === novel.id ? { ...n, pendingSync: false } : n
          );
          localStorage.setItem('mystery-novels', JSON.stringify(updatedNovels));
        }
      } catch (error) {
        console.error('Failed to sync novel:', novel.id, error);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
};

