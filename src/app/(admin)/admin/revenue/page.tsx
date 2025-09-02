"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiCalendar,
  FiDownload,
  FiBarChart,
  FiPieChart,
  FiUsers,
  FiPackage
} from 'react-icons/fi';

interface RevenueData {
  period: string;
  revenue: number;
  subscriptions: number;
  packages: {
    [key: string]: {
      revenue: number;
      count: number;
    };
  };
}

interface RevenueMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  averageRevenuePerUser: number;
  topPackage: string;
  revenueByMonth: RevenueData[];
  packageBreakdown: {
    name: string;
    revenue: number;
    percentage: number;
    subscribers: number;
  }[];
}

const RevenueReportsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12m');
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'packages' | 'growth'>('revenue');

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockMetrics: RevenueMetrics = {
        totalRevenue: 2847500,
        monthlyGrowth: 15.2,
        averageRevenuePerUser: 1250,
        topPackage: 'Gold',
        revenueByMonth: [
          {
            period: '2023-02',
            revenue: 185000,
            subscriptions: 156,
            packages: {
              'Free': { revenue: 0, count: 45 },
              'Silver': { revenue: 45000, count: 90 },
              'Gold': { revenue: 85000, count: 85 },
              'Platinum': { revenue: 45000, count: 23 },
              'VIP': { revenue: 10000, count: 2 }
            }
          },
          {
            period: '2023-03',
            revenue: 205000,
            subscriptions: 178,
            packages: {
              'Free': { revenue: 0, count: 52 },
              'Silver': { revenue: 52000, count: 104 },
              'Gold': { revenue: 95000, count: 95 },
              'Platinum': { revenue: 48000, count: 24 },
              'VIP': { revenue: 10000, count: 2 }
            }
          },
          {
            period: '2023-04',
            revenue: 225000,
            subscriptions: 189,
            packages: {
              'Free': { revenue: 0, count: 58 },
              'Silver': { revenue: 55000, count: 110 },
              'Gold': { revenue: 105000, count: 105 },
              'Platinum': { revenue: 50000, count: 25 },
              'VIP': { revenue: 15000, count: 3 }
            }
          },
          {
            period: '2023-05',
            revenue: 245000,
            subscriptions: 202,
            packages: {
              'Free': { revenue: 0, count: 62 },
              'Silver': { revenue: 58000, count: 116 },
              'Gold': { revenue: 115000, count: 115 },
              'Platinum': { revenue: 52000, count: 26 },
              'VIP': { revenue: 20000, count: 4 }
            }
          },
          {
            period: '2023-06',
            revenue: 275000,
            subscriptions: 218,
            packages: {
              'Free': { revenue: 0, count: 68 },
              'Silver': { revenue: 62000, count: 124 },
              'Gold': { revenue: 125000, count: 125 },
              'Platinum': { revenue: 58000, count: 29 },
              'VIP': { revenue: 30000, count: 6 }
            }
          },
          {
            period: '2024-01',
            revenue: 485000,
            subscriptions: 387,
            packages: {
              'Free': { revenue: 0, count: 125 },
              'Silver': { revenue: 95000, count: 190 },
              'Gold': { revenue: 215000, count: 215 },
              'Platinum': { revenue: 120000, count: 60 },
              'VIP': { revenue: 55000, count: 11 }
            }
          }
        ],
        packageBreakdown: [
          { name: 'Gold', revenue: 1285000, percentage: 45.1, subscribers: 1285 },
          { name: 'Silver', revenue: 683000, percentage: 24.0, subscribers: 1366 },
          { name: 'Platinum', revenue: 599000, percentage: 21.0, subscribers: 300 },
          { name: 'VIP Elite', revenue: 280500, percentage: 9.9, subscribers: 56 }
        ]
      };
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading Revenue Data...</div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiTrendingUp className="w-8 h-8 mr-3" />
                Revenue Reports
              </h1>
              <p className="text-gray-600 mt-2">Monitor revenue performance and growth metrics</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="6m">Last 6 Months</option>
                <option value="12m">Last 12 Months</option>
                <option value="24m">Last 24 Months</option>
              </select>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <FiDownload className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
                <p className={`text-sm ${getGrowthColor(metrics.monthlyGrowth)}`}>
                  {formatPercentage(metrics.monthlyGrowth)} from last month
                </p>
              </div>
              <FiDollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Monthly Growth</h3>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.monthlyGrowth)}</p>
                <p className="text-sm text-gray-600">Revenue increase</p>
              </div>
              <FiTrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Avg. Revenue/User</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.averageRevenuePerUser)}</p>
                <p className="text-sm text-gray-600">Per subscription</p>
              </div>
              <FiUsers className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Top Package</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics.topPackage}</p>
                <p className="text-sm text-gray-600">Highest revenue</p>
              </div>
              <FiPackage className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedChart('revenue')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedChart === 'revenue'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiBarChart className="w-4 h-4 inline mr-2" />
                Revenue Trend
              </button>
              <button
                onClick={() => setSelectedChart('packages')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedChart === 'packages'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiPieChart className="w-4 h-4 inline mr-2" />
                Package Breakdown
              </button>
              <button
                onClick={() => setSelectedChart('growth')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedChart === 'growth'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiTrendingUp className="w-4 h-4 inline mr-2" />
                Growth Analysis
              </button>
            </div>
          </div>

          {selectedChart === 'revenue' && (
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Monthly Revenue Trend</h4>
              <div className="grid grid-cols-6 gap-4 h-48">
                {metrics.revenueByMonth.slice(-6).map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-lg overflow-hidden h-32 flex items-end">
                      <div 
                        className="w-full bg-blue-500 rounded-t-lg"
                        style={{ 
                          height: `${(data.revenue / Math.max(...metrics.revenueByMonth.map(d => d.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      <div>{new Date(data.period + '-01').toLocaleDateString('en-US', { month: 'short' })}</div>
                      <div className="font-medium">{formatCurrency(data.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedChart === 'packages' && (
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Revenue by Package</h4>
              <div className="space-y-4">
                {metrics.packageBreakdown.map((pkg, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-24 text-sm font-medium text-gray-900">{pkg.name}</div>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${pkg.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{pkg.percentage.toFixed(1)}%</div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(pkg.revenue)}</div>
                      <div className="text-xs text-gray-500">{pkg.subscribers} subscribers</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedChart === 'growth' && (
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Growth Metrics</h4>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Month-over-Month Growth</h5>
                  <div className="space-y-3">
                    {metrics.revenueByMonth.slice(-3).map((data, index, arr) => {
                      const prevRevenue = index > 0 ? arr[index - 1].revenue : data.revenue;
                      const growth = ((data.revenue - prevRevenue) / prevRevenue) * 100;
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {new Date(data.period + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <span className={`text-sm font-medium ${getGrowthColor(growth)}`}>
                            {index === 0 ? 'Baseline' : formatPercentage(growth)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Key Performance Indicators</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Customer Lifetime Value</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(3750)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Churn Rate</span>
                      <span className="text-sm font-medium text-red-600">5.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revenue per Subscriber</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(1250)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Package Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Package Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Share
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Revenue/User
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.packageBreakdown.map((pkg, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(pkg.revenue)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{pkg.subscribers.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${pkg.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{pkg.percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(Math.round(pkg.revenue / pkg.subscribers))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportsPage;
