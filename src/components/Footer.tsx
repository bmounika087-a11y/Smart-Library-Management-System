import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, MapPin, Clock, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useLibrary();

  return (
    <footer id="main-footer" className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif-classic text-white tracking-wide">
                  Smart Library
                </h3>
                <p className="text-[11px] text-amber-400 font-sans tracking-wider uppercase">
                  Management System
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              &ldquo;Find Books. Borrow Easily. Learn More.&rdquo; An institutional digital platform designed to bridge physical stacks with modern catalog circulation.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Campus Academic Integrity Certified</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation & Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('books')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Book Catalog & Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Member Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Smart Recommendations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('borrowings')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Active Loans & Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Librarian Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Library Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Campus Library Hours
            </h4>
            <div className="space-y-1.5 text-stone-400">
              <div className="flex justify-between">
                <span>Monday – Friday:</span>
                <span className="font-semibold text-stone-200">07:30 AM – 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-semibold text-stone-200">08:30 AM – 08:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday & Holidays:</span>
                <span className="font-semibold text-stone-200">10:00 AM – 06:00 PM</span>
              </div>
              <div className="flex justify-between pt-1 text-amber-300 font-medium">
                <span>Exam Study Hall:</span>
                <span>24/7 Floor 1 Access</span>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Campus Stack Information
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Athenaeum Central Wing, Bldg 4<br />University Academic Quadrangle</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (555) 328-BOOK (2665)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>circulation@smartlibrary.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Smart Library Management System. Real working web prototype.</p>
          <div className="flex items-center gap-4">
            <span>Data stored in browser local storage</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-stone-400 hover:text-amber-400 transition-colors font-medium"
            >
              Librarian Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
