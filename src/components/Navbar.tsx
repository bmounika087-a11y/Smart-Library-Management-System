import React, { useState } from 'react';
import { useLibrary, NavigationTab } from '../context/LibraryContext';
import { 
  BookOpen, 
  Search, 
  Library, 
  Bookmark, 
  Sparkles, 
  Bell, 
  BarChart3, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  History, 
  Heart,
  ChevronDown,
  LogOut,
  HelpCircle,
  Clock,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    borrowings, 
    notifications, 
    unreadNotificationCount, 
    markAllNotificationsRead,
    clearNotification,
    logout,
    loginAsDemoStudent,
    loginAsDemoLibrarian
  } = useLibrary();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const activeBorrowingsCount = borrowings.length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Library className="w-4 h-4" /> },
    { id: 'books', label: 'Books', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
    { 
      id: 'borrowings', 
      label: 'My Borrowings', 
      icon: <Clock className="w-4 h-4" />,
      badge: activeBorrowingsCount > 0 ? activeBorrowingsCount : undefined
    },
    { id: 'recommendations', label: 'Recommendations', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Seal */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-amber-200 flex items-center justify-center shadow-md border border-amber-600/40 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-crest text-lg font-bold tracking-wider text-stone-900 group-hover:text-amber-900 transition-colors">
                  SMART LIBRARY
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300/60">
                  SYSTEM
                </span>
              </div>
              <p className="text-[11px] font-serif-classic italic text-stone-500">
                Angles Campus • Find Books. Borrow Easily.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-900 text-amber-50 shadow-sm'
                      : 'text-stone-700 hover:text-amber-900 hover:bg-stone-200/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-amber-500 text-stone-950' : 'bg-amber-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Favorites Link */}
            <button
              id="nav-favorites-btn"
              onClick={() => handleNavClick('favorites')}
              className={`p-2 rounded-xl border transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'text-stone-600 border-stone-200/80 hover:bg-stone-100 hover:text-stone-900'
              }`}
              title="My Favorites"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Notification Bell with Badge & Popover */}
            <div className="relative">
              <button
                id="nav-notifications-btn"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                }}
                className={`relative p-2 rounded-xl border transition-colors ${
                  notificationsOpen
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'text-stone-600 border-stone-200/80 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notificationsOpen && (
                <div 
                  id="notifications-popover"
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">Notifications</span>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                        {notifications.length}
                      </span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        id="mark-all-read-btn"
                        onClick={markAllNotificationsRead}
                        className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-stone-400 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`py-3 px-1 flex items-start gap-3 transition-colors ${
                            notif.read ? 'opacity-70' : 'bg-amber-50/40 rounded-lg'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-stone-900 truncate">
                                {notif.title}
                              </h4>
                              <span className="text-[10px] text-stone-400">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                          <button
                            onClick={() => clearNotification(notif.id)}
                            className="text-stone-300 hover:text-stone-600 p-1 rounded"
                            title="Dismiss"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown or Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-btn"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-stone-200/80 bg-white hover:border-amber-400 transition-colors"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden md:block text-left pr-1">
                    <div className="text-xs font-bold text-stone-900 leading-none">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-medium text-amber-800 capitalize">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div 
                    id="user-menu-dropdown"
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in"
                  >
                    <div className="p-2 border-b border-stone-100">
                      <div className="text-xs font-bold text-stone-900">{currentUser.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{currentUser.studentId}</div>
                      <div className="text-[11px] text-stone-500 truncate">{currentUser.department}</div>
                    </div>

                    <div className="py-2 space-y-1">
                      <button
                        id="user-menu-dashboard"
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4 text-stone-400" /> User Dashboard
                      </button>
                      <button
                        id="user-menu-borrowings"
                        onClick={() => handleNavClick('borrowings')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-stone-400" /> My Borrowings ({activeBorrowingsCount})
                      </button>
                      <button
                        id="user-menu-history"
                        onClick={() => handleNavClick('history')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg flex items-center gap-2"
                      >
                        <History className="w-4 h-4 text-stone-400" /> Reading History
                      </button>
                      <button
                        id="user-menu-admin"
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" /> Librarian Console
                      </button>
                    </div>

                    {/* Fast Switch Persona for Hackathon Demo */}
                    <div className="pt-2 border-t border-stone-100 text-[11px] space-y-1">
                      <div className="text-[10px] uppercase font-bold text-stone-400 px-2">
                        Demo Role Switch
                      </div>
                      <div className="flex gap-1.5 px-1">
                        <button
                          onClick={loginAsDemoStudent}
                          className={`flex-1 py-1 rounded text-center font-medium border ${
                            currentUser.role === 'student'
                              ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          onClick={loginAsDemoLibrarian}
                          className={`flex-1 py-1 rounded text-center font-medium border ${
                            currentUser.role === 'librarian'
                              ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          Librarian
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-stone-100">
                      <button
                        id="user-logout-btn"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-stone-200/80 text-stone-700 hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="xl:hidden border-t border-stone-200 bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-amber-900 text-white'
                    : 'text-stone-800 hover:bg-stone-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-200">
            <button
              id="mobile-reading-history"
              onClick={() => handleNavClick('history')}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 text-stone-700 hover:bg-stone-200/60"
            >
              <History className="w-4 h-4" /> Reading History
            </button>
            <button
              id="mobile-favorites"
              onClick={() => handleNavClick('favorites')}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 text-stone-700 hover:bg-stone-200/60"
            >
              <Heart className="w-4 h-4" /> Favorites
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
