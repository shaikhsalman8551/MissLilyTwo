import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { getAllProducts, getAllCategories, getAllContactMessages, getAllUserInquiries, subscribeToDashboardStats } from '../services/firebaseService';
import { ShimmerChart } from '../components/ShimmerEffects';
import AdminLayout from '../components/AdminLayout';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ReportsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalInquiries: 0,
    totalContacts: 0,
    productsByCategory: [],
    priceDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin-login');
      return;
    }
    
    // Set up real-time subscription
    const unsubscribe = subscribeToDashboardStats((dashboardData) => {
      const products = dashboardData.recentProducts || [];
      const categories = dashboardData.topCategories || [];
      const inquiries = dashboardData.recentInquiries || [];
      const messages = dashboardData.recentMessages || [];

      // Count products by category
      const prodByCategory = categories.map(cat => ({
        name: cat.name,
        count: products.filter(p => p.categoryId === cat.id).length
      }));

      setStats({
        totalProducts: dashboardData.totalProducts,
        totalCategories: dashboardData.totalCategories,
        totalInquiries: dashboardData.totalInquiries,
        totalContacts: dashboardData.totalContacts,
        productsByCategory: prodByCategory,
        products: products
      });
      
      setLoading(false);
      setInitialLoad(false);
    });
    
    // Initial fetch for immediate display
    fetchStats();
    
    return () => unsubscribe();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const products = await getAllProducts();
      const categories = await getAllCategories();
      const inquiries = await getAllUserInquiries();
      const messages = await getAllContactMessages();

      // Count products by category
      const prodByCategory = categories.map(cat => ({
        name: cat.name,
        count: products.filter(p => p.categoryId === cat.id).length
      }));

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalInquiries: inquiries.length,
        totalContacts: messages.length,
        productsByCategory: prodByCategory,
        products: products
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      alert('Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = {
    labels: stats.productsByCategory.map(p => p.name),
    datasets: [{
      label: 'Products by Category',
      data: stats.productsByCategory.map(p => p.count),
      backgroundColor: [
        '#FF6B9D',
        '#FFC75F',
        '#F9F871',
        '#845EC2',
        '#D65DB1',
        '#FF9671'
      ]
    }]
  };

  const barChartData = {
    labels: ['Products', 'Categories', 'Inquiries', 'Contact Messages'],
    datasets: [{
      label: 'Count',
      data: [
        stats.totalProducts,
        stats.totalCategories,
        stats.totalInquiries,
        stats.totalContacts
      ],
      backgroundColor: [
        '#FF6B9D',
        '#FF9671',
        '#F9F871',
        '#845EC2'
      ]
    }]
  };

  return (
      <div className="">
        {loading ? (
          <p className="text-gray-500">Loading reports...</p>
        ) : (
          <>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Products by Category</h2>
                {initialLoad ? (
                  <ShimmerChart />
                ) : stats.productsByCategory.length > 0 ? (
                  <div className="relative h-80">
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                )}
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Statistics</h2>
                {initialLoad ? (
                  <ShimmerChart />
                ) : (
                  <div className="relative h-80">
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true }
                        },
                        scales: {
                          y: { beginAtZero: true }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Category Breakdown Table */}
            {stats.productsByCategory.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Count</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.productsByCategory.map((cat, idx) => {
                        const percentage = ((cat.count / stats.totalProducts) * 100).toFixed(1);
                        return (
                          <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{cat.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{cat.count}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-pink-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{percentage}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
  
  );
};

export default ReportsPage;
