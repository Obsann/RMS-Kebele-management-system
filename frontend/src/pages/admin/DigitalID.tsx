import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { QrCode, CheckCircle, XCircle, Download, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function AdminDigitalID() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  const residents = [
    { id: 1, name: 'John Smith', unit: 'A-101', idStatus: 'approved' as const, qrCode: 'QR-A101-JS', lastVerified: '2025-11-15' },
    { id: 2, name: 'Sarah Johnson', unit: 'B-205', idStatus: 'pending' as const, qrCode: 'QR-B205-SJ', lastVerified: '-' },
    { id: 3, name: 'Mike Williams', unit: 'C-312', idStatus: 'approved' as const, qrCode: 'QR-C312-MW', lastVerified: '2025-11-10' },
    { id: 4, name: 'Emily Brown', unit: 'A-204', idStatus: 'approved' as const, qrCode: 'QR-A204-EB', lastVerified: '2025-11-18' },
  ];

  const handleViewQR = (resident: any) => {
    setSelectedResident(resident);
    setShowQRModal(true);
  };

  const handleApprove = (id: number) => {
    toast.success('Digital ID approved successfully!');
  };

  const handleReject = (id: number) => {
    toast.error('Digital ID rejected');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>Digital ID System</h1>
          <p className="text-gray-600 mt-1">Manage resident digital IDs and QR verification</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total Digital IDs</p>
            <p className="text-gray-900">{residents.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Approved</p>
            <p className="text-gray-900">{residents.filter(r => r.idStatus === 'approved').length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Pending Approval</p>
            <p className="text-gray-900">{residents.filter(r => r.idStatus === 'pending').length}</p>
          </div>
        </div>

        {/* Digital IDs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2>Resident Digital IDs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">Resident</th>
                  <th className="px-6 py-3 text-left text-gray-600">Unit</th>
                  <th className="px-6 py-3 text-left text-gray-600">QR Code</th>
                  <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-gray-600">Last Verified</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {residents.map((resident) => (
                  <tr key={resident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">{resident.name.charAt(0)}</span>
                        </div>
                        <span className="text-gray-900">{resident.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{resident.unit}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{resident.qrCode}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={resident.idStatus} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-gray-600">{resident.lastVerified}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewQR(resident)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="View QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        {resident.idStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(resident.id)}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(resident.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QR Verification Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="mb-4">QR Code Verification</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2">Scan or Enter QR Code</label>
              <input
                type="text"
                placeholder="QR-A101-JS"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Verify
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Digital ID Card"
        size="md"
      >
        {selectedResident && (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-8">
              <p className="mb-4">Property Management System</p>
              <h2 className="text-white mb-2">{selectedResident.name}</h2>
              <p className="text-blue-100">Unit {selectedResident.unit}</p>
              
              {/* QR Code Placeholder */}
              <div className="bg-white rounded-lg p-6 mx-auto my-6 w-48 h-48 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
              
              <p className="font-mono text-blue-100">{selectedResident.qrCode}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => toast.success('Digital ID downloaded!')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
