import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { QrCode, Download, Share2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function ResidentDigitalID() {
  const resident = {
    name: 'Obsan Habtamu',
    unit: 'A-101',
    idNumber: 'RES-2024-0101',
    qrCode: 'QR-A101-JD',
    status: 'Verified',
    validUntil: '2025-12-31',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1>Digital ID Card</h1>
          <p className="text-gray-600 mt-1">Your verified resident identification</p>
        </div>

        {/* Digital ID Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-100 mb-2">Property Management System</p>
              <h2 className="text-white mb-1">{resident.name}</h2>
              <p className="text-blue-100">Unit {resident.unit}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span>{resident.status}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl p-6 mx-auto my-8 w-full max-w-xs">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-48 h-48 text-gray-400" />
            </div>
            <p className="text-center text-gray-600 mt-4 font-mono">{resident.qrCode}</p>
          </div>

          {/* ID Details */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-blue-200">ID Number</p>
              <p className="text-white">{resident.idNumber}</p>
            </div>
            <div>
              <p className="text-blue-200">Valid Until</p>
              <p className="text-white">{resident.validUntil}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={() => toast.success('Digital ID downloaded!')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={() => toast.success('Link copied to clipboard!')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={() => toast.info('QR code enlarged')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <QrCode className="w-5 h-5" />
            View QR
          </button>
        </div>

        {/* Information Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="mb-4">How to Use Your Digital ID</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Show your QR code at building entrances for quick verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use it to access common facilities and amenities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Present it when requesting maintenance services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Keep a digital copy on your phone for convenience</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="mb-4">ID Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Verification Status</span>
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Issued Date</span>
                <span className="text-gray-900">2024-01-15</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">2025-11-18</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Access Level</span>
                <span className="text-gray-900">Resident</span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-gray-900 mb-1">Need Help?</p>
          <p className="text-gray-600">
            If you have any issues with your Digital ID, please contact the management office or submit a request through the system.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
