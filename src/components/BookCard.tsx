import React from 'react';
import { Book } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { Star, MapPin, Heart, BookOpen, Bookmark, Check, Eye } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onOpenDetails?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onOpenDetails }) => {
  const { 
    setSelectedBookForDetail, 
    setSelectedBookForShelf, 
    borrowBook, 
    reserveBook, 
    toggleFavorite, 
    isFavorite,
    borrowings,
    reservations
  } = useLibrary();

  const isFav = isFavorite(book.id);
  const isBorrowedByUser = borrowings.some((b) => b.bookId === book.id);
  const isReservedByUser = reservations.some((r) => r.bookId === book.id);

  const availabilityColors = {
    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Borrowed: 'bg-amber-50 text-amber-700 border-amber-200',
    Reserved: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  }[book.availability];

  const handleDetails = () => {
    if (onOpenDetails) {
      onOpenDetails(book);
    } else {
      setSelectedBookForDetail(book);
    }
  };

  return (
    <div
      id={`book-card-${book.id}`}
      className="group bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/11] bg-stone-100 overflow-hidden cursor-pointer" onClick={handleDetails}>
        <img
          src={book.coverImage}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
          <span className="text-xs font-semibold text-white bg-stone-900/80 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
            <Eye className="w-3.5 h-3.5" /> Quick Preview
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          id={`fav-btn-${book.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(book.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
            isFav 
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105' 
              : 'bg-white/80 text-stone-600 hover:bg-white hover:text-rose-500'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Availability Badge */}
        <span 
          className={`absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${availabilityColors}`}
        >
          ● {book.availability}
        </span>

        {/* Category Pill */}
        <span className="absolute bottom-2 left-2.5 text-[10px] font-medium bg-stone-900/75 backdrop-blur-sm text-stone-200 px-2 py-0.5 rounded-md">
          {book.category}
        </span>

        {/* B.Tech / Programming Tag */}
        {book.isBTechTextbook && (
          <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
            🎓 B.Tech
          </span>
        )}
        {!book.isBTechTextbook && book.isProgramming && (
          <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
            💻 Code
          </span>
        )}
      </div>

      {/* Book Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating and Year */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{book.rating}</span>
              <span className="text-stone-400 font-normal">({book.reviewCount})</span>
            </div>
            <span className="font-mono text-[11px] text-stone-400">{book.publicationYear}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={handleDetails}
            className="font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors cursor-pointer text-base font-serif-classic"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
            By <span className="font-medium text-stone-800">{book.author}</span>
          </p>

          {/* B.Tech Branch & Semester Indicator if available */}
          {(book.branch || book.semester) && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded mt-1.5 border border-amber-200/60 truncate">
              <span>🎓 {book.branch || 'Engineering'}</span>
              {book.semester && <span>• {book.semester}</span>}
            </div>
          )}

          {/* Shelf location badge */}
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-stone-100">
            <button
              id={`shelf-btn-${book.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBookForShelf(book);
              }}
              className="text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
              title="Locate exact physical shelf"
            >
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Shelf: {book.shelfNumber}</span>
            </button>
            <span className="text-[11px] text-stone-400">
              Floor {book.shelfFloor}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {book.availability === 'Available' ? (
            <button
              id={`borrow-btn-${book.id}`}
              onClick={() => borrowBook(book.id)}
              disabled={isBorrowedByUser}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isBorrowedByUser
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200/50 hover:shadow'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {isBorrowedByUser ? 'Borrowed ✓' : 'Borrow'}
            </button>
          ) : (
            <button
              id={`reserve-btn-${book.id}`}
              onClick={() => reserveBook(book.id)}
              disabled={isBorrowedByUser || isReservedByUser}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                isReservedByUser
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700 hover:border-amber-400'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isReservedByUser ? 'Reserved ✓' : 'Reserve'}
            </button>
          )}

          <button
            id={`details-btn-${book.id}`}
            onClick={handleDetails}
            className="p-2 border border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-xl text-stone-600 text-xs font-medium transition-colors"
            title="View Full Book Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
