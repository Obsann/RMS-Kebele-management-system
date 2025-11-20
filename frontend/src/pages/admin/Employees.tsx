import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { Plus, Search, Filter, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function AdminEmployees() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const employees = [
    { id: 1, name: 'John Martinez', email: 'john.m@pms.com', phone: '+1 555-0201', category: 'Plumbing', assignedJobs: 5, status: 'active' as const },
    { id: 2, name: 'David Lee', email: 'david.l@pms.com', phone: '+1 555-0202', category: 'Electrical', assignedJobs: 3, status: 'active' as const },
    { id: 3, name: 'Robert Chen', email: 'robert.c@pms.com', phone: '+1 555-0203', category: 'HVAC', assignedJobs: 7, status: 'active' as const },
    { id: 4, name: 'Michael Brown', email: 'michael.b@pms.com', phone: '+1 555-0204', category: 'General Maintenance', assignedJobs: 4, status: 'active' as const },
    { id: 5, name: 'James Wilson', email: 'james.w@pms.com', phone: '+1 555-0205', category: 'Landscaping', assignedJobs: 2, status: 'inactive' as const },
  ];

  const jobCategories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'General Maintenance',
    'Landscaping',
    'Cleaning',
    'Security',
    'Carpentry',
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
  });

  const handleAddEmployee = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Employee added successfully!');
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', category: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1>Employee Management</h1>
            <p className="text-gray-600 mt-1">Manage maintenance and service staff</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total Employees</p>
            <p className="text-gray-900">52</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Active Jobs</p>
            <p className="text-gray-900">21</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Categories</p>
            <p className="text-gray-900">{jobCategories.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, category, or email..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              {jobCategories.map((category, idx) => (
                <option key={idx} value={category}>{category}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-gray-600">Phone</th>
                  <th className="px-6 py-3 text-left text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left text-gray-600">Assigned Jobs</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600">{employee.name.charAt(0)}</span>
                        </div>
                        <span className="text-gray-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{employee.email}</td>
                    <td className="px-6 py-4 text-gray-600">{employee.phone}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {employee.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{employee.assignedJobs}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={employee.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-gray-600">Showing 1 to 5 of 52 employees</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@pms.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 555-0100"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Job Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {jobCategories.map((category, idx) => (
                <option key={idx} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddEmployee}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Employee
            </button>
            <button
              onClick={() => setShowAddModal(false)}
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
