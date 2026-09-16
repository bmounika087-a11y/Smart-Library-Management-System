export type BookAvailability = 'Available' | 'Borrowed' | 'Reserved';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  isbn: string;
  publicationYear: number;
  rating: number;
  reviewCount: number;
  availability: BookAvailability;
  shelfNumber: string;
  shelfFloor: number;
  shelfSection: string;
  coverImage: string;
  borrowCount: number;
  pageCount: number;
  language: string;
  publisher: string;
  dateAdded: string;
  featured?: boolean;
  isBTechTextbook?: boolean;
  isProgramming?: boolean;
  branch?: string;
  semester?: string;
  curriculumTags?: string[];
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  bookCover: string;
  borrowDate: string; // ISO string
  dueDate: string;    // ISO string
  returnDate?: string;
  renewCount: number;
  status: 'active' | 'returned' | 'overdue';
  userId: string;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  reservedDate: string;
  queuePosition: number;
  status: 'Waiting' | 'Ready for Pickup' | 'Cancelled';
  userId: string;
}

export interface ReadingHistoryItem {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  bookCover: string;
  borrowDate: string;
  returnDate: string;
  durationDays: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'borrow' | 'return' | 'reservation' | 'due' | 'system';
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  studentId: string;
  email: string;
  department: string;
  role: 'student' | 'librarian';
  avatarUrl: string;
  joinDate: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  author: string;
  availability: string; // 'all' | 'Available' | 'Borrowed' | 'Reserved'
  minRating: number;
  yearRange: [number, number];
  sortBy: 'title' | 'rating' | 'year' | 'popularity' | 'newest';
}
