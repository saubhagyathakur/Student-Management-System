import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function StudentModal({
  isOpen,
  mode, // 'add' or 'edit'
  initialData,
  onClose,
  onSubmit,
  loading
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    marks: '',
    city: '',
    department: '',
    roll: '',
    phone: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        age: initialData.age !== undefined ? initialData.age : '',
        marks: initialData.marks !== undefined ? initialData.marks : '',
        city: initialData.city || '',
        department: initialData.department || '',
        roll: initialData.roll || '',
        phone: initialData.phone || '',
        dateOfBirth: initialData.dateOfBirth || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        age: '',
        marks: '',
        city: '',
        department: '',
        roll: '',
        phone: '',
        dateOfBirth: ''
      });
    }
    setError('');
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      formData.age === '' ||
      formData.marks === '' ||
      !formData.city.trim() ||
      !formData.department.trim()
    ) {
      setError('Please fill in all required fields (Name, Email, Age, Marks, City, Department)');
      return;
    }

    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 120) {
      setError('Please enter a valid age between 3 and 120');
      return;
    }

    const marksNum = Number(formData.marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      setError('Marks must be a number between 0 and 100');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        age: ageNum,
        marks: marksNum
      });
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {mode === 'edit' ? 'Update Student Information' : 'Add New Student'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'edit'
                ? 'Modify the student attributes below and save changes.'
                : 'Enter the details of the student to create their academic record.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Arman Khan"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@sms.edu"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                min="3"
                max="120"
                required
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 20"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Marks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marks (0 - 100) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="marks"
                min="0"
                max="100"
                required
                value={formData.marks}
                onChange={handleChange}
                placeholder="e.g. 88"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number (Optional)
              </label>
              <input
                type="text"
                name="roll"
                value={formData.roll}
                onChange={handleChange}
                placeholder="e.g. CS-101"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone (Optional)
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-600/20 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : mode === 'edit' ? 'Update Student' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
