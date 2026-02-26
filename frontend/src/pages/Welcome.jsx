import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Briefcase, Home } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Building2 className="w-16 h-16 text-blue-600" />
            </div>
            <p className="text-gray-600 mt-4">
              Comprehensive property management solution for modern living
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="mb-2">Resident Management</h3>
              <p className="text-gray-600">Manage residents, dependents, and digital IDs efficiently</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="mb-2">Job Tracking</h3>
              <p className="text-gray-600">Track maintenance jobs and employee assignments in real-time</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Home className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="mb-2">Request System</h3>
              <p className="text-gray-600">Handle maintenance requests and complaints seamlessly</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-center mb-8">Get Started</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login to Your Account
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Register as Resident
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-600">
            <p>&copy; 2025 Property Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
