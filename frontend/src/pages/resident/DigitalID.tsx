import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { QrCode, Download, Share2, CheckCircle, Clock, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function ResidentDigitalID() {
  // Mock states: 'none', 'pending', 'appointment', 'issued'
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'appointment' | 'issued'>('none');
  const [appointmentDate, setAppointmentDate] = useState('2025-11-25');

  const resident = {
    name: 'Obsan Habtamu',
    unit: 'A-101',
    idNumber: 'RES-2024-0101',
    qrCode: 'QR-A101-JD',
    status: 'Verified',
    validUntil: '2025-12-31',
  };

  const handleRequestID = () => {
    toast.success('Digital ID requested successfully');
    setRequestStatus('pending');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1>Digital ID Status</h1>
          <p className="text-gray-600 mt-1">Manage your verified resident identification</p>

          {/* Dev toggles for demonstration purposes */}
          <div className="mt-4 flex justify-center gap-2 text-xs opacity-50 hover:opacity-100 transition-opacity">
            <button onClick={() => setRequestStatus('none')} className="px-2 py-1 bg-gray-200 rounded">No ID</button>
            <button onClick={() => setRequestStatus('pending')} className="px-2 py-1 bg-gray-200 rounded">Pending</button>
            <button onClick={() => setRequestStatus('appointment')} className="px-2 py-1 bg-gray-200 rounded">Appointment</button>
            <button onClick={() => setRequestStatus('issued')} className="px-2 py-1 bg-gray-200 rounded">Issued</button>
          </div>
        </div>

        {/* State 1: No ID Requested */}
        {requestStatus === 'none' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Digital ID</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              You currently do not have a verified Digital ID. Request one now to get access to building amenities, fast-track entry, and verify your residency.
            </p>
            <button
              onClick={handleRequestID}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Submit ID Request
            </button>
          </div>
        )}

        {/* State 2: Request Pending Validation */}
        {requestStatus === 'pending' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-yellow-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Under Review</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Your Digital ID request has been submitted and is currently under review by the Administration. You will be notified once the review is complete and a verification appointment is scheduled.
            </p>
          </div>
        )}

        {/* State 3: Appointment Scheduled */}
        {requestStatus === 'appointment' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Appointment Scheduled</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              Your request has been approved. Please visit the Kebele management office to verify your documents and finalize your ID issuance.
            </p>
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl p-6 text-left">
              <div className="flex items-center gap-4 mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Scheduled Due Date</p>
                  <p className="font-bold text-lg">{appointmentDate}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 italic">
                Please bring your physical ID and proof of residence.
              </p>
            </div>
          </div>
        )}

        {/* State 4: ID Issued (Original UI) */}
        {requestStatus === 'issued' && (
          <>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-16"></div>

              <div className="flex items-start justify-between mb-6 relative z-10">
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
              <div className="bg-white rounded-xl p-6 mx-auto my-8 w-full max-w-xs relative z-10">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-48 h-48 text-gray-400" />
                </div>
                <p className="text-center text-gray-800 mt-4 font-mono font-bold">{resident.qrCode}</p>
              </div>

              {/* ID Details */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20 relative z-10">
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
          </>
        )}

        {/* Information Cards (Only show if issued or pending) */}
        {requestStatus !== 'none' && (
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
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
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Request Status</span>
                  <span className="flex items-center gap-2 font-medium capitalize">
                    {requestStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900">Today</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Access Level</span>
                  <span className="text-gray-900">Resident</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
          <p className="font-bold text-gray-900 mb-1">Need Help?</p>
          <p className="text-gray-600 text-sm">
            If you have any issues with your Digital ID process, please contact the management office or submit a request through the system.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
