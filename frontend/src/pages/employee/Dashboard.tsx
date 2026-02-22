import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmployeeNotification from '../employee/Notification';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeDashboard() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobNotes, setJobNotes] = useState('');

  const myJobs = [
    { id: 1, title: 'Fix leaking pipe', unit: 'A-101', priority: 'high', status: 'in-progress' as const, assignedDate: '2025-11-18', dueDate: '2025-11-20' },
    { id: 2, title: 'Replace ceiling fan', unit: 'B-305', priority: 'medium', status: 'pending' as const, assignedDate: '2025-11-19', dueDate: '2025-11-22' },
    { id: 3, title: 'Install new outlet', unit: 'A-204', priority: 'medium', status: 'in-progress' as const, assignedDate: '2025-11-18', dueDate: '2025-11-21' },
    { id: 4, title: 'AC maintenance checkup', unit: 'C-110', priority: 'low', status: 'pending' as const, assignedDate: '2025-11-19', dueDate: '2025-11-25' },
  ];

  const completedJobs = [
    { id: 5, title: 'Fix door lock', unit: 'C-201', completedDate: '2025-11-17' },
    { id: 6, title: 'Replace light bulbs', unit: 'B-108', completedDate: '2025-11-16' },
    { id: 7, title: 'Repair window screen', unit: 'A-305', completedDate: '2025-11-15' },
  ];

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setJobNotes(''); // Clear notes for new selection
    setShowJobModal(true);
  };

  const handleUpdateStatus = (status: string) => {
    toast.success(`Job status updated to ${status}!`);
    setShowJobModal(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1> {/*  FIXED: Added Styles */}
          <p className="text-gray-600 mt-1">View and manage your assigned tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-gray-600 text-sm">Active Jobs</p>
                <p className="text-xl font-bold text-gray-900">{myJobs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-xl font-bold text-gray-900">{completedJobs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-gray-600 text-sm">High Priority</p>
                <p className="text-xl font-bold text-gray-900">{myJobs.filter(j => j.priority === 'high').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Active Jobs</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {myJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleViewJob(job)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-medium mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-500">Unit {job.unit}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(job.priority)} capitalize`}>
                    {job.priority}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <StatusBadge status={job.status} size="sm" />
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {job.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Completed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recently Completed</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {completedJobs.map((job) => (
              <div key={job.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium mb-1">{job.title}</p>
                  <p className="text-sm text-gray-500">Unit {job.unit}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status="completed" size="sm" />
                  <p className="text-xs text-gray-400 mt-1">{job.completedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        title="Job Details"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedJob.title}</h3>
              <p className="text-gray-600">Location: Unit {selectedJob.unit}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Priority</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedJob.priority)} capitalize`}>
                  {selectedJob.priority}
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Date</label>
                <p className="text-sm text-gray-900 font-medium">{selectedJob.dueDate}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Progress</label>
              <div className="flex gap-3">
                {selectedJob.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus('in-progress')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Start Job
                  </button>
                )}
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                  Mark as Completed
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Notes</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                rows={3}
                value={jobNotes} 
                onChange={(e) => setJobNotes(e.target.value)} 
                placeholder="Describe the work done or parts replaced..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  toast.success('Notes saved successfully!');
                  setShowJobModal(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black font-medium transition-colors"
              >
                Save & Exit
              </button>
              <button
                onClick={() => setShowJobModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}