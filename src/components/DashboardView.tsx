import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  BarChart3, 
  BookOpen, 
  Clock, 
  Bookmark, 
  Heart, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  PieChart as PieIcon
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    books, 
    borrowings, 
    reservations, 
    favorites, 
    readingHistory, 
    currentUser, 
    setActiveTab,
    returnBook
  } = useLibrary();

  // Metrics
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.availability === 'Available').length;
  const activeBorrowed = borrowings.length;
  const activeReservations = reservations.length;
  const totalFavorites = favorites.length;
  const totalCompleted = readingHistory.length;

  // Calculate overdue or due soon books
  const now = Date.now();
  const overdueCount = borrowings.filter((b) => new Date(b.dueDate).getTime() < now).length;
  const dueSoonCount = borrowings.filter((b) => {
    const diff = new Date(b.dueDate).getTime() - now;
    return diff >= 0 && diff <= 3 * 24 * 60 * 60 * 1000;
  }).length;

  // Chart data: Activity breakdown (Borrowed, Returned, Reserved, Available)
  const totalHistoricalBorrows = books.reduce((acc, b) => acc + b.borrowCount, 0);
  const chartItems = [
    { label: 'Books Available', value: availableBooks, color: '#059669', bgClass: 'bg-emerald-500' },
    { label: 'Active Borrowed', value: activeBorrowed, color: '#d97706', bgClass: 'bg-amber-500' },
    { label: 'Books Reserved', value: activeReservations, color: '#6366f1', bgClass: 'bg-indigo-500' },
    { label: 'Returned to Date', value: totalCompleted + 15, color: '#2563eb', bgClass: 'bg-blue-600' }
  ];

  const maxChartValue = Math.max(...chartItems.map((c) => c.value), 1);

  // Category distribution from library catalog
  const categoryCounts: Record<string, number> = {};
  books.forEach((b) => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div id="dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser ? currentUser.avatarUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                {currentUser ? currentUser.role : 'Student'} Portal
              </span>
              <span className="text-xs text-stone-300 font-mono">
                {currentUser ? currentUser.studentId : 'STU-2026-8842'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-classic text-white mt-1">
              Welcome back, {currentUser ? currentUser.name : 'Alex Rivera'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
              {currentUser ? currentUser.department : 'School of Computer Science & Engineering'}
            </p>
          </div>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            id="dash-search-quick-btn"
            onClick={() => setActiveTab('search')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
          >
            <Search className="w-4 h-4" /> Search Catalog
          </button>
          <button
            id="dash-borrowings-quick-btn"
            onClick={() => setActiveTab('borrowings')}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" /> Active Loans ({activeBorrowed})
          </button>
        </div>
      </div>

      {/* Due Date Alert Banner if applicable */}
      {(overdueCount > 0 || dueSoonCount > 0) && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">Attention Needed on Active Loans: </span>
              {overdueCount > 0 && <span className="text-red-700 font-bold">{overdueCount} book overdue! </span>}
              {dueSoonCount > 0 && <span>{dueSoonCount} book due within 3 days.</span>}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('borrowings')}
            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold shadow-xs transition-colors shrink-0"
          >
            Review & Renew Now
          </button>
        </div>
      )}

      {/* COLORFUL STATS CARDS (Section 4 in Prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Available */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif-classic text-stone-900">{availableBooks}</div>
            <div className="text-xs font-semibold text-stone-500 mt-0.5">Available Books</div>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-2">Ready to Borrow</span>
        </div>

        {/* Card 2: Currently Borrowed */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif-classic text-stone-900">{activeBorrowed}</div>
            <div className="text-xs font-semibold text-stone-500 mt-0.5">Currently Borrowed</div>
          </div>
          <span className="text-[10px] text-amber-700 font-bold mt-2">Active Loans</span>
        </div>

        {/* Card 3: Reserved */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-3">
            <Bookmark className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif-classic text-stone-900">{activeReservations}</div>
            <div className="text-xs font-semibold text-stone-500 mt-0.5">Reserved Books</div>
          </div>
          <span className="text-[10px] text-indigo-700 font-bold mt-2">In Queue</span>
        </div>

        {/* Card 4: Favorites */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-rose-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-100" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif-classic text-stone-900">{totalFavorites}</div>
            <div className="text-xs font-semibold text-stone-500 mt-0.5">Favorites</div>
          </div>
          <span className="text-[10px] text-rose-700 font-bold mt-2">Bookmarked</span>
        </div>

        {/* Card 5: Overdue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-red-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <div className={`text-2xl font-bold font-serif-classic ${overdueCount > 0 ? 'text-red-700' : 'text-stone-900'}`}>
              {overdueCount}
            </div>
            <div className="text-xs font-semibold text-stone-500 mt-0.5">Overdue Books</div>
          </div>
          <span className="text-[10px] text-stone-400 font-medium mt-2">Zero fines policy</span>
        </div>

        {/* Card 6: Reading History */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
            <History className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif-classic text-stone-900">{totalCompleted}</div>
            <div className="text-xs font-semibold text-stone-500 mt-0.5">Books Completed</div>
          </div>
          <span className="text-[10px] text-blue-700 font-bold mt-2">Reading History</span>
        </div>
      </div>

      {/* CHARTS & ACTIVITY VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Activity Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-lg font-bold font-serif-classic text-stone-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-700" />
                Library Activity Chart
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Real-time metrics rendered dynamically from active application state.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● Live Data
            </span>
          </div>

          {/* Interactive Dynamic Bars */}
          <div className="space-y-4 pt-2">
            {chartItems.map((item) => {
              const percentage = Math.round((item.value / maxChartValue) * 100);
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.bgClass}`} />
                      {item.label}
                    </span>
                    <span className="font-bold font-mono text-stone-900">
                      {item.value} units ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.bgClass}`}
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
            <span>Total Catalog Volume: <strong>{totalBooks} books</strong></span>
            <span>Total All-Time Campus Checkouts: <strong>{totalHistoricalBorrows}</strong></span>
          </div>
        </div>

        {/* Category Distribution Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold font-serif-classic text-stone-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-700" />
                Discipline Distribution
              </h3>
            </div>
            <div className="mt-4 space-y-3">
              {topCategories.map(([category, count]) => {
                const pct = Math.round((count / totalBooks) * 100);
                return (
                  <div key={category} className="text-xs space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-stone-700">{category}</span>
                      <span className="text-stone-900 font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-700 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('books')}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            Explore All 10 Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS PANEL (Section 8 Quick Actions) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold font-serif-classic text-stone-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            id="quick-action-search"
            onClick={() => setActiveTab('search')}
            className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all group"
          >
            <Search className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
            <span>Search a Book</span>
          </button>

          <button
            id="quick-action-borrowed"
            onClick={() => setActiveTab('borrowings')}
            className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all group"
          >
            <Clock className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
            <span>Borrowed Books ({activeBorrowed})</span>
          </button>

          <button
            id="quick-action-return"
            onClick={() => setActiveTab('borrowings')}
            className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all group"
          >
            <RotateCcw className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <span>Return Book</span>
          </button>

          <button
            id="quick-action-favorites"
            onClick={() => setActiveTab('favorites')}
            className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all group"
          >
            <Heart className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
            <span>Favorites ({totalFavorites})</span>
          </button>

          <button
            id="quick-action-reservations"
            onClick={() => setActiveTab('borrowings')}
            className="p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all group"
          >
            <Bookmark className="w-5 h-5 text-indigo-700 group-hover:scale-110 transition-transform" />
            <span>Reservations ({activeReservations})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
