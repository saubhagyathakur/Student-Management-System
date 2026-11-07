import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  LogIn,
  KeyRound,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onRefresh, loading, onOpenAuthModal }) {
  const { user, isAdmin, isStudent, quickLogin, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student Management</h1>
          <p className="text-xs text-slate-500">MERN Stack with JWT Auth & Role-Based Access Control</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role-Switcher / RBAC Simulator for seamless testing */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">Test Role:</span>
          {isAdmin ? (
            <button
              onClick={() => quickLogin('student')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
              title="Click to switch session to Student (Read-Only role)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin (Click to switch to Student)</span>
            </button>
          ) : (
            <button
              onClick={() => quickLogin('admin')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              title="Click to switch session to Admin (Full CRUD access)"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Student (Click to switch to Admin)</span>
            </button>
          )}
        </div>

        {/* Reload / Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-600' : ''}`} />
        </button>

        {/* Account Button */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">{user.name}</p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Account</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}
