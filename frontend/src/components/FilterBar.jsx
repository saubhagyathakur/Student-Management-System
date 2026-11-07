import React from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Plus,
  Lock,
  Building,
  MapPin,
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  onOpenAddModal
}) {
  const { isAdmin } = useAuth();

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil Engineering',
    'Arts',
    'Business'
  ];

  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Kolkata',
    'Hyderabad',
    'Chennai',
    'Chicago',
    'New York',
    'Boston',
    'San Francisco',
    'Seattle'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 space-y-4">
      {/* Top Row: Search + Primary Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search by name, email, roll or department..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-sky-600/20 transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-lg border border-slate-200 cursor-not-allowed opacity-75"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Add Student</span>
              </button>
              <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block z-20 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg">
                Admin role required to add students. Switch to Admin above to test.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* City Filter */}
        <div>
          <label className="block text-slate-600 font-medium mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> City
            </span>
          </label>
          <select
            value={filters.city || ''}
            onChange={(e) => onFilterChange('city', e.target.value)}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-slate-600 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-400" /> Department
            </span>
          </label>
          <select
            value={filters.department || ''}
            onChange={(e) => onFilterChange('department', e.target.value)}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Marks Greater Than (marks > X) */}
        <div>
          <label className="block text-slate-600 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3 text-slate-400" /> Marks &gt;
            </span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 75"
            value={filters.marksGreaterThan || ''}
            onChange={(e) => onFilterChange('marksGreaterThan', e.target.value)}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Min Age */}
        <div>
          <label className="block text-slate-600 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" /> Min Age
            </span>
          </label>
          <input
            type="number"
            min="3"
            max="120"
            placeholder="Min Age"
            value={filters.minAge || ''}
            onChange={(e) => onFilterChange('minAge', e.target.value)}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Max Age */}
        <div>
          <label className="block text-slate-600 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" /> Max Age
            </span>
          </label>
          <input
            type="number"
            min="3"
            max="120"
            placeholder="Max Age"
            value={filters.maxAge || ''}
            onChange={(e) => onFilterChange('maxAge', e.target.value)}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Sort by Marks */}
        <div>
          <label className="block text-slate-600 font-medium mb-1">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-400" /> Sort by Marks
            </span>
          </label>
          <select
            value={
              filters.sortBy === 'marks'
                ? filters.order === 'asc'
                  ? 'marks-asc'
                  : 'marks-desc'
                : ''
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'marks-desc') {
                onFilterChange('sortBy', 'marks');
                onFilterChange('order', 'desc');
              } else if (val === 'marks-asc') {
                onFilterChange('sortBy', 'marks');
                onFilterChange('order', 'asc');
              } else {
                onFilterChange('sortBy', '');
                onFilterChange('order', '');
              }
            }}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
          >
            <option value="">Default (Newest)</option>
            <option value="marks-desc">Highest Marks (Desc)</option>
            <option value="marks-asc">Lowest Marks (Asc)</option>
          </select>
        </div>
      </div>

      {/* Active filters / Reset button */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-600">Filters:</span>
          {filters.city && (
            <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
              City: {filters.city}
            </span>
          )}
          {filters.department && (
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
              Dept: {filters.department}
            </span>
          )}
          {filters.marksGreaterThan && (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
              Marks &gt; {filters.marksGreaterThan}
            </span>
          )}
          {(filters.minAge || filters.maxAge) && (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Age: {filters.minAge || 0} - {filters.maxAge || 120}
            </span>
          )}
          {filters.sortBy === 'marks' && (
            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
              Sorted by Marks ({filters.order})
            </span>
          )}
        </div>

        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>
    </div>
  );
}
