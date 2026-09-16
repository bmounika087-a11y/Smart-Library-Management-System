import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from './BookCard';
import { Sparkles, Compass, Lightbulb, Search, BookOpen, Heart, ArrowRight, Code2, GraduationCap } from 'lucide-react';

export const RecommendationsView: React.FC = () => {
  const { recommendations, searchHistory, borrowings, favorites, books, setActiveTab } = useLibrary();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'btech' | 'programming' | 'topRated'>('all');

  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  // Curated B.Tech and Programming recommendations
  const btechRecommended = useMemo(() => {
    return books.filter((b) => b.isBTechTextbook).sort((a, b) => b.rating - a.rating);
  }, [books]);

  const programmingRecommended = useMemo(() => {
    return books
      .filter((b) => b.isProgramming || b.category === 'Programming' || b.category === 'Data Structures')
      .sort((a, b) => b.rating - a.rating);
  }, [books]);

  // Filtered recommendations list
  const filteredRecs = useMemo(() => {
    if (selectedFilter === 'btech') {
      return recommendations.filter((r) => r.book.isBTechTextbook);
    }
    if (selectedFilter === 'programming') {
      return recommendations.filter((r) => r.book.isProgramming || r.book.category === 'Programming' || r.book.category === 'Data Structures');
    }
    if (selectedFilter === 'topRated') {
      return recommendations.filter((r) => r.book.rating >= 4.8);
    }
    return recommendations;
  }, [recommendations, selectedFilter]);

  return (
    <div id="recommendations-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Transparent Academic Algorithm
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900">
          Smart Recommended Books
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Personalized curriculum recommendations tailored for engineering and software students. Includes official B.Tech university syllabus textbooks, premier computer science references, and topics tailored to your search history.
        </p>
      </div>

      {/* Quick Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all shadow-2xs ${
            selectedFilter === 'all'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
          }`}
        >
          All Recommendations ({recommendations.length})
        </button>

        <button
          onClick={() => setSelectedFilter('btech')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${
            selectedFilter === 'btech'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>🎓 B.Tech Textbooks ({recommendations.filter((r) => r.book.isBTechTextbook).length})</span>
        </button>

        <button
          onClick={() => setSelectedFilter('programming')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${
            selectedFilter === 'programming'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>💻 Programming Books ({recommendations.filter((r) => r.book.isProgramming || r.book.category === 'Programming' || r.book.category === 'Data Structures').length})</span>
        </button>

        <button
          onClick={() => setSelectedFilter('topRated')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${
            selectedFilter === 'topRated'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>⭐ Top Rated (4.8★+)</span>
        </button>
      </div>

      {/* Algorithm Transparency Signals Card */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-stone-50 rounded-2xl p-5 border border-amber-200/80 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-700" /> Active Personalization Signals ({filteredRecs.length} Matched In Current View)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/80 p-3 rounded-xl border border-stone-200">
            <span className="font-semibold text-stone-700 block flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-600" /> Recent Search Keywords:
            </span>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {searchHistory.length > 0 ? (
                searchHistory.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-medium text-[11px]">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-stone-400 italic">No recent searches yet</span>
              )}
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-stone-200">
            <span className="font-semibold text-stone-700 block flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Active Borrowing Subjects:
            </span>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {borrowings.length > 0 ? (
                Array.from(new Set(borrowings.map((b) => b.bookCategory))).map((c) => (
                  <span key={c} className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-medium text-[11px]">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-stone-400 italic">None currently borrowed</span>
              )}
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-stone-200">
            <span className="font-semibold text-stone-700 block flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Favorite Collections:
            </span>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {favoriteBooks.length > 0 ? (
                Array.from(new Set(favoriteBooks.map((b) => b.category))).map((c) => (
                  <span key={c} className="px-2 py-0.5 bg-rose-100 text-rose-900 rounded font-medium text-[11px]">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-stone-400 italic">No favorites saved yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {filteredRecs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Compass className="w-8 h-8 text-amber-700" />
          </div>
          <h3 className="text-xl font-bold font-serif-classic text-stone-900">
            No specific recommendations for this filter
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Try searching in the catalog for engineering terms like &ldquo;BTech&rdquo;, &ldquo;Programming&rdquo;, &ldquo;Operating Systems&rdquo;, or &ldquo;Algorithms&rdquo;.
          </p>
          <button
            onClick={() => setActiveTab('books')}
            className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            Explore All Books <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecs.map(({ book, reason, matchScore }) => (
            <div key={book.id} className="flex flex-col">
              {/* Recommendation Reason Banner */}
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-100/90 text-amber-950 text-[11px] font-medium border border-amber-200/80 flex items-center justify-between shadow-xs">
                <span className="truncate pr-1">💡 {reason}</span>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded shrink-0">
                  {matchScore} pts
                </span>
              </div>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}

      {/* Curated B.Tech Semester Syllabus Showcase */}
      <div className="pt-6 border-t border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif-classic text-stone-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-700" /> Curated B.Tech Textbooks (Core University Syllabus)
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Direct recommendations for CSE, ECE, Mechanical, and Engineering Mathematics curriculum.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('books')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            See All B.Tech ({btechRecommended.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {btechRecommended.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Curated Programming & Software Development Showcase */}
      <div className="pt-6 border-t border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif-classic text-stone-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-700" /> Essential Programming Textbooks & Code Manuals
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Industry standard references covering Python, Java, Data Structures, Algorithms, and Software Architecture.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('books')}
            className="text-xs font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-1"
          >
            See All Programming ({programmingRecommended.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programmingRecommended.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};
