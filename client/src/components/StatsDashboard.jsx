import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, UserCheck, Target } from 'lucide-react';
import { leadService } from '../services/leadService';

const StatsDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    qualified: 0,
    converted: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all leads to calculate stats
      const response = await leadService.getAllLeads({ limit: 1000 });
      if (response.success) {
        const leads = response.data;
        setStats({
          total: response.pagination.total,
          new: leads.filter(l => l.status === 'New').length,
          qualified: leads.filter(l => l.status === 'Qualified').length,
          converted: leads.filter(l => l.status === 'Converted').length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'New Leads',
      value: stats.new,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Qualified',
      value: stats.qualified,
      icon: Target,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Converted',
      value: stats.converted,
      icon: UserCheck,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`w-6 h-6 ${stat.color} text-white`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsDashboard;