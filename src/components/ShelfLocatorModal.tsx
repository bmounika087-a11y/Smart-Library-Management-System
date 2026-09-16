import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { MapPin, Navigation, BookOpen, Layers, X, Compass, Check, ArrowRight } from 'lucide-react';

export const ShelfLocatorModal: React.FC = () => {
  const { selectedBookForShelf, setSelectedBookForShelf } = useLibrary();
  const [selectedFloor, setSelectedFloor] = useState<number>(selectedBookForShelf?.shelfFloor || 1);

  if (!selectedBookForShelf) return null;

  const book = selectedBookForShelf;
  const [sectionLetter, shelfNumStr] = book.shelfNumber.split('-');
  const shelfNum = parseInt(shelfNumStr, 10) || 1;

  // Shelf rack simulation
  const racks = Array.from({ length: 24 }, (_, i) => i + 1);

  const floorNames: Record<number, string> = {
    1: 'Ground Floor: Computing & General Knowledge',
    2: 'Floor 2: Mathematics, Physics & Natural Sciences',
    3: 'Floor 3: Literature, Humanities & Classical Archives'
  };

  return (
    <div 
      id="shelf-locator-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={() => setSelectedBookForShelf(null)}
    >
      <div 
        id="shelf-locator-modal"
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-white to-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-500/20">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  Smart Shelf Locator
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Floor {book.shelfFloor} • Aisle {book.shelfNumber}
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif-classic text-stone-900 mt-0.5">
                {book.title}
              </h2>
            </div>
          </div>
          <button
            id="close-shelf-locator"
            onClick={() => setSelectedBookForShelf(null)}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Exact Coordinates Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70">
              <div className="text-xs font-medium text-amber-800">Target Shelf Location</div>
              <div className="text-2xl font-bold font-serif-classic text-amber-900 mt-1 flex items-center gap-2">
                📍 Shelf: {book.shelfNumber}
              </div>
              <div className="text-xs text-amber-700/80 mt-1">
                Aisle {sectionLetter} • Rack Bay #{shelfNumStr}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-xs font-medium text-stone-500">Library Wing & Section</div>
              <div className="text-sm font-bold text-stone-800 mt-1">
                {book.shelfSection}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Call Number: {sectionLetter}-{shelfNum * 12}.{book.publicationYear}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-xs font-medium text-stone-500">Elevation & Level</div>
              <div className="text-sm font-bold text-stone-800 mt-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                Floor {book.shelfFloor}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Tier 3 (Eye Level / Arm Reach)
              </div>
            </div>
          </div>

          {/* Floor Plan Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-stone-400" />
                Interactive Library Floor Map
              </span>
              <div className="flex gap-1.5 bg-stone-100 p-1 rounded-lg">
                {[1, 2, 3].map((floor) => (
                  <button
                    key={floor}
                    id={`floor-tab-${floor}`}
                    onClick={() => setSelectedFloor(floor)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      selectedFloor === floor
                        ? 'bg-white text-stone-900 shadow-sm font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Floor {floor} {book.shelfFloor === floor && '📍'}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-stone-500 mb-3">{floorNames[selectedFloor]}</p>

            {/* Interactive Floorplan Canvas */}
            <div className="border border-stone-300 rounded-xl p-5 bg-[#FAF7F2] relative overflow-hidden">
              {/* Floorplan Layout */}
              <div className="flex flex-col gap-4">
                {/* North wall / Study tables */}
                <div className="flex items-center justify-between pb-3 border-b border-dashed border-stone-300 text-xs font-mono text-stone-400">
                  <span>[ NORTH WINDOW FACING STUDY HALL ]</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-sans font-medium">Quiet Reading Zone</span>
                </div>

                {/* Shelf aisles representation */}
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 py-2">
                  {racks.map((rackNum) => {
                    const rackId = `${sectionLetter}-${rackNum.toString().padStart(2, '0')}`;
                    const isTarget = book.shelfNumber === rackId && selectedFloor === book.shelfFloor;
                    const isSameSection = selectedFloor === book.shelfFloor;

                    return (
                      <div
                        key={rackNum}
                        className={`h-16 rounded-lg p-1.5 flex flex-col justify-between transition-all relative ${
                          isTarget
                            ? 'bg-amber-500 text-white shadow-lg ring-4 ring-amber-300/60 scale-105 z-10 animate-pulse'
                            : isSameSection
                            ? 'bg-white border border-stone-300 text-stone-700 hover:border-amber-400'
                            : 'bg-stone-200/50 border border-stone-200 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span>{sectionLetter}-{rackNum}</span>
                          {isTarget && <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>}
                        </div>
                        <div className="text-[11px] font-bold text-center">
                          {isTarget ? '📍 HERE' : 'Shelf'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Walking directions from main entrance */}
                <div className="pt-3 border-t border-dashed border-stone-300 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="font-semibold text-stone-800">Main Circulation Desk & Entrance</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/50">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Path: Take Staircase A to Floor {book.shelfFloor} → Turn Right to Aisle {book.shelfNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step by Step Navigation Guide */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-600" />
              Walking Instructions to Book
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 pt-1">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">1</span>
                <span>Enter via Central Atrium & follow the East signs towards Wing {sectionLetter}.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">2</span>
                <span>Ascend to Floor {book.shelfFloor} and locate Section: <strong>{book.shelfSection}</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">3</span>
                <span>Find rack <strong>{book.shelfNumber}</strong>; book spine is tagged with ISBN ending in <strong>{book.isbn.slice(-4)}</strong>.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            id="close-locator-btn"
            onClick={() => setSelectedBookForShelf(null)}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Got It, Thanks
          </button>
        </div>
      </div>
    </div>
  );
};
