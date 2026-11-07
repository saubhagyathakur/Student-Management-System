import React from 'react';
import { Eye, Edit2, Trash2, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentTable({
  students,
  loading,
  currentPage,
  limit,
  onViewDetails,
  onEditStudent,
  onDeleteStudent
}) {
  const { isAdmin } = useAuth();

  const getMarksBadgeColor = (marks) => {
    if (marks >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (marks >= 70) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (marks >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-600 border-t-transparent mb-3"></div>
        <p className="text-sm text-slate-500 font-medium">Loading student records...</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No student records found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search criteria, clear your filters, or add a new student.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Sl no</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Roll</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4 text-center">Age</th>
              <th className="py-3 px-4 text-center">Marks</th>
              <th className="py-3 px-4 text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {students.map((student, index) => {
              const serialNo = (currentPage - 1) * limit + index + 1;
              return (
                <tr
                  key={student._id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-400 text-center">
                    {serialNo}
                  </td>

                  {/* Student Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                        <p className="text-xs text-slate-400 sm:hidden">{student.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Roll No */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                    {student.roll || `R-${100 + index}`}
                  </td>

                  {/* Contact / Email / Phone */}
                  <td className="py-3.5 px-4">
                    <p className="text-xs text-slate-700 font-medium">{student.email}</p>
                    {student.phone && (
                      <p className="text-[11px] text-slate-400">{student.phone}</p>
                    )}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {student.department}
                    </span>
                  </td>

                  {/* City */}
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {student.city}
                  </td>

                  {/* Age */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600 text-center">
                    {student.age}
                  </td>

                  {/* Marks */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getMarksBadgeColor(
                        student.marks
                      )}`}
                    >
                      {student.marks}%
                    </span>
                  </td>

                  {/* Action Icons */}
                  <td className="py-3.5 px-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details (Available to both Admin and Student) */}
                      <button
                        onClick={() => onViewDetails(student)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit (Admin only) */}
                      {isAdmin ? (
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="Edit Student Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="p-1.5 text-slate-300 cursor-not-allowed opacity-50"
                          title="Admin permission required to edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete (Admin only) */}
                      {isAdmin ? (
                        <button
                          onClick={() => onDeleteStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="p-1.5 text-slate-300 cursor-not-allowed opacity-50"
                          title="Admin permission required to delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
