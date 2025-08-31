export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface Novel {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  characterCount: number;
  createdAt: Date;
  updatedAt: Date;
  pendingSync?: boolean; // データベース同期状態
  userId?: string; // ユーザーID（認証システムとの連携用）
  likes?: string[]; // いいねしたユーザーIDの配列
  comments?: Comment[]; // コメントの配列
}

export interface NovelFormData {
  title: string;
  content: string;
  author: string;
  tags: string[];
}