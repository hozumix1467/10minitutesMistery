export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  favoriteGenre: string;
  bio?: string;
  favoriteAuthor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileFormData {
  displayName: string;
  favoriteGenre: string;
  bio?: string;
  favoriteAuthor?: string;
}

export const GENRES = [
  '推理小説',
  'サスペンス',
  'スリラー',
  '密室殺人',
  '心理ミステリー',
  '日常の謎',
  '警察小説',
  'ハードボイルド',
  'コージー・ミステリー',
  '歴史ミステリー',
  'SFミステリー',
  'その他'
] as const;

export type Genre = typeof GENRES[number];
