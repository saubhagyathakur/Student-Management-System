import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  LogOut,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  School,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Logo & Name */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950/60">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/20">
          A
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-white tracking-wide text-sm">AdminKit Admin</span>
          <span className="text-[11px] text-sky-400 font-medium">SMS Portal v1.0</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </nav>
        </div>

        {/* Academics Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Academics</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('classes')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'classes'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Classes</span>
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'teachers'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teachers</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-sky-300" />
              <span className="flex-1 text-left">Students</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-400/20 text-sky-200 rounded-full">
                Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('subjects')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'subjects'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Subjects</span>
            </button>
          </nav>
        </div>

        {/* Exam Center */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Assessments
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('exams')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'exams'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Exam Center</span>
            </button>
          </nav>
        </div>
      </div>

      {/* User Status & RBAC Badge */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium text-sm border border-slate-600">
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Guest User'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> Admin (Full Access)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <UserCheck className="w-3 h-3" /> Student (Read Only)
                </span>
              )}
            </div>
          </div>
        </div>

        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Session</span>
          </button>
        )}
      </div>
    </aside>
  );
}
