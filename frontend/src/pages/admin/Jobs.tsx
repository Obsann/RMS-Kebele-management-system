import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { Plus, Calendar, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function AdminJobs() {
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);

  const jobs = {
    pending: [
      { id: 1, title: 'Fix leaking pipe', unit: 'A-101', priority: 'high', category: 'Plumbing', createdDate: '2025-11-19' },
      { id: 2, title: 'Replace light bulbs', unit: 'B-205', priority: 'low', category: 'Electrical', createdDate: '2025-11-19' },
      { id: 3, title: 'AC not cooling', unit: 'C-312', priority: 'high', category: 'HVAC', createdDate: '2025-11-18' },
    ],
    'in-progress': [
      { id: 4, title: 'Install new outlets', unit: 'A-204', priority: 'medium', category: 'Electrical', assignedTo: 'David Lee', startDate: '2025-11-18' },
      { id: 5, title: 'Paint apartment walls', unit: 'B-108', priority: 'low', category: 'General', assignedTo: 'Michael Brown', startDate: '2025-11-17' },
    ],
    completed: [
      { id: 6, title: 'Fix door lock', unit: 'C-201', priority: 'medium', category: 'Maintenance', assignedTo: 'John Martinez', completedDate: '2025-11-17' },
      { id: 7, title: 'Clean pool area', unit: 'Common Area', priority: 'low', category: 'Cleaning', assignedTo: 'James Wilson', completedDate: '2025-11-16' },
    ],
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    unit: '',
    assignedTo: '',
  });

  const handleCreateJob = () => {
    if (!formData.title || !formData.category || !formData.unit) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Job created successfully!');
    setShowCreateJobModal(false);
    setFormData({ title: '', description: '', category: '', priority: 'medium', unit: '', assignedTo: '' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>Job & Task Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all maintenance jobs</p>
          </div>
          <button
            onClick={() => setShowCreateJobModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Pending Jobs</p>
            <p className="text-gray-900">{jobs.pending.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">In Progress</p>
            <p className="text-gray-900">{jobs['in-progress'].length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Completed Today</p>
            <p className="text-gray-900">{jobs.completed.length}</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Pending</h3>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                {jobs.pending.length}
              </span>
            </div>
            <div className="space-y-3">
              {jobs.pending.map((job) => (
                <div key={job.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-900">{job.title}</h4>
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(job.priority)}`} title={job.priority}></span>
                  </div>
                  <p className="text-gray-600 mb-3">{job.unit}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {job.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{job.createdDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">In Progress</h3>
              <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
                {jobs['in-progress'].length}
              </span>
            </div>
            <div className="space-y-3">
              {jobs['in-progress'].map((job) => (
                <div key={job.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-900">{job.title}</h4>
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(job.priority)}`} title={job.priority}></span>
                  </div>
                  <p className="text-gray-600 mb-3">{job.unit}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-xs">{job.assignedTo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {job.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">{job.startDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Completed</h3>
              <span className="px-3 py-1 bg-green-200 text-green-700 rounded-full">
                {jobs.completed.length}
              </span>
            </div>
            <div className="space-y-3">
              {jobs.completed.map((job) => (
                <div key={job.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-900">{job.title}</h4>
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(job.priority)}`} title={job.priority}></span>
                  </div>
                  <p className="text-gray-600 mb-3">{job.unit}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-xs">{job.assignedTo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {job.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">{job.completedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      <Modal
        isOpen={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
        title="Create New Job"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Fix leaking pipe"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Provide detailed description of the job..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="General">General Maintenance</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Landscaping">Landscaping</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Unit Number *</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A-101"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Assign To (Optional)</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Assign Later</option>
                <option value="John Martinez">John Martinez</option>
                <option value="David Lee">David Lee</option>
                <option value="Robert Chen">Robert Chen</option>
                <option value="Michael Brown">Michael Brown</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreateJob}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Job
            </button>
            <button
              onClick={() => setShowCreateJobModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
