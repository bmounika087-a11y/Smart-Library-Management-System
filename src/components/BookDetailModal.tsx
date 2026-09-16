import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  X, 
  Star, 
  MapPin, 
  BookOpen, 
  Calendar, 
  Hash, 
  Building2, 
  Layers, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Heart,
  Share2,
  Sparkles
} from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const { 
    selectedBookForDetail, 
    setSelectedBookForDetail, 
    setSelectedBookForShelf,
    borrowBook, 
    reserveBook,
    toggleFavorite,
    isFavorite,
    borrowings,
    reservations,
    showToast
  } = useLibrary();

  if (!selectedBookForDetail) return null;

  const book = selectedBookForDetail;
  const isFav = isFavorite(book.id);
  const isBorrowedByUser = borrowings.some((b) => b.bookId === book.id);
  const isReservedByUser = reservations.some((r) => r.bookId === book.id);

  const handleBorrow = () => {
    if (isBorrowedByUser) {
      showToast('You already have this book borrowed!', 'warning');
      return;
    }
    const success = borrowBook(book.id);
    if (success) {
      // Keep modal open or close
    }
  };

  const handleReserve = () => {
    reserveBook(book.id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Book citation and link copied to clipboard!', 'info');
  };

  const availabilityBadge = {
    Available: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Borrowed: 'bg-amber-100 text-amber-800 border-amber-300',
    Reserved: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  }[book.availability];

  return (
    <div 
      id="book-detail-backdrop"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={() => setSelectedBookForDetail(null)}
    >
      <div 
        id="book-detail-modal"
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-2xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${availabilityBadge}`}>
              ● {book.availability}
            </span>
            <span className="text-xs font-medium text-stone-500">
              {book.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="detail-favorite-btn"
              onClick={() => toggleFavorite(book.id)}
              className={`p-2 rounded-xl transition-all ${
                isFav 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              id="detail-share-btn"
              onClick={handleShare}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
              title="Copy citation link"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              id="close-book-detail"
              onClick={() => setSelectedBookForDetail(null)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Book Cover */}
            <div className="w-full sm:w-48 shrink-0 flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-stone-200 aspect-[2/3] w-44 bg-stone-100 group">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent"></div>
                <span className="absolute bottom-2 left-2 right-2 text-center text-[11px] font-medium text-white/90 bg-stone-900/60 backdrop-blur-sm py-1 rounded">
                  Floor {book.shelfFloor} • Shelf {book.shelfNumber}
                </span>
              </div>

              {/* Shelf Locator Quick Trigger */}
              <button
                id="modal-find-shelf-btn"
                onClick={() => {
                  setSelectedBookForShelf(book);
                }}
                className="mt-3 w-44 py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 rounded-xl text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                Find on Shelf: {book.shelfNumber}
              </button>
            </div>

            {/* Book Meta & Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold font-serif-classic text-stone-900 leading-tight">
                  {book.title}
                </h2>
                <p className="text-stone-600 font-medium text-sm mt-1">
                  By <span className="text-amber-900 font-semibold">{book.author}</span>
                </p>
              </div>

              {/* Rating & Popularity */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-stone-900">{book.rating}</span>
                </div>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 text-xs">{book.reviewCount} academic reviews</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600 text-xs font-medium bg-stone-100 px-2 py-0.5 rounded">
                  {book.borrowCount} total borrows
                </span>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <div>
                  <span className="text-stone-500 block">Category:</span>
                  <span className="font-semibold text-stone-800">{book.category}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Published:</span>
                  <span className="font-semibold text-stone-800">{book.publicationYear}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">ISBN:</span>
                  <span className="font-mono font-semibold text-stone-800 text-[11px]">{book.isbn}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Publisher:</span>
                  <span className="font-semibold text-stone-800 truncate block">{book.publisher}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Pages:</span>
                  <span className="font-semibold text-stone-800">{book.pageCount} pages</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Physical Location:</span>
                  <span className="font-semibold text-amber-800">Shelf {book.shelfNumber}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Synopsis & Subject Overview
                </h4>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {book.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Decision Area */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-600">
              {book.availability === 'Available' ? (
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Available in library stock • Standard 14-day student loan
                </div>
              ) : book.availability === 'Borrowed' ? (
                <div className="flex items-center gap-2 text-amber-800 font-medium">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Currently borrowed by another student. You can reserve this title.
                </div>
              ) : (
                <div className="flex items-center gap-2 text-indigo-800 font-medium">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Reserved for hold collection. You can join the reserve queue.
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Borrow Button */}
              <button
                id="modal-borrow-btn"
                onClick={handleBorrow}
                disabled={book.availability !== 'Available' || isBorrowedByUser}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                  isBorrowedByUser
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : book.availability === 'Available'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200/50 hover:shadow-md'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {isBorrowedByUser ? 'Already Borrowed' : 'Borrow Book'}
              </button>

              {/* Reserve Button */}
              <button
                id="modal-reserve-btn"
                onClick={handleReserve}
                disabled={isBorrowedByUser || isReservedByUser}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                  isReservedByUser
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 cursor-not-allowed'
                    : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700 hover:border-stone-400'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {isReservedByUser ? 'Reserved ✓' : 'Reserve'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
