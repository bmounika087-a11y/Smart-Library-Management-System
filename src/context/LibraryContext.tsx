import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Book, 
  BorrowRecord, 
  Reservation, 
  ReadingHistoryItem, 
  NotificationItem, 
  UserProfile, 
  ToastMessage,
  BookAvailability 
} from '../types';
import { 
  INITIAL_BOOKS, 
  DEMO_STUDENT, 
  DEMO_LIBRARIAN, 
  INITIAL_BORROWINGS, 
  INITIAL_READING_HISTORY 
} from '../data/initialBooks';

export type NavigationTab = 
  | 'home' 
  | 'books' 
  | 'search' 
  | 'borrowings' 
  | 'recommendations' 
  | 'history' 
  | 'favorites' 
  | 'dashboard' 
  | 'admin' 
  | 'profile' 
  | 'about' 
  | 'contact';

export interface RecommendedBookItem {
  book: Book;
  reason: string;
  matchScore: number;
}

export interface SearchRecommendationsResult {
  btechTextbooks: Book[];
  programmingTextbooks: Book[];
  recommendedMatching: RecommendedBookItem[];
}

export interface LibraryContextType {
  books: Book[];
  currentUser: UserProfile | null;
  borrowings: BorrowRecord[];
  reservations: Reservation[];
  readingHistory: ReadingHistoryItem[];
  favorites: string[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  searchHistory: string[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedBookForDetail: Book | null;
  setSelectedBookForDetail: (book: Book | null) => void;
  selectedBookForShelf: Book | null;
  setSelectedBookForShelf: (book: Book | null) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Book operations
  borrowBook: (bookId: string) => boolean;
  returnBook: (borrowId: string) => void;
  renewBook: (borrowId: string) => void;
  reserveBook: (bookId: string) => void;
  cancelReservation: (reservationId: string) => void;
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  
  // Recommendations
  recommendations: RecommendedBookItem[];
  recordSearch: (query: string) => void;
  getSearchRecommendations: (query: string) => SearchRecommendationsResult;
  
  // Notifications
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  
  // Admin operations
  addBook: (bookData: Omit<Book, 'id' | 'borrowCount' | 'dateAdded'>) => void;
  editBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  updateBookAvailability: (bookId: string, status: BookAvailability) => void;
  
  // Auth
  loginAsDemoStudent: () => void;
  loginAsDemoLibrarian: () => void;
  customLogin: (email: string, studentId: string, role: 'student' | 'librarian') => void;
  logout: () => void;
  resetAllData: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Books state
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('slms_books');
    if (saved) {
      try {
        const parsed: Book[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((b) => b.id));
        const missingFromInitial = INITIAL_BOOKS.filter((b) => !existingIds.has(b.id));
        if (missingFromInitial.length > 0) {
          const merged = [...parsed, ...missingFromInitial];
          localStorage.setItem('slms_books', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BOOKS;
  });

  // Current user (defaults to Demo Student for immediate working demonstration)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('slms_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEMO_STUDENT;
  });

  // Borrowings
  const [borrowings, setBorrowings] = useState<BorrowRecord[]>(() => {
    const saved = localStorage.getItem('slms_borrowings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_BORROWINGS;
  });

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('slms_reservations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'res-01',
        bookId: 'book-06',
        bookTitle: 'Calculus: Early Transcendentals',
        bookAuthor: 'James Stewart',
        bookCover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=80',
        reservedDate: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
        queuePosition: 1,
        status: 'Waiting',
        userId: 'usr-student-01'
      }
    ];
  });

