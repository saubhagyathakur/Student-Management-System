import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({ isOpen, student, onClose, onConfirm, loading }) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-800">Delete Student Record?</h3>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to permanently remove{' '}
            <span className="font-semibold text-slate-800">{student.name}</span> (
            <span className="font-medium text-slate-600">{student.email}</span>)?
          </p>
          <p className="text-[11px] text-rose-500 mt-1 font-medium">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm shadow-rose-600/20 disabled:opacity-50 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{loading ? 'Deleting...' : 'Yes, Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
