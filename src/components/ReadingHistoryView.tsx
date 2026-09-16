import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { History, BookOpen, Calendar, Clock, RotateCcw, ArrowRight, Star, Bookmark } from 'lucide-react';

export const ReadingHistoryView: React.FC = () => {
  const { readingHistory, books, borrowBook, reserveBook, setActiveTab, setSelectedBookForDetail } = useLibrary();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = Array.from(new Set(readingHistory.map((h) => h.bookCategory)));

  const filteredHistory = filterCategory === 'all' 
    ? readingHistory 
    : readingHistory.filter((h) => h.bookCategory === filterCategory);

  const handleBorrowAgain = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    if (book.availability === 'Available') {
      borrowBook(book.id);
    } else {
      reserveBook(book.id);
    }
  };

  return (
    <div id="reading-history-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1">
            <History className="w-3.5 h-3.5" /> Academic Record
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900">
            Reading & Borrowing History
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            A comprehensive record of books you have borrowed and returned throughout your studies.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="history-cat-filter" className="text-xs font-semibold text-stone-600">Category:</label>
            <select
              id="history-cat-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:border-amber-600"
            >
              <option value="all">All Categories ({readingHistory.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {readingHistory.length === 0 ? (
        <div id="empty-history-card" className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <History className="w-8 h-8 text-amber-700" />
          </div>
          <h3 className="text-xl font-bold font-serif-classic text-stone-900">
            No completed reading history yet
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            When you borrow and return books from the library, they will automatically appear here with duration logs.
          </p>
          <button
            onClick={() => setActiveTab('books')}
            className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore Catalog
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
          {filteredHistory.map((item) => {
            const currentBook = books.find((b) => b.id === item.bookId);

            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className="p-5 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.bookCover}
                    alt={item.bookTitle}
                    className="w-14 h-20 object-cover rounded-lg shadow-sm border border-stone-200 shrink-0 cursor-pointer"
                    onClick={() => {
                      if (currentBook) setSelectedBookForDetail(currentBook);
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {item.bookCategory}
                    </span>
                    <h3 
                      onClick={() => {
                        if (currentBook) setSelectedBookForDetail(currentBook);
                      }}
                      className="font-bold text-base font-serif-classic text-stone-900 hover:text-amber-800 cursor-pointer truncate mt-0.5"
                    >
                      {item.bookTitle}
                    </h3>
                    <p className="text-xs text-stone-600 truncate">
                      By {item.bookAuthor}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" /> Borrowed: {new Date(item.borrowDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" /> Returned: {new Date(item.returnDate).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        Loan Duration: {item.durationDays} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Re-borrow Action */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {currentBook ? (
                    <button
                      id={`borrow-again-${item.id}`}
                      onClick={() => handleBorrowAgain(item.bookId)}
                      className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                      {currentBook.availability === 'Available' ? 'Borrow Again' : 'Reserve Title'}
                    </button>
                  ) : (
                    <span className="text-xs text-stone-400">Archived Edition</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
