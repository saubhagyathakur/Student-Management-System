import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { studentApi } from './services/api';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import StudentTable from './components/StudentTable';
import Pagination from './components/Pagination';
import StudentModal from './components/StudentModal';
import StudentDetailModal from './components/StudentDetailModal';
import DeleteModal from './components/DeleteModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import {
  Users,
  GraduationCap,
  Award,
  Building,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const { user, isAdmin, isStudent, isAuthenticated, quickLogin } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState('students');

  // Student list state
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    department: '',
    marksGreaterThan: '',
    minAge: '',
    maxAge: '',
    sortBy: '',
    order: ''
  });

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentModalMode, setStudentModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // If user is not yet logged in on first visit, auto-login as Admin demo
  useEffect(() => {
    if (!isAuthenticated) {
      quickLogin('admin').catch(() => {
        // if fails, open auth modal
        setIsAuthModalOpen(true);
      });
    }
  }, [isAuthenticated]);

  // Fetch students from backend API
  const fetchStudents = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await studentApi.getStudents({
        ...filters,
        page: currentPage,
        limit
      });

      if (res.success) {
        setStudents(res.data);
        setTotalStudents(res.totalStudents);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      showToast(err.message || 'Error loading student data', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, limit, isAuthenticated]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Filter change handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      city: '',
      department: '',
      marksGreaterThan: '',
      minAge: '',
      maxAge: '',
      sortBy: '',
      order: ''
    });
    setCurrentPage(1);
  };

  // Modals triggers
  const handleOpenAddModal = () => {
    if (!isAdmin) {
      showToast('Action forbidden: Only Admin can add student records', 'warning');
      return;
    }
    setStudentModalMode('add');
    setSelectedStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    if (!isAdmin) {
      showToast('Action forbidden: Only Admin can edit student records', 'warning');
      return;
    }
    setStudentModalMode('edit');
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    if (!isAdmin) {
      showToast('Action forbidden: Only Admin can delete student records', 'warning');
      return;
    }
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetailModal = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  // Modal action handlers
  const handleSaveStudent = async (formData) => {
    setActionLoading(true);
    try {
      if (studentModalMode === 'edit') {
        const res = await studentApi.updateStudent(selectedStudent._id, formData);
        showToast(res.message || 'Student updated successfully!', 'success');
      } else {
        const res = await studentApi.createStudent(formData);
        showToast(res.message || 'Student created successfully!', 'success');
      }
      setIsStudentModalOpen(false);
      fetchStudents();
    } catch (err) {
      showToast(err.message || 'Failed to save student', 'error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    setActionLoading(true);
    try {
      const res = await studentApi.deleteStudent(selectedStudent._id);
      showToast(res.message || 'Student record deleted', 'success');
      setIsDeleteModalOpen(false);
      fetchStudents();
    } catch (err) {
      showToast(err.message || 'Failed to delete student', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate quick metrics for Dashboard view
  const avgMarks =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + (s.marks || 0), 0) / students.length)
      : 0;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <Navbar
          onRefresh={fetchStudents}
          loading={loading}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Page Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {/* RBAC Notification Banner */}
          <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isAdmin
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}
              >
                {isAdmin ? (
                  <GraduationCap className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Active Session Role:{' '}
                  <span
                    className={`font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full ${
                      isAdmin
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user?.role || 'Guest'}
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAdmin
                    ? 'Full Administrator Privileges: You can Create, Read, Update, and Delete student records.'
                    : 'Student Role: Read-only access to records. Modifications are restricted per RBAC specification.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <span className="text-xs text-slate-400 hidden sm:inline">Try role:</span>
              <button
                onClick={() => quickLogin(isAdmin ? 'student' : 'admin')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span>Switch to {isAdmin ? 'Student (Read-Only)' : 'Admin (Full CRUD)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tab 1: Students Management */}
          {activeTab === 'students' && (
            <div>
              {/* Header Title & Subtitle */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Students Directory</h2>
                  <p className="text-xs text-slate-500">
                    Search, filter by city or department, filter marks, age range, sort, and paginate.
                  </p>
                </div>
              </div>

              {/* Filter, Search & Action Bar */}
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                onOpenAddModal={handleOpenAddModal}
              />

              {/* Data Table */}
              <StudentTable
                students={students}
                loading={loading}
                currentPage={currentPage}
                limit={limit}
                onViewDetails={handleOpenDetailModal}
                onEditStudent={handleOpenEditModal}
                onDeleteStudent={handleOpenDeleteModal}
              />

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalStudents={totalStudents}
                limit={limit}
                onPageChange={(page) => setCurrentPage(page)}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {/* Tab 2: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">System Dashboard</h2>
                <p className="text-xs text-slate-500">Overview of student metrics and departments</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Total Enrolled</p>
                    <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Average Marks</p>
                    <p className="text-2xl font-bold text-slate-800">{avgMarks}%</p>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Departments</p>
                    <p className="text-2xl font-bold text-slate-800">5 Active</p>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Pass Rate</p>
                    <p className="text-2xl font-bold text-slate-800">92%</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Quick Navigation</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Go directly to student directory to view, filter, add, edit, or delete student records.
                </p>
                <button
                  onClick={() => setActiveTab('students')}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Go to Students Directory
                </button>
              </div>
            </div>
          )}

          {/* Other Academics Tabs Placeholder */}
          {['classes', 'teachers', 'subjects', 'exams'].includes(activeTab) && (
            <div className="p-12 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 capitalize">{activeTab} Module</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                The primary assignment module is the <span className="font-semibold text-sky-600">Students</span> directory.
              </p>
              <button
                onClick={() => setActiveTab('students')}
                className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Return to Students Directory
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        mode={studentModalMode}
        initialData={selectedStudent}
        onClose={() => setIsStudentModalOpen(false)}
        onSubmit={handleSaveStudent}
        loading={actionLoading}
      />

      <StudentDetailModal
        isOpen={isDetailModalOpen}
        student={selectedStudent}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        student={selectedStudent}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
