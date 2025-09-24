import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Building, Calendar, 
  ChevronLeft, ChevronRight, Trash2, Edit,
  RefreshCw, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { leadService } from '../services/leadService';

const LeadList = ({ refreshTrigger }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-yellow-100 text-yellow-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Lost': 'bg-red-100 text-red-800',
    'Converted': 'bg-purple-100 text-purple-800'
  };

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter })
      };
      
      const response = await leadService.getAllLeads(params);
      
      if (response.success) {
        setLeads(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshTrigger, statusFilter]);

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      const response = await leadService.updateLeadStatus(leadId, newStatus);
      if (response.success) {
        toast.success('Status updated successfully');
        fetchLeads(pagination.page);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await leadService.deleteLead(leadId);
      if (response.success) {
        toast.success('Lead deleted successfully');
        fetchLeads(pagination.page);
      }
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lead Management</h2>
        
        <div className="flex items-center space-x-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
            <option value="Converted">Converted</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => fetchLeads(pagination.page)}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Leads Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {leads.length} of {pagination.total} leads
      </div>

      {/* Leads Table/Cards */}
      {leads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{lead.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {lead.company || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                        <option value="Converted">Converted</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {leads.map((lead) => (
              <div key={lead._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <p className="text-sm text-gray-600">{lead.company || 'No company'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {lead.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {lead.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(lead.createdAt)}
                  </div>
                </div>

                {lead.message && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    {lead.message}
                  </div>
                )}

                <div className="mt-4 flex justify-between">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                    <option value="Converted">Converted</option>
                  </select>
                  
                  <button
                    onClick={() => handleDelete(lead._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => fetchLeads(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`p-2 rounded ${
                  pagination.page === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="px-4 py-2 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                onClick={() => fetchLeads(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`p-2 rounded ${
                  pagination.page === pagination.pages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadList;