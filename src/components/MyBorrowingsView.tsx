import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  Clock, 
  RotateCcw, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Bookmark, 
  X, 
  MapPin, 
  ArrowRight,
  Sparkles,
  History
} from 'lucide-react';

export const MyBorrowingsView: React.FC = () => {
  const { 
    borrowings, 
    reservations, 
    returnBook, 
    renewBook, 
    cancelReservation, 
    setActiveTab, 
    setSelectedBookForShelf,
    books
  } = useLibrary();

  const [activeTabSub, setActiveTabSub] = useState<'loans' | 'reservations'>('loans');
  const [returnConfirmId, setReturnConfirmId] = useState<string | null>(null);

  // Helper for calculating remaining days and status
  const getDueStatus = (dueDateStr: string) => {
    const now = new Date().getTime();
    const due = new Date(dueDateStr).getTime();
    const diffMs = due - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'overdue',
        daysText: `${Math.abs(diffDays)} days overdue`,
        badgeClass: 'bg-red-100 text-red-800 border-red-300',
        label: 'Overdue Alert ⚠️'
      };
    } else if (diffDays <= 3) {
      return {
        status: 'due-soon',
        daysText: diffDays === 0 ? 'Due Today!' : diffDays === 1 ? 'Due Tomorrow' : `Due in ${diffDays} days`,
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        label: 'Due Soon ⏳'
      };
    } else {
      return {
        status: 'due-later',
        daysText: `Due in ${diffDays} days`,
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        label: 'On Schedule ✓'
      };
    }
  };

  const handleReturnConfirm = (id: string) => {
    returnBook(id);
    setReturnConfirmId(null);
  };

  return (
    <div id="my-borrowings-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1">
            <Clock className="w-3.5 h-3.5" /> Student Loan Circulation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900">
            My Borrowings & Reservations
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Track active loans, due-date countdowns, renew titles, and manage reservation holds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="borrowings-tab-loans"
            onClick={() => setActiveTabSub('loans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabSub === 'loans'
                ? 'bg-amber-900 text-white shadow'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Active Loans ({borrowings.length})
          </button>
          <button
            id="borrowings-tab-reservations"
            onClick={() => setActiveTabSub('reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabSub === 'reservations'
                ? 'bg-amber-900 text-white shadow'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Reservations ({reservations.length})
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: ACTIVE LOANS */}
      {activeTabSub === 'loans' && (
        <div className="space-y-6">
          {borrowings.length === 0 ? (
            <div id="empty-borrowings-card" className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold font-serif-classic text-stone-900">
                You have no active book loans
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Explore our catalog to borrow textbooks, scientific treatises, literature, or programming manuals with 1-click.
              </p>
              <button
                id="borrow-more-btn"
                onClick={() => setActiveTab('books')}
                className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-md transition-all inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Browse Available Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {borrowings.map((borrow) => {
                const dueInfo = getDueStatus(borrow.dueDate);
                const bookData = books.find((b) => b.id === borrow.bookId);

                return (
                  <div
                    key={borrow.id}
                    id={`borrow-card-${borrow.id}`}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={borrow.bookCover}
                        alt={borrow.bookTitle}
                        className="w-20 h-28 object-cover rounded-xl shadow-sm border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                            {borrow.bookCategory}
                          </span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${dueInfo.badgeClass}`}>
                            {dueInfo.label}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold font-serif-classic text-stone-900 line-clamp-2">
                          {borrow.bookTitle}
                        </h3>
                        <p className="text-xs text-stone-600 truncate mt-0.5">
                          By {borrow.bookAuthor}
                        </p>

                        {/* Shelf locator quick tag */}
                        {bookData && (
                          <button
                            onClick={() => setSelectedBookForShelf(bookData)}
                            className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 transition-colors"
                          >
                            <MapPin className="w-3 h-3 text-amber-600" />
                            Shelf: {bookData.shelfNumber} (Floor {bookData.shelfFloor})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timeline & Due Date Info */}
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-stone-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" /> Borrowed on:
                        </span>
                        <span className="font-semibold text-stone-800">
                          {new Date(borrow.borrowDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-stone-600">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" /> Due Date:
                        </span>
                        <span className="font-bold text-stone-900">
                          {new Date(borrow.dueDate).toLocaleDateString()} ({dueInfo.daysText})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                        <span>Renewals Used:</span>
                        <span className="font-semibold text-amber-900">
                          {borrow.renewCount} of 2 allowed
                        </span>
                      </div>
                    </div>

                    {/* Return Confirmation Popover / Actions */}
                    {returnConfirmId === borrow.id ? (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-2 animate-in fade-in">
                        <p className="text-xs font-semibold text-amber-900">
                          Confirm returning &ldquo;{borrow.bookTitle}&rdquo;?
                        </p>
                        <div className="flex gap-2">
                          <button
                            id={`confirm-return-${borrow.id}`}
                            onClick={() => handleReturnConfirm(borrow.id)}
                            className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Yes, Return Book
                          </button>
                          <button
                            onClick={() => setReturnConfirmId(null)}
                            className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 pt-1">
                        {/* Return Book Button */}
                        <button
                          id={`return-btn-${borrow.id}`}
                          onClick={() => setReturnConfirmId(borrow.id)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Return Book
                        </button>

                        {/* Renew Book Button */}
                        <button
                          id={`renew-btn-${borrow.id}`}
                          onClick={() => renewBook(borrow.id)}
                          disabled={borrow.renewCount >= 2}
                          className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                            borrow.renewCount >= 2
                              ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900 hover:border-amber-400'
                          }`}
                          title={borrow.renewCount >= 2 ? 'Maximum renewals reached' : 'Extend loan by +7 days'}
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-700" /> Renew (+7d)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: RESERVATIONS */}
      {activeTabSub === 'reservations' && (
        <div className="space-y-6">
          {reservations.length === 0 ? (
            <div id="empty-reservations-card" className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
                <Bookmark className="w-8 h-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold font-serif-classic text-stone-900">
                No active reservations
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                When a title is currently borrowed by another student, clicking &ldquo;Reserve&rdquo; holds your place in the priority reservation queue.
              </p>
              <button
                onClick={() => setActiveTab('books')}
                className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-md transition-all inline-flex items-center gap-2"
              >
                Browse Books to Reserve
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  id={`res-card-${res.id}`}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={res.bookCover}
                      alt={res.bookTitle}
                      className="w-20 h-28 object-cover rounded-xl shadow-sm border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                          Hold Position #{res.queuePosition}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          {res.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold font-serif-classic text-stone-900 line-clamp-2">
                        {res.bookTitle}
                      </h3>
                      <p className="text-xs text-stone-600 truncate mt-0.5">
                        By {res.bookAuthor}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-2">
                        Reserved on: {new Date(res.reservedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      You will be notified as soon as it is returned.
                    </span>
                    <button
                      id={`cancel-res-${res.id}`}
                      onClick={() => cancelReservation(res.id)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel Reservation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
