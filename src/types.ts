export type Category = 'หออินเตอร์' | 'หอใน' | 'คณะ' | 'คอมมูนิตี้';

export interface Post {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  contactLink: string;
  category: Category;
  boardId: string;
  position: {
    x: number;
    y: number;
  };
  createdAt: Date;
}

export interface Board {
  id: string;
  name: string;
  category: Category;
  description?: string;
  posts: Post[];
}