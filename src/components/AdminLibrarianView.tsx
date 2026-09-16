import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, BookAvailability } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Users, 
  Clock, 
  Bookmark, 
  BookOpen, 
  AlertCircle,
  RotateCcw,
  Layers,
  MapPin,
  Star
} from 'lucide-react';

export const AdminLibrarianView: React.FC = () => {
  const { 
    books, 
    borrowings, 
    reservations, 
    addBook, 
    editBook, 
    deleteBook, 
    updateBookAvailability,
    resetAllData,
    showToast
  } = useLibrary();

  const [activeAdminTab, setActiveAdminTab] = useState<'catalog' | 'borrowings' | 'reservations' | 'users'>('catalog');
  const [adminSearch, setAdminSearch] = useState('');
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirmBook, setDeleteConfirmBook] = useState<Book | null>(null);

  // Form State for Add Book
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Programming');
  const [newIsbn, setNewIsbn] = useState('');
  const [newYear, setNewYear] = useState(2024);
  const [newRating, setNewRating] = useState(4.8);
  const [newShelf, setNewShelf] = useState('A-25');
  const [newFloor, setNewFloor] = useState(1);
  const [newSection, setNewSection] = useState('Computer Science & Software');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset Add Form
  const resetForm = () => {
    setNewTitle('');
    setNewAuthor('');
    setNewCategory('Programming');
    setNewIsbn('');
    setNewYear(2024);
    setNewRating(4.8);
    setNewShelf('A-25');
    setNewFloor(1);
    setNewSection('Computer Science & Software');
    setNewCover('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80');
    setNewDescription('');
    setFormErrors({});
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!newTitle.trim()) errors.title = 'Title is required';
    if (!newAuthor.trim()) errors.author = 'Author is required';
    if (!newIsbn.trim()) errors.isbn = 'ISBN is required';
    if (!newDescription.trim()) errors.desc = 'Description is required';
    if (!newShelf.trim()) errors.shelf = 'Shelf number is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addBook({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      isbn: newIsbn.trim(),
      publicationYear: Number(newYear),
      rating: Number(newRating),
      reviewCount: 12,
      availability: 'Available',
      shelfNumber: newShelf.trim().toUpperCase(),
      shelfFloor: Number(newFloor),
      shelfSection: newSection,
      coverImage: newCover.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
      description: newDescription.trim(),
      pageCount: 380,
      language: 'English',
      publisher: 'University Academic Press'
    });

    resetForm();
    setAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    editBook(editingBook);
    setEditingBook(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmBook) return;
    deleteBook(deleteConfirmBook.id);
    setDeleteConfirmBook(null);
  };

  const filteredBooks = books.filter((b) => {
    const q = adminSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.shelfNumber.toLowerCase().includes(q)
    );
  });

  const registeredUsers = [
    { id: 'usr-student-01', name: 'Alex Rivera', role: 'Student', email: 'alex.rivera@angles-campus.edu', idNum: 'STU-2026-8842', dept: 'Computer Science & Engineering', activeLoans: borrowings.length },
    { id: 'usr-student-02', name: 'Maya Patel', role: 'Student', email: 'maya.p@angles-campus.edu', idNum: 'STU-2026-7731', dept: 'Mathematics & Computing', activeLoans: 1 },
    { id: 'usr-student-03', name: 'Liam Chen', role: 'Student', email: 'l.chen@angles-campus.edu', idNum: 'STU-2026-6190', dept: 'Applied Physics', activeLoans: 0 },
    { id: 'usr-admin-01', name: 'Dr. Eleanor Vance', role: 'Chief Librarian', email: 'e.vance@library.angles-campus.edu', idNum: 'LIB-HEAD-001', dept: 'Library Administration', activeLoans: 0 }
  ];

  return (
    <div id="admin-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" /> Librarian Administration Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-classic text-stone-900">
            Catalog Management & Circulation Console
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Add new titles, edit records, toggle availability, track live checkout logs, and oversee user holds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-add-book-btn"
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Book
          </button>
          <button
            id="admin-reset-db-btn"
            onClick={resetAllData}
            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors"
            title="Reset to original sample catalog"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          id="admin-tab-catalog"
          onClick={() => setActiveAdminTab('catalog')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeAdminTab === 'catalog'
              ? 'bg-amber-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Book Catalog ({books.length})
        </button>

        <button
          id="admin-tab-borrowings"
          onClick={() => setActiveAdminTab('borrowings')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeAdminTab === 'borrowings'
              ? 'bg-amber-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Active Loans ({borrowings.length})
        </button>

        <button
          id="admin-tab-reservations"
          onClick={() => setActiveAdminTab('reservations')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeAdminTab === 'reservations'
              ? 'bg-amber-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Hold Reservations ({reservations.length})
        </button>

        <button
          id="admin-tab-users"
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeAdminTab === 'users'
              ? 'bg-amber-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Registered Members ({registeredUsers.length})
        </button>
      </div>

      {/* TAB 1: BOOK CATALOG MANAGEMENT */}
      {activeAdminTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search bar inside admin */}
          <div className="relative">
            <input
              id="admin-catalog-search"
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search by title, author, category, ISBN, or shelf number..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-amber-600"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>

          {/* Table of Books */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Book Details</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Shelf Coords</th>
                  <th className="p-3.5">Availability</th>
                  <th className="p-3.5">Borrows</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded shadow-xs border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-stone-900 truncate font-serif-classic text-sm">
                            {book.title}
                          </div>
                          <div className="text-stone-500 truncate">
                            {book.author} ({book.publicationYear})
                          </div>
                          <div className="text-[10px] font-mono text-stone-400">
                            ISBN: {book.isbn}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-medium">
                        {book.category}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-amber-900">
                        📍 Shelf {book.shelfNumber}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Floor {book.shelfFloor}
                      </div>
                    </td>

                    <td className="p-3.5">
                      {/* Availability Quick Toggle */}
                      <select
                        id={`admin-avail-${book.id}`}
                        value={book.availability}
                        onChange={(e) => updateBookAvailability(book.id, e.target.value as BookAvailability)}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          book.availability === 'Available'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : book.availability === 'Borrowed'
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-indigo-50 border-indigo-300 text-indigo-800'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Borrowed">Borrowed</option>
                        <option value="Reserved">Reserved</option>
                      </select>
                    </td>

                    <td className="p-3.5 font-bold text-stone-700">
                      {book.borrowCount}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`edit-book-${book.id}`}
                          onClick={() => setEditingBook(book)}
                          className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Book Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-book-${book.id}`}
                          onClick={() => setDeleteConfirmBook(book)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE BORROWINGS VIEW */}
      {activeAdminTab === 'borrowings' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Loan ID</th>
                <th className="p-3.5">Book Title</th>
                <th className="p-3.5">Borrower</th>
                <th className="p-3.5">Borrow Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Renewals</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {borrowings.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/70">
                  <td className="p-3.5 font-mono text-stone-400">{b.id}</td>
                  <td className="p-3.5 font-bold font-serif-classic text-stone-900">{b.bookTitle}</td>
                  <td className="p-3.5 font-semibold text-stone-700">{b.userId}</td>
                  <td className="p-3.5">{new Date(b.borrowDate).toLocaleDateString()}</td>
                  <td className="p-3.5 font-bold text-amber-900">{new Date(b.dueDate).toLocaleDateString()}</td>
                  <td className="p-3.5">{b.renewCount} / 2</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Active Loan
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ACTIVE RESERVATIONS VIEW */}
      {activeAdminTab === 'reservations' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Reservation ID</th>
                <th className="p-3.5">Book Title</th>
                <th className="p-3.5">Reserved On</th>
                <th className="p-3.5">Queue Order</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/70">
                  <td className="p-3.5 font-mono text-stone-400">{r.id}</td>
                  <td className="p-3.5 font-bold font-serif-classic text-stone-900">{r.bookTitle}</td>
                  <td className="p-3.5">{new Date(r.reservedDate).toLocaleDateString()}</td>
                  <td className="p-3.5 font-bold text-indigo-900">Position #{r.queuePosition}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: USERS DIRECTORY */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">ID Number</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Active Loans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {registeredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/70">
                  <td className="p-3.5 font-bold text-stone-900">{u.name}</td>
                  <td className="p-3.5 font-mono text-stone-500">{u.idNum}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      u.role === 'Student' ? 'bg-amber-100 text-amber-900' : 'bg-purple-100 text-purple-900'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-600">{u.email}</td>
                  <td className="p-3.5 text-stone-600">{u.dept}</td>
                  <td className="p-3.5 font-bold text-amber-900">{u.activeLoans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD BOOK MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-lg font-serif-classic text-stone-900">
                Add New Book to Library Catalog
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Structure and Interpretation of Computer Programs"
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
                {formErrors.title && <p className="text-red-600 text-[11px] mt-0.5">{formErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Author(s) *</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Harold Abelson"
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                  {formErrors.author && <p className="text-red-600 text-[11px] mt-0.5">{formErrors.author}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white"
                  >
                    {['Programming', 'Data Structures', 'Artificial Intelligence', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Fiction', 'History', 'General Knowledge'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">ISBN *</label>
                  <input
                    type="text"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    placeholder="978-0262510875"
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                  {formErrors.isbn && <p className="text-red-600 text-[11px] mt-0.5">{formErrors.isbn}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Initial Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Shelf Number *</label>
                  <input
                    type="text"
                    value={newShelf}
                    onChange={(e) => setNewShelf(e.target.value)}
                    placeholder="A-25"
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                  {formErrors.shelf && <p className="text-red-600 text-[11px] mt-0.5">{formErrors.shelf}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Floor (1, 2, or 3)</label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={newFloor}
                    onChange={(e) => setNewFloor(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Book Description / Synopsis *</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Comprehensive guide to the foundational concepts..."
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
                {formErrors.desc && <p className="text-red-600 text-[11px] mt-0.5">{formErrors.desc}</p>}
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-medium hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  id="submit-add-book"
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold shadow-sm"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BOOK MODAL */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-lg font-serif-classic text-stone-900">
                Edit Book: {editingBook.title}
              </h3>
              <button
                onClick={() => setEditingBook(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={editingBook.author}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white"
                  >
                    {['Programming', 'Data Structures', 'Artificial Intelligence', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Fiction', 'History', 'General Knowledge'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Shelf Number</label>
                  <input
                    type="text"
                    value={editingBook.shelfNumber}
                    onChange={(e) => setEditingBook({ ...editingBook, shelfNumber: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Availability</label>
                  <select
                    value={editingBook.availability}
                    onChange={(e) => setEditingBook({ ...editingBook, availability: e.target.value as BookAvailability })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Borrowed">Borrowed</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-medium hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  id="submit-edit-book"
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif-classic text-stone-900">
                Delete &ldquo;{deleteConfirmBook.title}&rdquo;?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                This will remove the book from the library catalog, delete all active loans or holds linked to it, and update local storage.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmBook(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-book"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
