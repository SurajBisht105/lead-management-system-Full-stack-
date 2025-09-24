import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import LeadForm from './components/LeadForm';
import LeadList from './components/LeadList';
import { Users, Plus, List } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [refreshList, setRefreshList] = useState(0);

  const handleLeadAdded = () => {
    // Trigger refresh of lead list
    setRefreshList(prev => prev + 1);
    // Switch to list view
    setTimeout(() => setActiveTab('list'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Lead Management System
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg shadow p-1 max-w-md">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'form'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'list'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4 mr-2" />
            View Leads
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'form' ? (
            <div className="max-w-2xl mx-auto">
              <LeadForm onLeadAdded={handleLeadAdded} />
            </div>
          ) : (
            <LeadList refreshTrigger={refreshList} />
          )}
        </div>

        {/* Stats Section (Optional) */}
        {activeTab === 'list' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Total Leads</div>
              <div className="text-2xl font-bold text-gray-900">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">New Leads</div>
              <div className="text-2xl font-bold text-blue-600">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Qualified</div>
              <div className="text-2xl font-bold text-green-600">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Converted</div>
              <div className="text-2xl font-bold text-purple-600">-</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © 2024 Lead Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;