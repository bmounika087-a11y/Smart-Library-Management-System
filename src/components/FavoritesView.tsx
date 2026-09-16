import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from './BookCard';
import { Heart, BookOpen, ArrowRight, Trash2 } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, books, setActiveTab, toggleFavorite } = useLibrary();

  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  return (
    <div id="favorites-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" /> Personal Bookmarks
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900">
            My Favorite Books
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Titles you have bookmarked for research, upcoming semesters, or leisure reading.
          </p>
        </div>

        {favoriteBooks.length > 0 && (
          <span className="text-xs font-bold text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-xs">
            {favoriteBooks.length} {favoriteBooks.length === 1 ? 'Book' : 'Books'} Saved
          </span>
        )}
      </div>

      {favoriteBooks.length === 0 ? (
        <div id="empty-favorites-card" className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif-classic text-stone-900">
            No favorite books yet
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Click the heart icon on any book card in the catalog to save titles directly to this list for quick access.
          </p>
          <button
            onClick={() => setActiveTab('books')}
            className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
