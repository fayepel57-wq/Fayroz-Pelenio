import React, { useState } from 'react';
import { AssistanceCategory, NeedPriority, VerificationStatus } from '../types';
import { 
  Search, X, SlidersHorizontal, Stethoscope, Receipt, Utensils, Home, 
  GraduationCap, BookmarkCheck, Info, AlertTriangle, Clock 
} from 'lucide-react';

interface FiltersBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: AssistanceCategory | 'all';
  setSelectedCategory: (cat: AssistanceCategory | 'all') => void;
  selectedPriority: NeedPriority | 'all';
  setSelectedPriority: (priority: NeedPriority | 'all') => void;
  selectedVerification: VerificationStatus | 'all';
  setSelectedVerification: (status: VerificationStatus | 'all') => void;
  onlyUrgent: boolean;
  setOnlyUrgent: (urgent: boolean) => void;
  onlyFollowed: boolean;
  setOnlyFollowed: (followed: boolean) => void;
  followedCount: number;
  totalFilteredCount: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  selectedVerification,
  setSelectedVerification,
  onlyUrgent,
  setOnlyUrgent,
  onlyFollowed,
  setOnlyFollowed,
  followedCount,
  totalFilteredCount,
}) => {
  const [showPrioritizationExplainer, setShowPrioritizationExplainer] = useState(false);

  const categories: { id: AssistanceCategory | 'all'; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Needs' },
    { id: 'medical', label: 'Medical Needs', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'bills', label: 'Bills & Utilities', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'food', label: 'Food & Groceries', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'housing', label: 'Housing & Shelter', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  ];

  const priorityOptions: { id: NeedPriority | 'all'; label: string; sub: string }[] = [
    { id: 'all', label: 'All Priorities', sub: 'All requests' },
    { id: 'urgent', label: 'Urgent', sub: '24-72h crisis' },
    { id: 'significant', label: 'Significant', sub: '1-2 week barrier' },
    { id: 'ongoing', label: 'Ongoing', sub: 'Sustained aid' },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Secondary Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location (e.g. Tondo, Marikina), or need..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Toggles: Followed & Urgency */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Followed Only Toggle */}
          <button
            onClick={() => setOnlyFollowed(!onlyFollowed)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              onlyFollowed
                ? 'bg-emerald-50 text-[#14532D] border-emerald-300 font-semibold shadow-2xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <BookmarkCheck className={`w-3.5 h-3.5 ${onlyFollowed ? 'text-[#14532D]' : 'text-stone-400'}`} />
            <span>Followed Requests ({followedCount})</span>
          </button>

          {/* Verification Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value as VerificationStatus | 'all')}
              className="text-xs bg-white border border-stone-200 text-stone-700 py-2 pl-3 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
            >
              <option value="all">All Verification</option>
              <option value="barangay_documented">Barangay Documented</option>
              <option value="community_endorsed">Community Endorsed</option>
              <option value="under_review">Under Review</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400">
              <SlidersHorizontal className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Need-Based Prioritization Selector */}
      <div className="bg-stone-100/70 p-2.5 rounded-xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-800">
            Need Priority:
          </span>
          <div className="flex items-center gap-1">
            {priorityOptions.map((opt) => {
              const isActive = selectedPriority === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPriority(opt.id)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#14532D] text-white shadow-2xs font-semibold'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/70'
                  }`}
                  title={opt.sub}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setShowPrioritizationExplainer(!showPrioritizationExplainer)}
          className="text-[11px] text-[#14532D] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5" />
          <span>How need is prioritized (Consequence rules)</span>
        </button>
      </div>

      {/* Prioritization Explainer Drawer */}
      {showPrioritizationExplainer && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Transparent Prioritization Rules (Demonstration Framework)</span>
            </span>
            <button
              onClick={() => setShowPrioritizationExplainer(false)}
              className="text-amber-800 hover:text-amber-950 text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
          <p className="leading-relaxed text-stone-700">
            Unlike platforms that rank campaigns by virality or funding amounts, Bayanihan Circle evaluates <strong>urgency and real-world consequences (time-to-harm)</strong>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
            <div className="p-2.5 bg-white rounded-lg border border-amber-200/60">
              <strong className="text-rose-900 block font-bold mb-1">1. Urgent (24-72 hours):</strong>
              Immediate hazard to human life, vital health (e.g. dialysis copay, essential asthma medication), or immediate power/water disconnection.
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-amber-200/60">
              <strong className="text-amber-900 block font-bold mb-1">2. Significant (1-2 weeks):</strong>
              Livelihood stoppage (e.g. tricycle repair), storm roof leaks, or semester examination clearance where delays cause severe compounding setbacks.
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-amber-200/60">
              <strong className="text-stone-900 block font-bold mb-1">3. Ongoing:</strong>
              Chronic maintenance supplies, regular monthly nutritional support, or community pantry restocking.
            </div>
          </div>
          <div className="text-[10px] text-amber-800/80 pt-1 italic">
            Notice: This is a transparent demonstration prototype. These rules are illustrative and not an officially certified clinical or welfare assessment.
          </div>
        </div>
      )}

      {/* Row 3: Interactive Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#14532D] text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Summary */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
        <div>
          Showing <span className="font-semibold text-stone-800 tabular-nums">{totalFilteredCount}</span> requests
          {selectedCategory !== 'all' && <span> in this category</span>}
          {selectedPriority !== 'all' && <span className="font-semibold text-stone-700"> ({selectedPriority.toUpperCase()} priority)</span>}
          {onlyFollowed && <span className="font-semibold text-stone-700"> (Followed only)</span>}
          {searchQuery && <span> matching "{searchQuery}"</span>}
        </div>
        {(selectedCategory !== 'all' || selectedPriority !== 'all' || selectedVerification !== 'all' || searchQuery || onlyUrgent || onlyFollowed) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedPriority('all');
              setSelectedVerification('all');
              setSearchQuery('');
              setOnlyUrgent(false);
              setOnlyFollowed(false);
            }}
            className="text-[#14532D] hover:underline font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