  // Reading history
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(() => {
    const saved = localStorage.getItem('slms_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_READING_HISTORY;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('slms_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['book-01', 'book-03', 'book-16', 'book-21'];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('slms_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'notif-01',
        title: 'Welcome to Smart Library',
        message: 'Explore over 20+ cataloged works, locate exact physical shelves, and borrow with 1-click.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        type: 'system',
        read: false
      },
      {
        id: 'notif-02',
        title: 'Due Date Reminder ⏳',
        message: 'Introduction to Algorithms (CLRS) is due in 2 days. You can renew it from My Borrowings.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        type: 'due',
        read: false
      },
      {
        id: 'notif-03',
        title: 'Reservation Confirmed',
        message: 'Your reservation for "Calculus: Early Transcendentals" is queue position #1.',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        type: 'reservation',
        read: true
      }
    ];
  });

  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('slms_search_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['Python', 'Algorithms', 'Physics'];
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [selectedBookForShelf, setSelectedBookForShelf] = useState<Book | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('slms_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('slms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('slms_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('slms_borrowings', JSON.stringify(borrowings));
  }, [borrowings]);

  useEffect(() => {
    localStorage.setItem('slms_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('slms_history', JSON.stringify(readingHistory));
  }, [readingHistory]);

  useEffect(() => {
    localStorage.setItem('slms_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('slms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('slms_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add notification helper
  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      timestamp: new Date().toISOString(),
      type,
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Borrow Book
  const borrowBook = (bookId: string): boolean => {
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      showToast('Book not found in library registry.', 'error');
      return false;
    }

    if (book.availability !== 'Available') {
      showToast('This book is currently unavailable. You can reserve it.', 'warning');
      return false;
    }

    // Update book status
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availability: 'Borrowed', borrowCount: b.borrowCount + 1 } : b))
    );

    // Calculate due date (14 days from now)
    const now = new Date();
    const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const newBorrow: BorrowRecord = {
      id: 'brw-' + Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCategory: book.category,
      bookCover: book.coverImage,
      borrowDate: now.toISOString(),
      dueDate: dueDate.toISOString(),
      renewCount: 0,
      status: 'active',
      userId: currentUser ? currentUser.id : 'guest-user'
    };

    setBorrowings((prev) => [newBorrow, ...prev]);

    // If it was in reservations, remove it
    setReservations((prev) => prev.filter((r) => r.bookId !== bookId));

    // Toast & Notif
    showToast(`Book borrowed successfully! 📚 Return by ${dueDate.toLocaleDateString()}`, 'success');
    addNotification(
      'Book Borrowed Successfully! 📚',
      `"${book.title}" has been issued to you. Due on ${dueDate.toLocaleDateString()}.`,
      'borrow'
    );

    // Fire confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#d97706', '#059669', '#3b82f6', '#881337']
      });
    } catch {
      // ignore
    }

    return true;
  };

  // Return Book
  const returnBook = (borrowId: string) => {
    const record = borrowings.find((b) => b.id === borrowId);
    if (!record) {
      showToast('Borrow record not found.', 'error');
      return;
    }

    // Remove from active borrowings
    setBorrowings((prev) => prev.filter((b) => b.id !== borrowId));

    // Calculate days borrowed
    const borrowTime = new Date(record.borrowDate).getTime();
    const returnTime = new Date().getTime();
    const days = Math.max(1, Math.round((returnTime - borrowTime) / (1000 * 60 * 60 * 24)));

    // Add to reading history
    const historyItem: ReadingHistoryItem = {
      id: 'hist-' + Date.now(),
      bookId: record.bookId,
      bookTitle: record.bookTitle,
      bookAuthor: record.bookAuthor,
      bookCategory: record.bookCategory,
      bookCover: record.bookCover,
      borrowDate: record.borrowDate,
      returnDate: new Date().toISOString(),
      durationDays: days
    };
    setReadingHistory((prev) => [historyItem, ...prev]);

    // Check if there are reservations waiting for this book
    const pendingRes = reservations.find((r) => r.bookId === record.bookId);

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === record.bookId) {
          return {
            ...b,
            availability: pendingRes ? 'Reserved' : 'Available'
          };
        }
        return b;
      })
    );

    showToast('Book returned successfully.', 'success');
    addNotification(
      'Book Returned Successfully',
      `"${record.bookTitle}" has been returned to the library. Thanks for keeping our collection accessible!`,
      'return'
    );
  };

  // Renew Book
  const renewBook = (borrowId: string) => {
    const record = borrowings.find((b) => b.id === borrowId);
    if (!record) return;

    if (record.renewCount >= 2) {
      showToast('Maximum renewals reached (2/2). Please return the book.', 'warning');
      return;
    }

    const currentDue = new Date(record.dueDate);
    const newDueDate = new Date(currentDue.getTime() + 7 * 24 * 60 * 60 * 1000);

    setBorrowings((prev) =>
      prev.map((b) =>
        b.id === borrowId
          ? {
              ...b,
              dueDate: newDueDate.toISOString(),
              renewCount: b.renewCount + 1
            }
          : b
      )
    );

    showToast(`Book renewed! New due date: ${newDueDate.toLocaleDateString()}`, 'success');
    addNotification(
      'Book Loan Extended',
      `"${record.bookTitle}" renewed until ${newDueDate.toLocaleDateString()} (Renewal ${record.renewCount + 1}/2).`,
      'system'
    );
  };

  // Reserve Book
  const reserveBook = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    // Check if user already reserved this
    const alreadyReserved = reservations.some((r) => r.bookId === bookId);
    if (alreadyReserved) {
      showToast('You already have an active reservation for this book.', 'info');
      return;
    }

    // Check if already borrowed by user
    const alreadyBorrowed = borrowings.some((b) => b.bookId === bookId);
    if (alreadyBorrowed) {
      showToast('You currently have this book borrowed!', 'warning');
      return;
    }

    const currentBookReservations = reservations.filter((r) => r.bookId === bookId);
    const position = currentBookReservations.length + 1;

    const newReservation: Reservation = {
      id: 'res-' + Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      reservedDate: new Date().toISOString(),
      queuePosition: position,
      status: 'Waiting',
      userId: currentUser ? currentUser.id : 'guest-user'
    };

    setReservations((prev) => [...prev, newReservation]);

    // Update book status if it was Available
    if (book.availability === 'Available') {
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, availability: 'Reserved' } : b))
      );
    }

    showToast(`Reservation confirmed. Queue position: #${position}`, 'success');
    addNotification(
      'Reservation Confirmed',
      `You reserved "${book.title}". You will be notified when it is ready.`,
      'reservation'
    );
  };

  // Cancel Reservation
  const cancelReservation = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    setReservations((prev) => prev.filter((r) => r.id !== reservationId));

    // If no other reservations and book was Reserved, check if someone has it borrowed
    const remainingRes = reservations.filter((r) => r.bookId === res.bookId && r.id !== reservationId);
    const isBorrowed = borrowings.some((b) => b.bookId === res.bookId);

    if (remainingRes.length === 0 && !isBorrowed) {
      setBooks((prev) =>
        prev.map((b) => (b.id === res.bookId ? { ...b, availability: 'Available' } : b))
      );
    }

    showToast('Reservation cancelled.', 'info');
  };

  // Favorites
  const toggleFavorite = (bookId: string) => {
    const exists = favorites.includes(bookId);
    const book = books.find((b) => b.id === bookId);

    if (exists) {
      setFavorites((prev) => prev.filter((id) => id !== bookId));
      showToast(`Removed from favorites`, 'info');
    } else {
      setFavorites((prev) => [...prev, bookId]);
      showToast(`Book added to your favorites ❤️`, 'success');
      if (book) {
        addNotification(
          'Added to Favorites',
          `"${book.title}" was saved to your favorite books list.`,
          'system'
        );
      }
    }
  };

  const isFavorite = (bookId: string) => favorites.includes(bookId);

  // Search recording for smart recommendation algorithm
  const recordSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Real smart recommendation algorithm based on user's active history, favorites, and searches
  const recommendations = useMemo(() => {
    const borrowedCategories = new Set(borrowings.map((b) => b.bookCategory));
    const historyCategories = new Set(readingHistory.map((h) => h.bookCategory));
    
    // Favorite categories
    const favoriteCategories = new Set(
      books.filter((b) => favorites.includes(b.id)).map((b) => b.category)
    );

    // Current active borrowed IDs to avoid recommending already borrowed
    const borrowedBookIds = new Set(borrowings.map((b) => b.bookId));

    const scored: RecommendedBookItem[] = [];

    books.forEach((book) => {
      if (borrowedBookIds.has(book.id)) return;

      let score = 0;
      let reason = '';

      // Match search history keywords
      for (const search of searchHistory) {
        const term = search.toLowerCase();
        if (
          book.title.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term)
        ) {
          score += 25;
          reason = `Matches your recent search for "${search}"`;
          break;
        }
      }

      // Match borrowed categories
      if (borrowedCategories.has(book.category)) {
        score += 20;
        if (!reason) {
          reason = `Based on your active reading in ${book.category}`;
        }
      }

      // Match favorite categories
      if (favoriteCategories.has(book.category)) {
        score += 15;
        if (!reason) {
          reason = `Similar to your favorited ${book.category} books`;
        }
      }

      // Match past completed readings
      if (historyCategories.has(book.category)) {
        score += 10;
        if (!reason) {
          reason = `Recommended from your completed reading history in ${book.category}`;
        }
      }

      // High rating & popularity booster
      if (book.rating >= 4.8) {
        score += 8;
        if (!reason) {
          reason = `Top rated by campus scholars (${book.rating}★)`;
        }
      }

      if (book.borrowCount > 90) {
        score += 5;
        if (!reason) {
          reason = `Highly sought after in the library`;
        }
      }

      if (score > 0) {
        scored.push({
          book,
          reason: reason || 'Recommended for your academic profile',
          matchScore: score
        });
      }
    });

    // Sort by match score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);

    // If fewer than 6, backfill with top-rated available books
    if (scored.length < 6) {
      const existingIds = new Set(scored.map((s) => s.book.id));
      const popular = [...books]
        .filter((b) => !borrowedBookIds.has(b.id) && !existingIds.has(b.id))
        .sort((a, b) => b.rating - a.rating || b.borrowCount - a.borrowCount)
        .slice(0, 6 - scored.length);

      popular.forEach((b) => {
        scored.push({
          book: b,
          reason: `Popular choice among library readers (${b.rating}★)`,
          matchScore: 10
        });
      });
    }

    return scored;
  }, [books, borrowings, readingHistory, favorites, searchHistory]);

  // Admin CRUD operations
  const addBook = (bookData: Omit<Book, 'id' | 'borrowCount' | 'dateAdded'>) => {
    const newBook: Book = {
      ...bookData,
      id: 'book-custom-' + Date.now(),
      borrowCount: 0,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setBooks((prev) => [newBook, ...prev]);
    showToast(`"${newBook.title}" added to catalog! 📚`, 'success');
    addNotification(
      'New Book Added to Catalog',
      `"${newBook.title}" by ${newBook.author} is now accessible on shelf ${newBook.shelfNumber}.`,
      'system'
    );
  };

  const editBook = (updatedBook: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    showToast(`Book "${updatedBook.title}" updated successfully.`, 'success');
  };

  const deleteBook = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setBorrowings((prev) => prev.filter((b) => b.bookId !== bookId));
    setReservations((prev) => prev.filter((r) => r.bookId !== bookId));
    setFavorites((prev) => prev.filter((id) => id !== bookId));
    showToast(`Book "${book ? book.title : bookId}" deleted.`, 'info');
  };

  const updateBookAvailability = (bookId: string, status: BookAvailability) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availability: status } : b))
    );
    showToast(`Book availability changed to ${status}.`, 'info');
  };

  // Auth
  const loginAsDemoStudent = () => {
    setCurrentUser(DEMO_STUDENT);
    showToast(`Logged in as Alex Rivera (Student)`, 'success');
  };

  const loginAsDemoLibrarian = () => {
    setCurrentUser(DEMO_LIBRARIAN);
    showToast(`Logged in as Dr. Eleanor Vance (Chief Librarian)`, 'success');
  };

  const customLogin = (email: string, studentId: string, role: 'student' | 'librarian') => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      studentId: studentId || 'STU-2026-9900',
      email,
      department: role === 'librarian' ? 'Central Library Administration' : 'School of Computing & Science',
      role,
      avatarUrl: role === 'librarian' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setCurrentUser(newUser);
    showToast(`Welcome, ${newUser.name}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const resetAllData = () => {
    localStorage.clear();
    setBooks(INITIAL_BOOKS);
    setCurrentUser(DEMO_STUDENT);
    setBorrowings(INITIAL_BORROWINGS);
    setReadingHistory(INITIAL_READING_HISTORY);
    setFavorites(['book-01', 'book-03', 'book-16', 'book-21']);
    setReservations([]);
    setNotifications([
      {
        id: 'notif-reset',
        title: 'Library Reset to Defaults',
        message: 'All sample data, borrowings, and catalog entries have been refreshed.',
        timestamp: new Date().toISOString(),
        type: 'system',
        read: false
      }
    ]);
    showToast('Database reset to initial sample state.', 'info');
  };

  const getSearchRecommendations = (query: string): SearchRecommendationsResult => {
    const q = query.toLowerCase().trim();
    const isBtechQuery = 
      q.includes('btech') || 
      q.includes('b.tech') || 
      q.includes('btch') || 
      q.includes('eng') || 
      q.includes('cse') || 
      q.includes('ece') || 
      q.includes('eee') ||
      q.includes('semester') || 
      q.includes('sem') ||
      q.includes('syllabus') || 
      q.includes('gate') || 
      q.includes('grewal') || 
      q.includes('mano') || 
      q.includes('korth') || 
      q.includes('silberschatz') ||
      q.includes('tanenbaum') ||
      q.includes('textbook') ||
      q.includes('text book');

    const isProgQuery = 
      q.includes('prog') || 
      q.includes('proram') ||
      q.includes('code') || 
      q.includes('coding') ||
      q.includes('python') || 
      q.includes('java') || 
      q.includes('c++') || 
      q.includes('dsa') || 
      q.includes('algo') || 
      q.includes('javascript') || 
      q.includes('web') || 
      q.includes('sql') ||
      q.includes('compiler') ||
      q.includes('operating');

    // B.Tech textbooks
    const btechTextbooks = books.filter((b) => {
      if (!b.isBTechTextbook) return false;
      if (!q || isBtechQuery) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.branch && b.branch.toLowerCase().includes(q)) ||
        (b.semester && b.semester.toLowerCase().includes(q)) ||
        (b.curriculumTags && b.curriculumTags.some((t) => t.toLowerCase().includes(q)))
      );
    });

    // Programming textbooks
    const programmingTextbooks = books.filter((b) => {
      if (!b.isProgramming && b.category !== 'Programming' && b.category !== 'Data Structures') return false;
      if (!q || isProgQuery) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.curriculumTags && b.curriculumTags.some((t) => t.toLowerCase().includes(q)))
      );
    });

    // Recommendations matching query
    const recommendedMatching = recommendations.filter((r) => {
      if (!q) return true;
      return (
        r.book.title.toLowerCase().includes(q) ||
        r.book.author.toLowerCase().includes(q) ||
        r.book.category.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        (r.book.isBTechTextbook && isBtechQuery) ||
        (r.book.isProgramming && isProgQuery)
      );
    });

    return {
      btechTextbooks,
      programmingTextbooks,
      recommendedMatching
    };
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        currentUser,
        borrowings,
        reservations,
        readingHistory,
        favorites,
        notifications,
        unreadNotificationCount,
        searchHistory,
        activeTab,
        setActiveTab,
        selectedBookForDetail,
        setSelectedBookForDetail,
        selectedBookForShelf,
        setSelectedBookForShelf,
        toasts,
        showToast,
        removeToast,
        borrowBook,
        returnBook,
        renewBook,
        reserveBook,
        cancelReservation,
        toggleFavorite,
        isFavorite,
        recommendations,
        recordSearch,
        getSearchRecommendations,
        markAllNotificationsRead,
        clearNotification,
        addBook,
        editBook,
        deleteBook,
        updateBookAvailability,
        loginAsDemoStudent,
        loginAsDemoLibrarian,
        customLogin,
        logout,
        resetAllData
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
