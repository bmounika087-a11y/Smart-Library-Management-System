import React, { useState, useMemo, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from './BookCard';
import { Book } from '../types';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Grid, 
  List, 
  Star, 
  SlidersHorizontal, 
  BookOpen, 
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Bookmark,
  Heart,
  Eye,
  ArrowUpDown
} from 'lucide-react';

interface BookCatalogViewProps {
  initialSearchQuery?: string;
}

export const BookCatalogView: React.FC<BookCatalogViewProps> = ({ initialSearchQuery = '' }) => {
  const { 
    books, 
    borrowBook, 
    reserveBook, 
    toggleFavorite, 
    isFavorite, 
    setSelectedBookForDetail, 
    setSelectedBookForShelf,
    recordSearch,
    borrowings,
    reservations,
    recommendations,
    getSearchRecommendations
  } = useLibrary();

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [curriculumFilter, setCurriculumFilter] = useState<'all' | 'btech' | 'programming' | 'recommended'>('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [yearRange, setYearRange] = useState<number>(2020);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'year' | 'title'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [recSpotlightTab, setRecSpotlightTab] = useState<'btech' | 'programming' | 'academic'>('btech');
  const [showRecommendationsSpotlight, setShowRecommendationsSpotlight] = useState(true);

  // Sync if initialSearchQuery prop changes
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Record search into history for smart recommendations after debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        recordSearch(searchQuery);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Dynamic search recommendations
  const searchRecommendations = useMemo(() => {
    return getSearchRecommendations(searchQuery);
  }, [searchQuery, getSearchRecommendations]);

  // Counts
  const btechCount = useMemo(() => books.filter((b) => b.isBTechTextbook).length, [books]);
  const programmingCount = useMemo(
    () => books.filter((b) => b.isProgramming || b.category === 'Programming' || b.category === 'Data Structures').length,
    [books]
  );

  // Unique categories and authors
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.category));
    return Array.from(set).sort();
  }, [books]);

  const authors = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.author));
    return Array.from(set).sort();
  }, [books]);

  // Branches
  const engineeringBranches = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.branch) set.add(b.branch);
    });
    return Array.from(set).sort();
  }, [books]);

  // Filtering logic
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Multi-attribute search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const isBtechQuery = 
            q.includes('btch') || 
            q.includes('btech') || 
            q.includes('b.tech') || 
            q.includes('textbook') || 
            q.includes('text book') || 
            q.includes('engineering') || 
            q.includes('cse') || 
            q.includes('ece') || 
            q.includes('eee') || 
            q.includes('gate') || 
            q.includes('sem') || 
            q.includes('semester') || 
            q.includes('grewal') || 
            q.includes('mano') || 
            q.includes('korth') || 
            q.includes('silberschatz') ||
            q.includes('tanenbaum');

          const isProgQuery = 
            q.includes('proram') || 
            q.includes('prog') || 
            q.includes('code') || 
            q.includes('coding') || 
            q.includes('python') || 
            q.includes('java') || 
            q.includes('c++') || 
            q.includes('dsa') || 
            q.includes('algo') || 
            q.includes('sql') || 
            q.includes('web');

          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchCategory = book.category.toLowerCase().includes(q);
          const matchIsbn = book.isbn.toLowerCase().includes(q);
          const matchDesc = book.description.toLowerCase().includes(q);
          const matchShelf = book.shelfNumber.toLowerCase().includes(q);
          const matchBranch = book.branch ? book.branch.toLowerCase().includes(q) : false;
          const matchSemester = book.semester ? book.semester.toLowerCase().includes(q) : false;
          const matchCurriculum = book.curriculumTags ? book.curriculumTags.some(t => t.toLowerCase().includes(q)) : false;
          const matchBtechFlag = isBtechQuery && book.isBTechTextbook;
          const matchProgFlag = isProgQuery && (book.isProgramming || book.category === 'Programming' || book.category === 'Data Structures');

          if (!matchTitle && !matchAuthor && !matchCategory && !matchIsbn && !matchDesc && !matchShelf && !matchBranch && !matchSemester && !matchCurriculum && !matchBtechFlag && !matchProgFlag) {
            return false;
          }
        }

        // Curriculum Filter
        if (curriculumFilter === 'btech' && !book.isBTechTextbook) {
          return false;
        }
        if (curriculumFilter === 'programming' && !book.isProgramming && book.category !== 'Programming' && book.category !== 'Data Structures') {
          return false;
        }
        if (curriculumFilter === 'recommended') {
          const isRec = recommendations.some((r) => r.book.id === book.id) || book.rating >= 4.8;
          if (!isRec) return false;
        }

        // Branch filter
        if (selectedBranch !== 'all' && book.branch !== selectedBranch) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && book.category !== selectedCategory) {
          return false;
        }

        // Author filter
        if (selectedAuthor !== 'all' && book.author !== selectedAuthor) {
          return false;
        }

        // Availability filter
        if (selectedAvailability !== 'all' && book.availability !== selectedAvailability) {
          return false;
        }

        // Min rating
        if (minRating > 0 && book.rating < minRating) {
          return false;
        }

        // Year filter
        if (book.publicationYear < yearRange) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') return b.borrowCount - a.borrowCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'year') return b.publicationYear - a.publicationYear;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [books, searchQuery, curriculumFilter, selectedBranch, selectedCategory, selectedAuthor, selectedAvailability, minRating, yearRange, sortBy, recommendations]);

  // Reset/Clear Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setCurriculumFilter('all');
    setSelectedBranch('all');
    setSelectedCategory('all');
    setSelectedAuthor('all');
    setSelectedAvailability('all');
    setMinRating(0);
    setYearRange(2020);
    setSortBy('popularity');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    curriculumFilter !== 'all' ||
    selectedBranch !== 'all' ||
    selectedCategory !== 'all' || 
    selectedAuthor !== 'all' || 
    selectedAvailability !== 'all' || 
    minRating > 0 || 
    yearRange > 2020 ||
    sortBy !== 'popularity';

  const quickSearchSuggestions = [
    { label: '🎓 B.Tech Textbooks', query: 'btech' },
    { label: '💻 Programming Textbooks', query: 'programming' },
    { label: '🐍 Python Crash Course', query: 'python' },
    { label: '⚡ CLRS Algorithms', query: 'algorithms' },
    { label: '📐 Higher Engineering Math', query: 'mathematics' },
    { label: '⚙️ Operating Systems (Silberschatz)', query: 'operating systems' },
    { label: '💾 Database Systems (Korth)', query: 'database' }
  ];

  return (
    <div id="book-catalog-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1">
            <BookOpen className="w-3.5 h-3.5" /> University Digital Repository
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900">
            Smart Book Catalog & Search
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Search dynamically across titles, authors, subjects, and ISBN codes with instant shelf coordinate lookup.
          </p>
        </div>

        {/* View toggle & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-700" />
            <span>Filters {hasActiveFilters && '●'}</span>
          </button>

          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              id="view-mode-grid"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              id="view-mode-list"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Search Input Bar */}
      <div className="space-y-2.5">
        <div className="relative flex items-center">
          <input
            id="catalog-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search B.Tech textbooks, programming books, subjects, authors, ISBN (e.g. btech, python, grewal, clrs)..."
            className="w-full pl-12 pr-28 py-3.5 bg-white rounded-2xl border border-stone-300 focus:border-amber-600 focus:ring-4 focus:ring-amber-500/10 text-stone-900 text-sm shadow-sm transition-all"
          />
          <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 px-3 py-1 text-xs font-medium text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Search Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-stone-600">
          <span className="font-semibold text-stone-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> Quick Searches:
          </span>
          {quickSearchSuggestions.map((sug) => (
            <button
              key={sug.label}
              onClick={() => setSearchQuery(sug.query)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200/90 whitespace-nowrap transition-all shadow-2xs"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Curriculum & Subject Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
          {/* All */}
          <button
            id="chip-curriculum-all"
            onClick={() => {
              setCurriculumFilter('all');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-2xs ${
              curriculumFilter === 'all' && selectedCategory === 'all'
                ? 'bg-stone-900 text-white font-bold shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
            }`}
          >
            All Books ({books.length})
          </button>

          {/* B.Tech Textbooks Chip */}
          <button
            id="chip-curriculum-btech"
            onClick={() => {
              setCurriculumFilter('btech');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-2xs ${
              curriculumFilter === 'btech'
                ? 'bg-amber-700 text-white font-bold shadow-xs'
                : 'bg-amber-50/80 text-amber-900 border border-amber-200 hover:bg-amber-100/80'
            }`}
          >
            <span>🎓 B.Tech Textbooks</span>
            <span className="bg-amber-200/80 text-amber-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {btechCount}
            </span>
          </button>

          {/* Programming Textbooks Chip */}
          <button
            id="chip-curriculum-programming"
            onClick={() => {
              setCurriculumFilter('programming');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-2xs ${
              curriculumFilter === 'programming'
                ? 'bg-blue-700 text-white font-bold shadow-xs'
                : 'bg-blue-50/80 text-blue-900 border border-blue-200 hover:bg-blue-100/80'
            }`}
          >
            <span>💻 Programming Books</span>
            <span className="bg-blue-200/80 text-blue-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {programmingCount}
            </span>
          </button>

          {/* Highly Recommended */}
          <button
            id="chip-curriculum-recommended"
            onClick={() => {
              setCurriculumFilter('recommended');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-2xs ${
              curriculumFilter === 'recommended'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-emerald-50/80 text-emerald-900 border border-emerald-200 hover:bg-emerald-100/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended For You</span>
            <span className="bg-emerald-200/80 text-emerald-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {recommendations.length}
            </span>
          </button>

          <span className="text-stone-300">|</span>

          {/* Category Chips */}
          {categories.map((cat) => (
            <button
              key={cat}
              id={`chip-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurriculumFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat && curriculumFilter === 'all'
                  ? 'bg-amber-900 text-white font-bold shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Branch Filter if B.Tech active */}
        {curriculumFilter === 'btech' && engineeringBranches.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            <span className="text-amber-800 font-semibold text-[11px] shrink-0">Engineering Branch:</span>
            <button
              onClick={() => setSelectedBranch('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedBranch === 'all' ? 'bg-amber-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200'
              }`}
            >
              All Branches
            </button>
            {engineeringBranches.map((br) => (
              <button
                key={br}
                onClick={() => setSelectedBranch(br)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedBranch === br ? 'bg-amber-800 text-white font-bold' : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
                }`}
              >
                {br}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SMART RECOMMENDATION SPOTLIGHT PANEL (Shows on search or exploration) */}
      <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-100/40 rounded-3xl p-5 border border-amber-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-serif-classic text-stone-900">
                  {searchQuery ? `Recommended Books For "${searchQuery}"` : 'Recommended Academic & Programming Textbooks'}
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                  Smart Match
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Direct curriculum mapping for B.Tech engineering coursework and modern programming development.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {/* Spotlight Tab Buttons */}
            <button
              onClick={() => setRecSpotlightTab('btech')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                recSpotlightTab === 'btech'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              🎓 B.Tech ({searchRecommendations.btechTextbooks.length})
            </button>
            <button
              onClick={() => setRecSpotlightTab('programming')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                recSpotlightTab === 'programming'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              💻 Programming ({searchRecommendations.programmingTextbooks.length})
            </button>
            <button
              onClick={() => setRecSpotlightTab('academic')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                recSpotlightTab === 'academic'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              ⭐ Campus Picks ({searchRecommendations.recommendedMatching.length})
            </button>
          </div>
        </div>

        {/* Render Spotlight Cards */}
        {recSpotlightTab === 'btech' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchRecommendations.btechTextbooks.slice(0, 4).map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl p-3 border border-amber-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-2 group"
              >
                <div className="flex gap-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-14 h-20 object-cover rounded-lg border border-stone-200 shadow-2xs shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                    onClick={() => setSelectedBookForDetail(book)}
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      🎓 {book.semester || 'B.Tech Core'}
                    </span>
                    <h3
                      onClick={() => setSelectedBookForDetail(book)}
                      className="text-xs font-bold text-stone-900 line-clamp-2 hover:text-amber-800 cursor-pointer mt-1"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">By {book.author}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{book.rating}</span>
                      <span className="text-stone-400 font-normal">({book.branch || 'Eng'})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 font-mono text-[10px]">Shelf {book.shelfNumber}</span>
                  <div className="flex items-center gap-1.5">
                    {book.availability === 'Available' ? (
                      <button
                        onClick={() => borrowBook(book.id)}
                        className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow-2xs hover:shadow transition-all"
                      >
                        Borrow
                      </button>
                    ) : (
                      <button
                        onClick={() => reserveBook(book.id)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-all"
                      >
                        Reserve
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBookForDetail(book)}
                      className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recSpotlightTab === 'programming' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchRecommendations.programmingTextbooks.slice(0, 4).map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl p-3 border border-blue-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-2 group"
              >
                <div className="flex gap-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-14 h-20 object-cover rounded-lg border border-stone-200 shadow-2xs shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                    onClick={() => setSelectedBookForDetail(book)}
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                      💻 {book.category}
                    </span>
                    <h3
                      onClick={() => setSelectedBookForDetail(book)}
                      className="text-xs font-bold text-stone-900 line-clamp-2 hover:text-blue-800 cursor-pointer mt-1"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">By {book.author}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{book.rating}</span>
                      <span className="text-stone-400 font-normal">({book.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 font-mono text-[10px]">Shelf {book.shelfNumber}</span>
                  <div className="flex items-center gap-1.5">
                    {book.availability === 'Available' ? (
                      <button
                        onClick={() => borrowBook(book.id)}
                        className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-2xs hover:shadow transition-all"
                      >
                        Borrow
                      </button>
                    ) : (
                      <button
                        onClick={() => reserveBook(book.id)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-all"
                      >
                        Reserve
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBookForDetail(book)}
                      className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recSpotlightTab === 'academic' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchRecommendations.recommendedMatching.slice(0, 4).map(({ book, reason, matchScore }) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl p-3 border border-amber-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-2 group"
              >
                <div>
                  <div className="text-[10px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md mb-2 truncate">
                    💡 {reason}
                  </div>
                  <div className="flex gap-3">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-14 h-20 object-cover rounded-lg border border-stone-200 shadow-2xs shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                      onClick={() => setSelectedBookForDetail(book)}
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <h3
                        onClick={() => setSelectedBookForDetail(book)}
                        className="text-xs font-bold text-stone-900 line-clamp-2 hover:text-amber-800 cursor-pointer"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">By {book.author}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{book.rating}</span>
                        <span className="text-emerald-700 font-semibold text-[10px] ml-1">+{matchScore} pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 font-mono text-[10px]">Shelf {book.shelfNumber}</span>
                  <div className="flex items-center gap-1.5">
                    {book.availability === 'Available' ? (
                      <button
                        onClick={() => borrowBook(book.id)}
                        className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow-2xs hover:shadow transition-all"
                      >
                        Borrow
                      </button>
                    ) : (
                      <button
                        onClick={() => reserveBook(book.id)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-all"
                      >
                        Reserve
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBookForDetail(book)}
                      className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter & Sort Controls Grid */}
      <div className={`bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Filter className="w-4 h-4 text-amber-700" />
            <span>Smart Filters</span>
          </div>

          {hasActiveFilters && (
            <button
              id="clear-all-filters-btn"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* Category Dropdown */}
          <div>
            <label htmlFor="filter-category" className="block font-medium text-stone-600 mb-1">
              Category
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:border-amber-600 focus:bg-white transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Author Dropdown */}
          <div>
            <label htmlFor="filter-author" className="block font-medium text-stone-600 mb-1">
              Author
            </label>
            <select
              id="filter-author"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:border-amber-600 focus:bg-white transition-colors"
            >
              <option value="all">All Authors</option>
              {authors.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Availability Status */}
          <div>
            <label htmlFor="filter-availability" className="block font-medium text-stone-600 mb-1">
              Availability Status
            </label>
            <select
              id="filter-availability"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:border-amber-600 focus:bg-white transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available for Borrowing</option>
              <option value="Borrowed">Currently Borrowed</option>
              <option value="Reserved">Reserved Hold</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label htmlFor="filter-rating" className="block font-medium text-stone-600 mb-1">
              Minimum Rating
            </label>
            <select
              id="filter-rating"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:border-amber-600 focus:bg-white transition-colors"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5★ and above</option>
              <option value={4.7}>4.7★ and above</option>
              <option value={4.8}>4.8★ and above</option>
              <option value={4.9}>4.9★ Masterpieces</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="filter-sort" className="block font-medium text-stone-600 mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-stone-400" /> Sort Order
            </label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:border-amber-600 focus:bg-white transition-colors"
            >
              <option value="popularity">Most Popular / Borrowed</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Newest Publication</option>
              <option value="title">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-600 px-1">
        <div>
          Showing <span className="font-bold text-stone-900">{filteredBooks.length}</span> of {books.length} books
          {searchQuery && <span> for &ldquo;<span className="text-amber-900 font-semibold">{searchQuery}</span>&rdquo;</span>}
        </div>
        {filteredBooks.length > 0 && (
          <span className="text-stone-400">
            {selectedAvailability === 'Available' ? 'Displaying loan-ready titles only' : 'Live campus inventory updated'}
          </span>
        )}
      </div>

      {/* Book Grid / List */}
      {filteredBooks.length === 0 ? (
        <div id="catalog-empty-state" className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Search className="w-7 h-7 text-amber-700" />
          </div>
          <h3 className="text-xl font-bold font-serif-classic text-stone-900">
            No matching books found
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            We couldn&apos;t find any titles matching your search criteria. Try clearing some filters or searching for terms like &ldquo;Python&rdquo;, &ldquo;Algorithms&rdquo;, or &ldquo;Stewart&rdquo;.
          </p>
          <button
            id="empty-clear-filters-btn"
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredBooks.map((book) => {
            const isFav = isFavorite(book.id);
            const isBorrowedByUser = borrowings.some((b) => b.bookId === book.id);
            const isReservedByUser = reservations.some((r) => r.bookId === book.id);

            return (
              <div
                key={book.id}
                id={`book-list-item-${book.id}`}
                className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-22 object-cover rounded-lg shadow-sm border border-stone-200 shrink-0 cursor-pointer"
                    onClick={() => setSelectedBookForDetail(book)}
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {book.isBTechTextbook && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          🎓 B.Tech {book.semester ? `(${book.semester})` : ''}
                        </span>
                      )}
                      {(book.isProgramming || book.category === 'Programming' || book.category === 'Data Structures') && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                          💻 Code
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {book.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        book.availability === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        ● {book.availability}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedBookForDetail(book)}
                      className="font-bold text-base font-serif-classic text-stone-900 hover:text-amber-800 cursor-pointer truncate"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-600 truncate mt-0.5">
                      By {book.author} • {book.publicationYear} • ISBN: {book.isbn}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <div className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{book.rating}</span>
                      </div>
                      <span className="text-stone-300">•</span>
                      <button
                        onClick={() => setSelectedBookForShelf(book)}
                        className="text-amber-800 font-semibold hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-amber-600" />
                        Shelf: {book.shelfNumber} (Floor {book.shelfFloor})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => toggleFavorite(book.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isFav ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-stone-200 text-stone-400 hover:text-stone-700'
                    }`}
                    title="Toggle Favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>

                  {book.availability === 'Available' ? (
                    <button
                      onClick={() => borrowBook(book.id)}
                      disabled={isBorrowedByUser}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isBorrowedByUser 
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {isBorrowedByUser ? 'Borrowed' : 'Borrow Book'}
                    </button>
                  ) : (
                    <button
                      onClick={() => reserveBook(book.id)}
                      disabled={isBorrowedByUser || isReservedByUser}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                        isReservedByUser
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {isReservedByUser ? 'Reserved ✓' : 'Reserve'}
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedBookForDetail(book)}
                    className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
