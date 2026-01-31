import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Icons
import { 
  TbTransformPoint, 
  TbPercentage66, 
  TbSum,
  TbReceipt,
  TbMoneybag,
  TbReportMoney,
  TbChartLine,
  TbTrendingUp,
  TbTrendingDown,
  TbUsers
} from "react-icons/tb";
import { IoBedOutline, IoWalletOutline } from "react-icons/io5";
import { TiPointOfInterestOutline } from "react-icons/ti";
import { PiStairsThin } from "react-icons/pi";
import { RxDropdownMenu } from "react-icons/rx";
import { MdOutlineFamilyRestroom, MdOutlineInventory2, MdOutlinePayments } from "react-icons/md";
import { GiCash, GiRoundTable, GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { CiCircleList } from "react-icons/ci";
import { RiNumbersLine } from "react-icons/ri";
import { BiUnite } from "react-icons/bi";
import { FaChartLine, FaFilter, FaUsers, FaSearch, FaCalendarAlt, FaClock, FaBox, FaBuilding, FaMoneyBillWave } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsGraphUp, BsCalendarCheck, BsCurrencyDollar, BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";
import { MdMeetingRoom } from "react-icons/md";
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

// API
import { api } from '../https';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  
  // Dashboard data states
  const [dashboardData, setDashboardData] = useState({
    // Counts
    totalItems: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    
    // Financials
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    
    // Recent transactions
    recentTransactions: [],
    
    // Growth rates
    incomeGrowth: 0,
    expenseGrowth: 0,
    customerGrowth: 0
  });

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchItemsCount(),
          fetchCustomersCount(),
          fetchSuppliersCount(),
          fetchFinancialData(),
          fetchRecentTransactions()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch items count
  const fetchItemsCount = async () => {
    try {
      const response = await api.post('/api/services/fetch', {
        page: 1,
        limit: 1 // Just to get total count
      });

      if (response.data.success) {
        setDashboardData(prev => ({
          ...prev,
          totalItems: response.data.pagination?.total || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching items count:', error);
    }
  };

  // Fetch customers count
  const fetchCustomersCount = async () => {
    try {
      const response = await api.post('/api/customers/fetch', {
        page: 1,
        limit: 1 // Just to get total count
      });

      if (response.data.success) {
        const totalCustomers = response.data.pagination?.total || 
                              (Array.isArray(response.data.customers) ? response.data.customers.length : 
                              (Array.isArray(response.data.data) ? response.data.data.length : 0));
        
        setDashboardData(prev => ({
          ...prev,
          totalCustomers
        }));
      }
    } catch (error) {
      console.error('Error fetching customers count:', error);
    }
  };

  // Fetch suppliers count
  const fetchSuppliersCount = async () => {
    try {
      const response = await api.post('/api/suppliers/fetch', {
        page: 1,
        limit: 1 // Just to get total count
      });

      if (response.data.success) {
        const totalSuppliers = response.data.pagination?.total || 
                              (Array.isArray(response.data.suppliers) ? response.data.suppliers.length : 0);
        
        setDashboardData(prev => ({
          ...prev,
          totalSuppliers
        }));
      }
    } catch (error) {
      console.error('Error fetching suppliers count:', error);
    }
  };

  // Fetch financial data (income vs expenses)
  const fetchFinancialData = async () => {
    try {
      const response = await api.post('/api/transactions/get-transactions', {
        frequency: 30, // Last 30 days
        page: 1,
        limit: 1000 // Get all transactions for calculation
      });

      if (response.data.success) {
        const transactions = response.data.data || response.data.transactions || [];
        
        // Calculate income (type === 'income' or positive amounts)
        const totalIncome = transactions
          .filter(tx => tx.type === 'income' || tx.amount > 0)
          .reduce((sum, tx) => sum + (Math.abs(tx.amount) || 0), 0);
        
        // Calculate expenses (type === 'expense' or negative amounts)
        const totalExpense = transactions
          .filter(tx => tx.type === 'expense' || tx.amount < 0)
          .reduce((sum, tx) => sum + (Math.abs(tx.amount) || 0), 0);
        
        // Calculate net profit
        const netProfit = totalIncome - totalExpense;
        
        // Calculate growth rates (simplified - you might want to compare with previous period)
        const incomeGrowth = 12.5; // Placeholder - calculate from your data
        const expenseGrowth = 8.3; // Placeholder - calculate from your data
        
        setDashboardData(prev => ({
          ...prev,
          totalIncome,
          totalExpense,
          netProfit,
          incomeGrowth,
          expenseGrowth
        }));
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  // Fetch recent transactions
  const fetchRecentTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const response = await api.post('/api/transactions/get-transactions', {
        sort: '-createdAt', // Latest first
        page: 1,
        limit: 5 // Get last 5 transactions
      });

      if (response.data.success) {
        const recentTransactions = response.data.data || response.data.transactions || [];
        setDashboardData(prev => ({
          ...prev,
          recentTransactions
        }));
      }
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Stats cards data
  const statsCards = [
    {
      id: 1,
      title: "Total Products/Items",
      value: dashboardData.totalItems,
      icon: <MdOutlineInventory2 className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      description: "Available in inventory",
      change: "+5.2%",
      link: '/services'
    },
    {
      id: 2,
      title: "Total Customers",
      value: dashboardData.totalCustomers,
      icon: <TbUsers className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      description: "Registered customers",
      change: dashboardData.customerGrowth > 0 ? `+${dashboardData.customerGrowth}%` : `${dashboardData.customerGrowth}%`,
      link: '/customers'
    },
    {
      id: 3,
      title: "Total Suppliers",
      value: dashboardData.totalSuppliers,
      icon: <FaBuilding className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      description: "Active suppliers",
      change: "+2.1%",
      link: '/suppliers'
    },
    {
      id: 4,
      title: "Total Income",
      value: formatCurrency(dashboardData.totalIncome),
      icon: <GiReceiveMoney className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      description: "Last 30 days",
      change: dashboardData.incomeGrowth > 0 ? 
        <span className="flex items-center text-green-200">
          <BsArrowUpRight className="mr-1" /> +{dashboardData.incomeGrowth}%
        </span> : 
        <span className="flex items-center text-red-200">
          <BsArrowDownRight className="mr-1" /> {dashboardData.incomeGrowth}%
        </span>,
      link: '/transactions?type=income'
    },
    {
      id: 5,
      title: "Total Expenses",
      value: formatCurrency(dashboardData.totalExpense),
      icon: <GiPayMoney className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-gradient-to-br from-red-500 to-red-600",
      description: "Last 30 days",
      change: dashboardData.expenseGrowth > 0 ? 
        <span className="flex items-center text-red-200">
          <BsArrowUpRight className="mr-1" /> +{dashboardData.expenseGrowth}%
        </span> : 
        <span className="flex items-center text-green-200">
          <BsArrowDownRight className="mr-1" /> {dashboardData.expenseGrowth}%
        </span>,
      link: '/transactions?type=expense'
    },
    {
      id: 6,
      title: "Net Profit",
      value: formatCurrency(dashboardData.netProfit),
      icon: <FaMoneyBillWave className="w-6 h-6" />,
      color: dashboardData.netProfit >= 0 ? "from-amber-500 to-amber-600" : "from-rose-500 to-rose-600",
      bgColor: dashboardData.netProfit >= 0 ? "bg-gradient-to-br from-amber-500 to-amber-600" : "bg-gradient-to-br from-rose-500 to-rose-600",
      description: "Income - Expenses",
      change: dashboardData.netProfit >= 0 ? 
        <span className="flex items-center text-amber-200">
          <FiTrendingUp className="mr-1" /> Profitable
        </span> : 
        <span className="flex items-center text-rose-200">
          <FiTrendingDown className="mr-1" /> Loss
        </span>,
      link: '/transactions'
    }
  ];

  // Quick actions
  const quickActions = [
    { label: "Add Transaction", icon: <GiCash className="w-5 h-5" />, color: "bg-gradient-to-r from-emerald-500 to-emerald-600", action: () => navigate('/transactions/add') },
    { label: "View Items", icon: <FaBox className="w-5 h-5" />, color: "bg-gradient-to-r from-blue-500 to-blue-600", action: () => navigate('/services') },
    { label: "Manage Customers", icon: <FaUsers className="w-5 h-5" />, color: "bg-gradient-to-r from-purple-500 to-purple-600", action: () => navigate('/customers') },
    { label: "Check Suppliers", icon: <FaBuilding className="w-5 h-5" />, color: "bg-gradient-to-r from-cyan-500 to-cyan-600", action: () => navigate('/suppliers') },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading dashboard data...</p>
          <p className="text-gray-500 mt-2">Please wait while we fetch your statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 w-full">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
                <FaChartLine className="w-7 h-7" />
              </div>
              Business Dashboard
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Overview of your business performance, inventory, customers, and financial metrics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                Promise.all([
                  fetchItemsCount(),
                  fetchCustomersCount(),
                  fetchSuppliersCount(),
                  fetchFinancialData(),
                  fetchRecentTransactions()
                ]);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaChartLine className="w-4 h-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
            <BsGraphUp className="w-5 h-5" />
          </div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3`}
            >
              {action.icon}
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <TbChartLine className="w-5 h-5" />
          </div>
          Key Business Metrics
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat) => (
            <div 
              key={stat.id}
              className={`${stat.bgColor} text-white rounded-xl p-6 shadow-xl transition-transform hover:scale-[1.02] cursor-pointer`}
              onClick={() => stat.link && navigate(stat.link)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm opacity-90 font-medium">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-white/20">
                  {stat.icon}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-xs opacity-80">{stat.description}</p>
                </div>
                <div className="text-sm font-medium">
                  {stat.change}
                </div>
              </div>
              
              <div className="mt-3 text-xs opacity-70 flex items-center">
                <span>Click to view details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Income */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <GiReceiveMoney className="w-5 h-5" />
              </div>
              Recent Income
            </h3>
            <button 
              onClick={() => navigate('/transactions?type=income')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All →
            </button>
          </div>
          
          {isLoadingTransactions ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : dashboardData.recentTransactions.filter(tx => 
            tx.type === 'income' || tx.amount > 0
          ).length === 0 ? (
            <div className="text-center py-8">
              <GiReceiveMoney className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent income transactions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentTransactions
                .filter(tx => tx.type === 'income' || tx.amount > 0)
                .slice(0, 3)
                .map((transaction, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <GiReceiveMoney className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {transaction.description || 'Income'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.date || transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        +{formatCurrency(Math.abs(transaction.amount) || 0)}
                      </p>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {transaction.paymentMethod || 'Cash'}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-100 text-red-600">
                <GiPayMoney className="w-5 h-5" />
              </div>
              Recent Expenses
            </h3>
            <button 
              onClick={() => navigate('/transactions?type=expense')}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              View All →
            </button>
          </div>
          
          {isLoadingTransactions ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : dashboardData.recentTransactions.filter(tx => 
            tx.type === 'expense' || tx.amount < 0
          ).length === 0 ? (
            <div className="text-center py-8">
              <GiPayMoney className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent expense transactions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentTransactions
                .filter(tx => tx.type === 'expense' || tx.amount < 0)
                .slice(0, 3)
                .map((transaction, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100 text-red-600">
                        <GiPayMoney className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {transaction.description || 'Expense'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.date || transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        -{formatCurrency(Math.abs(transaction.amount) || 0)}
                      </p>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        {transaction.paymentMethod || 'Cash'}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Inventory Value</p>
              <p className="text-2xl font-bold mt-2">Calculating...</p>
            </div>
            <MdOutlineInventory2 className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-80 mt-4">Total value of all products</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg. Transaction</p>
              <p className="text-2xl font-bold mt-2">
                {dashboardData.recentTransactions.length > 0 
                  ? formatCurrency(
                      dashboardData.recentTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0) / 
                      dashboardData.recentTransactions.length
                    )
                  : formatCurrency(0)
                }
              </p>
            </div>
            <TbReportMoney className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-80 mt-4">Average transaction amount</p>
        </div>
        
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Profit Margin</p>
              <p className="text-2xl font-bold mt-2">
                {dashboardData.totalIncome > 0 
                  ? `${((dashboardData.netProfit / dashboardData.totalIncome) * 100).toFixed(1)}%` 
                  : '0%'
                }
              </p>
            </div>
            <TbPercentage66 className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-80 mt-4">Net profit as % of income</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/reports')}
              className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Generate Report
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Dashboard Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;