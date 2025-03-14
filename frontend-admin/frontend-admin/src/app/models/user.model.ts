export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  roles: string[];
  avatar?: string;
  favoriteCategories?: string[];
  searchHistory?: string[];
  bookmarkedBooks?: string[];
  readingHistory?: ReadingHistory[];
  createdAt?: Date;
}

export interface ReadingHistory {
  bookId: string;
  progress: number;
  timeSpent: number;
  lastReadAt: Date;
} 