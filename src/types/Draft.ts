export interface Draft {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DraftFormData {
  title: string;
  content: string;
  author: string;
  tags: string[];
}
