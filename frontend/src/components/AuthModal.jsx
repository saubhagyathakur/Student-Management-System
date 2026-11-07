import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, UserCheck, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { user, login, register, logout, quickLogin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Please fill all fields');
        }
        await register(formData);
      } else {
        if (!formData.email || !formData.password) {
          throw new Error('Please provide email and password');
        }
        await login(formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(role);
      onClose();
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {user
                ? 'Account Profile'
                : isRegisterMode
                ? 'Register New User'
                : 'Sign In to Portal'}
            </h3>
            <p className="text-xs text-slate-500">
              {user
                ? 'Manage your session and RBAC role.'
                : 'Authenticate to access protected features.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick RBAC Switcher / Preset Demo Logins */}
          <div className="mb-5 p-3.5 bg-sky-50 border border-sky-100 rounded-xl">
            <p className="text-xs font-bold text-sky-900 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-sky-600" />
              <span>Instant Demo Accounts (One-Click RBAC):</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuick('admin')}
                disabled={loading}
                className="p-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuick('student')}
                disabled={loading}
                className="p-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Student Login</span>
              </button>
            </div>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Name:</span>
                  <span className="font-semibold text-slate-800">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-semibold text-slate-800">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Role:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      user.role === 'admin'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2 px-4 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 transition-colors ${
                    !isRegisterMode
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 transition-colors ${
                    isRegisterMode
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Register User
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {isRegisterMode && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@sms.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {isRegisterMode && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Role Selection
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                    >
                      <option value="student">Student (Read-Only Records)</option>
                      <option value="admin">Admin (Create, Update & Delete Records)</option>
                    </select>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                  >
                    {isRegisterMode ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>{loading ? 'Registering...' : 'Create Account'}</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
