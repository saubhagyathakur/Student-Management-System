import React from 'react';
import { X, Mail, Phone, MapPin, Building, Calendar, Award, User } from 'lucide-react';

export default function StudentDetailModal({ isOpen, student, onClose }) {
  if (!isOpen || !student) return null;

  const getGrade = (marks) => {
    if (marks >= 90) return { grade: 'A+', label: 'Outstanding', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (marks >= 80) return { grade: 'A', label: 'Excellent', color: 'text-teal-600 bg-teal-50 border-teal-200' };
    if (marks >= 70) return { grade: 'B', label: 'Good', color: 'text-sky-600 bg-sky-50 border-sky-200' };
    if (marks >= 60) return { grade: 'C', label: 'Average', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { grade: 'F', label: 'Needs Improvement', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const gradeInfo = getGrade(student.marks);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-sky-500 to-indigo-600 p-4 flex justify-between items-start">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-sm">
            Student Profile
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar & Header */}
        <div className="px-6 pb-6 relative">
          <div className="-mt-12 mb-4 flex justify-between items-end">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-100">
              <div className="w-full h-full rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-2xl">
                {student.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-lg border text-xs font-bold ${gradeInfo.color}`}>
              Grade {gradeInfo.grade} ({gradeInfo.label})
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
          <p className="text-xs text-slate-500 font-medium">Roll: {student.roll || 'N/A'}</p>

          {/* Details Grid */}
          <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-xs">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500 w-24">Email:</span>
              <span className="font-medium text-slate-800">{student.email}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500 w-24">Department:</span>
              <span className="font-medium text-slate-800">{student.department}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500 w-24">City:</span>
              <span className="font-medium text-slate-800">{student.city}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500 w-24">Age:</span>
              <span className="font-medium text-slate-800">{student.age} years old</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Award className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500 w-24">Marks:</span>
              <span className="font-bold text-sky-600 text-sm">{student.marks} / 100</span>
            </div>

            {student.phone && (
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-500 w-24">Phone:</span>
                <span className="font-medium text-slate-800">{student.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-500 w-24">Registered:</span>
              <span className="font-medium text-slate-800">
                {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
