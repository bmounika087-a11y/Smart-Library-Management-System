import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from './BookCard';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Library, 
  Users, 
  Layers, 
  BookmarkCheck, 
  Compass, 
  ShieldCheck, 
  Calendar,
  Star,
  ChevronRight,
  TrendingUp,
  Cpu,
  GraduationCap,
  Atom,
  Feather,
  Globe,
  Award
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onSearchQuery?: (query: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onSearchQuery
}) => {
  const { 
    books, 
    borrowings, 
    reservations, 
    setActiveTab, 
    recommendations,
    currentUser,
    setSelectedBookForShelf
  } = useLibrary();

  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      if (onSearchQuery) {
        onSearchQuery(heroSearch.trim());
      }
      setActiveTab('books');
    } else {
      setActiveTab('books');
    }
  };

  const handleCategoryClick = (category: string) => {
    if (onSearchQuery) {
      onSearchQuery(category);
    }
    setActiveTab('books');
  };

  // Popular / Most Borrowed books (sorted by borrowCount)
  const popularBooks = [...books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 4);

  // Categories definitions with icons and colors
  const categoryList = [
    { name: 'Programming', count: books.filter(b => b.category === 'Programming').length, color: 'from-blue-600 to-indigo-700', icon: <Cpu className="w-5 h-5 text-white" /> },
    { name: 'Data Structures', count: books.filter(b => b.category === 'Data Structures').length, color: 'from-cyan-600 to-teal-700', icon: <Layers className="w-5 h-5 text-white" /> },
    { name: 'Artificial Intelligence', count: books.filter(b => b.category === 'Artificial Intelligence').length, color: 'from-purple-600 to-violet-800', icon: <Sparkles className="w-5 h-5 text-white" /> },
    { name: 'Mathematics', count: books.filter(b => b.category === 'Mathematics').length, color: 'from-amber-600 to-orange-700', icon: <GraduationCap className="w-5 h-5 text-white" /> },
    { name: 'Physics', count: books.filter(b => b.category === 'Physics').length, color: 'from-emerald-600 to-green-700', icon: <Atom className="w-5 h-5 text-white" /> },
    { name: 'Chemistry', count: books.filter(b => b.category === 'Chemistry').length, color: 'from-teal-600 to-emerald-800', icon: <Atom className="w-5 h-5 text-white" /> },
    { name: 'English', count: books.filter(b => b.category === 'English').length, color: 'from-rose-600 to-pink-700', icon: <Feather className="w-5 h-5 text-white" /> },
    { name: 'Fiction', count: books.filter(b => b.category === 'Fiction').length, color: 'from-red-600 to-rose-800', icon: <BookOpen className="w-5 h-5 text-white" /> },
    { name: 'History', count: books.filter(b => b.category === 'History').length, color: 'from-amber-700 to-yellow-800', icon: <Globe className="w-5 h-5 text-white" /> },
    { name: 'General Knowledge', count: books.filter(b => b.category === 'General Knowledge').length, color: 'from-stone-700 to-stone-900', icon: <Award className="w-5 h-5 text-white" /> },
  ];

  // Live stats calculation
  const totalAvailable = books.filter(b => b.availability === 'Available').length;
  const totalBorrowed = books.filter(b => b.availability === 'Borrowed').length;
  const totalReserved = books.filter(b => b.availability === 'Reserved').length;

  return (
    <div id="landing-page" className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section 
        id="hero-section" 
        className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl mx-2 sm:mx-6 mt-4 border border-[#E8DFD1] bg-gradient-to-b from-[#F7F2E8] via-[#FAF7F2] to-white shadow-sm"
      >
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-rose-100/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold shadow-sm">
            <Library className="w-4 h-4 text-amber-700" />
            <span>ANGLES CENTRAL UNIVERSITY LIBRARY PLATFORM</span>
          </div>

          {/* Large Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold font-serif-classic text-stone-900 tracking-tight leading-tight">
            Smart Library <br />
            <span className="bg-gradient-to-r from-amber-800 via-amber-700 to-stone-900 bg-clip-text text-transparent italic">
              Management System
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-serif-classic text-amber-900/90 font-medium">
            “Find Books. Borrow Easily. Learn More.”
          </p>

          {/* Short Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 leading-relaxed">
            Students can instantly search over 20+ cataloged academic works, locate exact physical shelf racks with our 2D floor locator, check availability, and manage renewals seamlessly.
          </p>

          {/* 3 Main Functional Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-explore-books-btn"
              onClick={() => setActiveTab('books')}
              className="px-7 py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2.5"
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
              <span>Explore Books</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-search-library-btn"
              onClick={() => setActiveTab('search')}
              className="px-7 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-300 hover:border-amber-500 font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center gap-2.5"
            >
              <Search className="w-5 h-5 text-amber-700" />
              <span>Search Library</span>
            </button>

            <button
              id="hero-login-btn"
              onClick={() => {
                if (currentUser) {
                  setActiveTab('dashboard');
                } else {
                  onOpenAuth();
                }
              }}
              className="px-7 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-100 font-semibold text-sm sm:text-base shadow-md transition-all flex items-center gap-2.5"
            >
              <Users className="w-5 h-5 text-amber-400" />
              <span>{currentUser ? 'My Dashboard' : 'Student Login'}</span>
            </button>
          </div>

          {/* Live Quick Search Input Bar right in Hero */}
          <div className="pt-8 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearchSubmit} className="relative flex items-center">
              <input
                id="hero-search-input"
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search Python, Algorithms, Stewart, Physics, ISBN..."
                className="w-full pl-12 pr-28 py-4 bg-white rounded-2xl border-2 border-amber-200/90 focus:border-amber-600 focus:ring-4 focus:ring-amber-500/15 text-stone-800 placeholder-stone-400 shadow-lg text-sm transition-all"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
              <button
                id="hero-search-submit-btn"
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Search
              </button>
            </form>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Quick Searches:</span>
              {['Python', 'Algorithms', 'Quantum', '1984', 'Linear Algebra'].map((tag) => (
                <button
                  key={tag}
                  id={`quick-search-${tag}`}
                  onClick={() => {
                    setHeroSearch(tag);
                    onSearchQuery(tag);
                    setActiveTab('books');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-100/60 hover:bg-amber-100 text-amber-900 font-medium transition-colors border border-amber-200/60"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Live Metrics Ticker */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="text-2xl font-bold font-serif-classic text-stone-900">{books.length}</div>
              <div className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 mt-0.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Total Catalog Books
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="text-2xl font-bold font-serif-classic text-emerald-700">{totalAvailable}</div>
              <div className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready to Borrow
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="text-2xl font-bold font-serif-classic text-amber-800">{totalBorrowed}</div>
              <div className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Active Student Loans
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="text-2xl font-bold font-serif-classic text-indigo-700">100%</div>
              <div className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Shelf Mapped (3 Floors)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR & MOST BORROWED BOOKS */}
      <section id="popular-books-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full mb-2">
              <TrendingUp className="w-3.5 h-3.5" /> High Demand Catalog
            </div>
            <h2 className="text-3xl font-bold font-serif-classic text-stone-900">
              Most Borrowed & Academic Favorites
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Calculated dynamically from real campus loan cycles and student ratings.
            </p>
          </div>
          <button
            id="view-all-popular-btn"
            onClick={() => setActiveTab('books')}
            className="mt-4 sm:mt-0 text-sm font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 group"
          >
            <span>View All Books ({books.length})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* 3. BOOK CATEGORIES */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Faculty & Departmental Disciplines
          </span>
          <h2 className="text-3xl font-bold font-serif-classic text-stone-900 mt-2">
            Explore Books by Category
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Click any field to immediately filter the digital catalog.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryList.map((cat) => (
            <div
              key={cat.name}
              id={`cat-card-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleCategoryClick(cat.name)}
              className="group p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-stone-400 font-mono">
                  {cat.count} {cat.count === 1 ? 'Book' : 'Books'}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                  Browse titles <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-700" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS (Section 14 in Prompt) */}
      <section id="how-it-works-section" className="bg-[#F6F1E7] border-y border-[#E8DFD1] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full">
              Seamless 3-Step Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900 mt-2">
              How It Works
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Making library access simple, smart and convenient for every student.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-colors">
              <div className="text-5xl font-serif-classic font-bold text-amber-200/80 select-none absolute top-4 right-4">
                01
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-6 border border-amber-300/60">
                <Search className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold font-serif-classic text-stone-900 mb-2">
                01 — Search
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Find the book you need using multi-attribute smart search across title, author, subject, ISBN, or discipline.
              </p>
              <button
                onClick={() => setActiveTab('search')}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
              >
                Try Smart Search <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 02 */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-colors">
              <div className="text-5xl font-serif-classic font-bold text-amber-200/80 select-none absolute top-4 right-4">
                02
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-6 border border-emerald-300/60">
                <BookOpen className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold font-serif-classic text-stone-900 mb-2">
                02 — Borrow
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Check real-time availability and borrow it with a single click. If currently borrowed, reserve your spot in the priority queue.
              </p>
              <button
                onClick={() => setActiveTab('books')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                Explore Available Books <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 03 */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-colors">
              <div className="text-5xl font-serif-classic font-bold text-amber-200/80 select-none absolute top-4 right-4">
                03
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg mb-6 border border-indigo-300/60">
                <Clock className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold font-serif-classic text-stone-900 mb-2">
                03 — Return
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Track due dates automatically with color-coded status badges, renew loan periods in one click, and return easily.
              </p>
              <button
                onClick={() => setActiveTab('borrowings')}
                className="text-xs font-bold text-indigo-800 hover:text-indigo-950 flex items-center gap-1"
              >
                Check Borrowings <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SMART FEATURES SHOWCASE (Unique Features) */}
      <section id="smart-features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Modern Innovations
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900 mt-2">
            Why Our Smart System Stands Out
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Engineered beyond a basic database table with dedicated interactive student utilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Smart Shelf Locator
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Never get lost in vast library aisles. Every title features exact coordinates (e.g. 📍 Shelf B-12) with a 2D floorplan.
            </p>
            <button
              onClick={() => {
                if (books[0]) setSelectedBookForShelf(books[0]);
              }}
              className="mt-4 text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              Demo Shelf Map <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Smart Recommendations
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Analyzes your real reading history, active favorites, and recent search patterns to recommend tailored academic works.
            </p>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="mt-4 text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              View My Recommendations <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Due-Date Tracker & Renew
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Visual badges highlight titles due soon, due later, or overdue. Renew books for +7 days with zero administrative friction.
            </p>
            <button
              onClick={() => setActiveTab('borrowings')}
              className="mt-4 text-xs font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-1"
            >
              Manage Borrowings <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Librarian Administration
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Full CRUD management for catalog additions, status toggles, borrower logs, and reservation queues with persistent local storage.
            </p>
            <button
              onClick={() => setActiveTab('admin')}
              className="mt-4 text-xs font-semibold text-purple-800 hover:text-purple-950 flex items-center gap-1"
            >
              Open Admin Console <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. RECOMMENDED BOOKS PREVIEW (Section 8 in Prompt) */}
      <section id="recommended-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/15">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Dynamic Personalization
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-classic text-white">
                “Recommended For You”
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Calculated from your active borrowings, recent searches, and saved favorites.
              </p>
            </div>
            <button
              id="view-all-recs-btn"
              onClick={() => setActiveTab('recommendations')}
              className="mt-4 sm:mt-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <span>Explore All Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((item) => (
              <div
                key={item.book.id}
                className="bg-white text-stone-900 rounded-2xl p-4 shadow-lg flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-sm border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {item.book.category}
                    </span>
                    <h4 className="text-sm font-bold font-serif-classic text-stone-900 mt-1 line-clamp-2">
                      {item.book.title}
                    </h4>
                    <p className="text-xs text-stone-600 truncate mt-0.5">
                      {item.book.author}
                    </p>
                    <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.book.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                  <span className="italic text-amber-900 font-medium truncate max-w-[200px]">
                    💡 {item.reason}
                  </span>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className="text-xs font-bold text-stone-900 hover:text-amber-800 underline shrink-0"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section id="cta-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border border-amber-300/80 shadow-md">
          <span className="font-crest text-xs font-bold tracking-widest text-amber-800 uppercase">
            Campus Knowledge Hub
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900 mt-2 mb-4">
            Begin Your Academic Discovery Today
          </h2>
          <p className="max-w-xl mx-auto text-stone-600 text-sm leading-relaxed mb-8">
            Whether preparing for finals, exploring artificial intelligence, or delving into literary classics, our smart system makes finding and borrowing effortless.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="cta-browse-btn"
              onClick={() => setActiveTab('books')}
              className="px-8 py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md transition-all"
            >
              Browse Full Catalog ({books.length} Titles)
            </button>
            <button
              id="cta-dashboard-btn"
              onClick={() => setActiveTab('dashboard')}
              className="px-8 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm shadow-sm transition-all"
            >
              View Student Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (Section 15 in Prompt) */}
      <footer id="library-footer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-crest font-bold text-stone-900 tracking-wider">
                SMART LIBRARY MANAGEMENT SYSTEM
              </span>
            </div>
            <p className="text-sm font-serif-classic italic text-stone-600">
              “Making library access simple, smart and convenient.”
            </p>
            <p className="text-xs text-stone-500 max-w-md">
              A modern, colorful and fully functional academic prototype designed for university students, faculty researchers, and campus library administrators.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
              Navigation Links
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button id="footer-link-home" onClick={() => setActiveTab('home')} className="hover:text-amber-800">
                  Home
                </button>
              </li>
              <li>
                <button id="footer-link-books" onClick={() => setActiveTab('books')} className="hover:text-amber-800">
                  Books Catalog
                </button>
              </li>
              <li>
                <button id="footer-link-search" onClick={() => setActiveTab('search')} className="hover:text-amber-800">
                  Smart Search
                </button>
              </li>
              <li>
                <button id="footer-link-borrowings" onClick={() => setActiveTab('borrowings')} className="hover:text-amber-800">
                  My Borrowings
                </button>
              </li>
              <li>
                <button id="footer-link-dashboard" onClick={() => setActiveTab('dashboard')} className="hover:text-amber-800">
                  User Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
              Information & Support
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button id="footer-link-about" onClick={onOpenAbout} className="hover:text-amber-800">
                  About the System
                </button>
              </li>
              <li>
                <button id="footer-link-contact" onClick={onOpenContact} className="hover:text-amber-800">
                  Contact Librarian
                </button>
              </li>
              <li>
                <button id="footer-link-privacy" onClick={onOpenPrivacy} className="hover:text-amber-800">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button id="footer-link-admin" onClick={() => setActiveTab('admin')} className="hover:text-amber-800 font-semibold text-amber-900">
                  Librarian Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Team: ANGLES and copyright */}
        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © 2026 Smart Library Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Project Development:</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-full border border-amber-300">
              Team: ANGLES
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
