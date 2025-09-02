"use client";

import React, { useState, useEffect } from 'react';
import { FiActivity, FiHeart, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';

interface CompatibilityReport {
  candidateId: string;
  candidateName: string;
  analysis: {
    score: number;
    factors: string[];
    horoscope: string;
  };
  details: any;
}

const CompatibilityPage: React.FC = () => {
  const [reports, setReports] = useState<CompatibilityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  useEffect(() => {
    fetchCompatibilityReports();
  }, []);

  const fetchCompatibilityReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/compatibility');
      
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        console.error('Failed to fetch compatibility reports');
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching compatibility reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <FiHeart className="w-5 h-5" />;
    if (score >= 70) return <FiStar className="w-5 h-5" />;
    return <FiActivity className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Analyzing Compatibility...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FiActivity className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Compatibility Analysis</h1>
          </div>
          <p className="text-lg text-gray-600">
            AI-powered compatibility scoring based on preferences, lifestyle, and personality traits
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Analyses</h3>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <FiUsers className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">High Compatibility</h3>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.analysis.score >= 85).length}
                </p>
              </div>
              <FiHeart className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(reports.reduce((acc, r) => acc + r.analysis.score, 0) / reports.length)}%
                </p>
              </div>
              <FiTrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Top Match</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.max(...reports.map(r => r.analysis.score))}%
                </p>
              </div>
              <FiStar className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Compatibility Reports */}
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.candidateId} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {report.candidateName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{report.candidateName}</h3>
                      <p className="text-gray-600">Compatibility Analysis</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center px-4 py-2 rounded-full ${getScoreColor(report.analysis.score)}`}>
                    {getScoreIcon(report.analysis.score)}
                    <span className="ml-2 font-bold text-lg">{report.analysis.score}%</span>
                  </div>
                </div>

                {/* Compatibility Factors */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Compatibility Factors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.analysis.factors.map((factor, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {Object.entries(report.details).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-bold text-purple-600">{value.score}/15</span>
                      </div>
                      {value.match !== undefined && (
                        <div className="text-sm text-gray-600 mt-1">
                          {value.match ? '✅ Perfect Match' : '⚠️ Partial Match'}
                        </div>
                      )}
                      {value.difference !== undefined && (
                        <div className="text-sm text-gray-600 mt-1">
                          Difference: {value.difference} years
                        </div>
                      )}
                      {value.common && (
                        <div className="text-sm text-gray-600 mt-1">
                          Common: {value.common.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Horoscope */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Horoscope Compatibility:</h4>
                  <p className="text-purple-700 italic">{report.analysis.horoscope}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Send Interest
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    View Profile
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    Save Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Generate New Analysis */}
        <div className="mt-8 text-center">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
            Generate New Compatibility Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityPage;
