/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { BookCatalogView } from './components/BookCatalogView';
import { DashboardView } from './components/DashboardView';
import { MyBorrowingsView } from './components/MyBorrowingsView';
import { RecommendationsView } from './components/RecommendationsView';
import { ReadingHistoryView } from './components/ReadingHistoryView';
import { FavoritesView } from './components/FavoritesView';
import { AdminLibrarianView } from './components/AdminLibrarianView';
import { BookDetailModal } from './components/BookDetailModal';
import { ShelfLocatorModal } from './components/ShelfLocatorModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useLibrary();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage />;
      case 'books':
      case 'search':
        return <BookCatalogView />;
      case 'dashboard':
        return <DashboardView />;
      case 'borrowings':
        return <MyBorrowingsView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'history':
        return <ReadingHistoryView />;
      case 'favorites':
        return <FavoritesView />;
      case 'admin':
        return <AdminLibrarianView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/60 text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Sticky Global Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Global Modals */}
      <BookDetailModal />
      <ShelfLocatorModal />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}

