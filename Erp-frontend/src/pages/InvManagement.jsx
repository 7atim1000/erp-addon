import React, { useState, useEffect, useRef, useCallback } from 'react'
import BackButton from '../components/shared/BackButton';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { LuPrinterCheck } from "react-icons/lu";


import { api, getInvoices } from '../https';
import InvoicesDetails from '../components/invoice/InvoicesDetails';

import { toast } from 'react-toastify'

import { Select, Progress, Flex } from 'antd'
import moment from 'moment';
import ManagementReport from '../components/invoice/ManagementReport';
import InvoiceDetails from '../components/invoice/InvoiceDetails';
   
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const InvManagement = () => {
    const [allInvoices, setAllInvoices] = useState([]);
    const [frequency, setFrequency] = useState('365');
    const [type, setType] = useState('bills');
    const [invoiceType, setInvoiceType] = useState('all');
    const [invoiceStatus, setInvoiceStatus] = useState('all');
    const [customer, setCustomer] = useState('all');
    const [supplier, setSupplier] = useState('all');
    const [shift, setShift] = useState('all');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });
  
    
    // fetch Invoices
    const fetchInvoices = async (searchParam = '') => {
        setLoading(true);
        try {
            const response = await api.post('/api/invoice/fetch', {
                type: type === 'all' ? '' : type,
                frequency,
                invoiceType: invoiceType === 'all' ? '' : invoiceType,
                invoiceStatus: invoiceStatus === 'all' ? '' : invoiceStatus,
                customer: customer === 'all' ? '' : customer,
                supplier: supplier === 'all' ? '' : supplier,
                shift: shift === 'all' ? '' : shift,
                search: searchParam || search,
                sort,
                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            });
                
            if (response.data.success) {
                // Check both possible response formats
                const invoices = response.data.data || response.data.invoices || [];
                setAllInvoices(invoices);
                
                if (response.data.pagination) {
                    setPagination({
                        currentPage: response.data.pagination.currentPage || 1,
                        itemsPerPage: response.data.pagination.limit || 10,
                        totalItems: response.data.pagination.total || 0,
                        totalPages: response.data.pagination.totalPages || 1
                    });
                }
                
                // If no data but API was successful, show message
                if (invoices.length === 0) {
                    toast.info('No invoices found with current filters');
                }
            } else {
                toast.error(response.data.message || 'Failed to fetch invoices');
                setAllInvoices([]);
            }
    
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error(error.response?.data?.message || 'Failed to load invoices');
            setAllInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchInvoices();
    }, [type, frequency, invoiceType, invoiceStatus, shift, customer, supplier, sort, pagination.currentPage]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== '') {
                // Reset to page 1 when searching
                setPagination(prev => ({ ...prev, currentPage: 1 }));
                fetchInvoices(search);
            } else if (search === '') {
                fetchInvoices('');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    // Handle reset filters
    const handleReset = () => {
        setType('all');
        setFrequency('30');
        setInvoiceType('all');
        setInvoiceStatus('all');
        setShift('all');
        setCustomer('all');
        setSupplier('all');
        setSearch('');
        setSort('-createdAt');
        setPagination({
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 1
        });
    };

    // Percentage and count
    const totalInvoices = allInvoices.length;  
    const totalSaleInvoices = allInvoices.filter(
        (invoice) => invoice.invoiceType === "Sale invoice"
    );
    const totalBuyInvoices = allInvoices.filter(
        (invoice) => invoice.invoiceType === "Purchase invoice"
    );
    const totalIncomePercent = (totalSaleInvoices.length / totalInvoices) * 100;
    const totalExpensePercent = (totalBuyInvoices.length / totalInvoices) * 100;
    
    // Total amounts
    const totalTurnover = allInvoices.reduce((acc, invoice) => acc + (invoice.bills?.total || 0), 0);
    const totalSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice')
        .reduce((acc, invoice) => acc + (invoice.bills?.total || 0), 0);
    const totalBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice')
        .reduce((acc, invoice) => acc + (invoice.bills?.total || 0), 0);
    const totalSaleTaxTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice')
        .reduce((acc, invoice) => acc + (invoice.bills?.tax || 0), 0);
    const totalWithTaxBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice')
        .reduce((acc, invoice) => acc + (invoice.bills?.totalWithTax || 0), 0);
    const totalWithTaxSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice')
        .reduce((acc, invoice) => acc + (invoice.bills?.totalWithTax || 0), 0);

    // Percentages
    const totalSaleTurnoverPercent = totalTurnover > 0 ? (totalSaleTurnover / totalTurnover) * 100 : 0;
    const totalBuyTurnoverPercent = totalTurnover > 0 ? (totalBuyTurnover / totalTurnover) * 100 : 0;

    const data = [
        { name: 'Sales', value: totalSaleTurnover, color: '#10b981' },
        { name: 'Purchases', value: totalBuyTurnover, color: '#0ea5e9' }
    ];

    // Printing
    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML
        const WinPrint = window.open("", "", "width=900, height=650")

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Invoices Management</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt-container { width: 100%; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .IdTd {display: none ;}
                        .updateTd {display: none ;}
                        .statusTr {display: none ;}
                        .controls { display: none; }
                        .button { display: none; }
                        .backButton {display: none; }
                        .search {display : none; } 
                        .tdFooter {display : none; }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `)

        WinPrint.document.close()
        WinPrint.focus()
        setTimeout(() => {
            WinPrint.print()
            WinPrint.close()
        }, 1000)
    };

    return (
        <section className='min-h-screen w-full bg-gradient-to-b from-blue-50 to-white p-4 md:p-1'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-2xl shadow-xl mb-2 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white hover:bg-white/20" />
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className='text-xl md:text-2xl font-bold'>Invoice Management</h1>
                                    <p className='text-blue-100 text-sm'>Track and manage all your invoices</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-3'>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                            >
                                <LuPrinterCheck className="w-4 h-4" />
                                <span className='text-sm font-medium'>Print Report</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Left Column - Main Table */}
                    <div className='lg:col-span-2'>
                        <div ref={invoiceRef} className='bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden'>
                            {/* Search and Filters */}
                            <div className='p-4 md:p-6 border-b border-blue-100'>
                                <div className='flex flex-col md:flex-row gap-3'>
                                    <div className='flex-1 relative'>
                                        <input
                                            type="text"
                                            placeholder="Search invoices by customer, supplier, or ID..."
                                            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    <select
                                        className="border border-blue-200 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                    >
                                        <option value="-createdAt">Newest First</option>
                                        <option value="createdAt">Oldest First</option>
                                        <option value="total">Total: High to Low</option>
                                        <option value="-total">Total: Low to High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading invoices...</span>
                                </div>
                            )}

                            {/* Invoices Table */}
                            {!loading && (
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead>
                                            <tr className='bg-gradient-to-r from-blue-50 to-blue-100 text-left'>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Date</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Type</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Items</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Customer/Supplier</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Total</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Tax</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Grand Total</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-blue-100'>
                                            {allInvoices.map((invoice) => (
                                                <tr key={invoice._id} className='hover:bg-blue-50/50 transition-colors duration-150'>
                                                    <td className='p-3 text-sm text-gray-600'>
                                                        {moment(invoice.date).format('MMM D, YYYY')}
                                                    </td>
                                                    <td className='p-3'>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            invoice.invoiceType === 'Sale invoice' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {invoice.invoiceType}
                                                        </span>
                                                    </td>
                                                    <td className='p-3 text-sm text-gray-600'>
                                                        {invoice.items?.length || 0} items
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='text-sm font-medium text-gray-800'>
                                                            {invoice.invoiceType === 'Sale invoice' 
                                                                ? (invoice.customerName || 'N/A')
                                                                : (invoice.supplierName || 'N/A')
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className='p-3 text-sm font-semibold text-gray-700'>
                                                        ${(invoice.bills?.total || 0).toFixed(2)}
                                                    </td>
                                                    <td className='p-3 text-sm text-gray-600'>
                                                        ${(invoice.bills?.tax || 0).toFixed(2)}
                                                    </td>
                                                    <td className='p-3 text-sm font-semibold text-gray-900'>
                                                        ${(invoice.bills?.totalWithTax || 0).toFixed(2)}
                                                    </td>
                                                    <td className='p-3'>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            invoice.invoiceStatus === 'Completed' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : invoice.invoiceStatus === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {invoice.invoiceStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* Empty State */}
                                    {allInvoices.length === 0 && !loading && (
                                        <div className='text-center py-12'>
                                            <div className='mb-4 inline-flex p-4 bg-blue-50 rounded-full'>
                                                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                                                {search ? 'No invoices found' : 'No invoices available'}
                                            </h3>
                                            <p className='text-gray-500 max-w-md mx-auto'>
                                                {search 
                                                    ? `No invoices match your search for "${search}". Try different keywords.`
                                                    : 'Your invoice list is empty. Start by creating your first invoice.'
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Stats and Filters */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Filters Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </h3>
                            
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Time Period</label>
                                    <select 
                                        value={frequency} 
                                        onChange={(e) => setFrequency(e.target.value)}
                                        className='w-full border border-blue-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    >
                                        <option value='365'>Last 365 Days</option>
                                        <option value='90'>Last 90 Days</option>
                                        <option value='30'>Last 30 Days</option>
                                        <option value='7'>Last 7 Days</option>
                                        <option value='1'>Today</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Invoice Status</label>
                                    <select 
                                        value={invoiceStatus} 
                                        onChange={(e) => setInvoiceStatus(e.target.value)}
                                        className='w-full border border-blue-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    >
                                        <option value='all'>All Statuses</option>
                                        <option value='Completed'>Completed</option>
                                        <option value='Pending'>Pending</option>
                                        <option value='Cancelled'>Cancelled</option>
                                        <option value='In Progress'>In Progress</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Shift</label>
                                    <select 
                                        value={shift} 
                                        onChange={(e) => setShift(e.target.value)}
                                        className='w-full border border-blue-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    >
                                        <option value='all'>All Shifts</option>
                                        <option value='Morning'>Morning</option>
                                        <option value='Evening'>Evening</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Invoice Statistics</h3>
                            
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='bg-blue-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-500 mb-1'>Total Invoices</p>
                                        <p className='text-lg font-bold text-blue-800'>{totalInvoices}</p>
                                    </div>
                                    <div className='bg-green-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-500 mb-1'>Sale Invoices</p>
                                        <p className='text-lg font-bold text-green-800'>{totalSaleInvoices.length}</p>
                                    </div>
                                    <div className='bg-blue-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-500 mb-1'>Purchase Invoices</p>
                                        <p className='text-lg font-bold text-blue-800'>{totalBuyInvoices.length}</p>
                                    </div>
                                    <div className='bg-purple-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-500 mb-1'>Total Tax</p>
                                        <p className='text-lg font-bold text-purple-800'>${totalSaleTaxTurnover.toFixed(2)}</p>
                                    </div>
                                </div>
                                
                                <div className='border-t border-blue-100 pt-4'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-sm font-medium text-gray-700'>Sales Total</span>
                                        <span className='text-lg font-bold text-green-600'>${totalSaleTurnover.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-sm font-medium text-gray-700'>Purchases Total</span>
                                        <span className='text-lg font-bold text-blue-600'>${totalBuyTurnover.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-sm font-medium text-gray-700'>Gross Sales</span>
                                        <span className='text-lg font-bold text-green-600'>${totalWithTaxSaleTurnover.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-sm font-medium text-gray-700'>Gross Purchases</span>
                                        <span className='text-lg font-bold text-blue-600'>${totalWithTaxBuyTurnover.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between items-center mt-4 pt-3 border-t border-blue-100'>
                                        <span className='text-sm font-bold text-gray-800'>Expected Profit</span>
                                        <span className={`text-lg font-bold ${(totalSaleTurnover - totalBuyTurnover) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ${(totalSaleTurnover - totalBuyTurnover).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Sales vs Purchases</h3>
                            
                            <div className='h-48'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                                <div className='text-center'>
                                    <div className='flex items-center justify-center gap-2 mb-1'>
                                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                        <span className='text-sm font-medium text-gray-700'>Sales</span>
                                    </div>
                                    <div className='text-lg font-bold text-green-600'>${totalSaleTurnover.toFixed(2)}</div>
                                    <div className='text-xs text-green-600 font-semibold'>{totalSaleTurnoverPercent.toFixed(0)}%</div>
                                </div>
                                <div className='text-center'>
                                    <div className='flex items-center justify-center gap-2 mb-1'>
                                        <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                                        <span className='text-sm font-medium text-gray-700'>Purchases</span>
                                    </div>
                                    <div className='text-lg font-bold text-blue-600'>${totalBuyTurnover.toFixed(2)}</div>
                                    <div className='text-xs text-blue-600 font-semibold'>{totalBuyTurnoverPercent.toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Footer */}
                <div className='mt-6 bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='text-sm text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <span>Total Invoices: {totalInvoices} • Sales: ${totalSaleTurnover.toFixed(2)} • Purchases: ${totalBuyTurnover.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className='text-xs text-gray-500'>
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InvManagement;

// import React, { useState, useEffect, useRef, useCallback } from 'react'
// import BackButton from '../components/shared/BackButton';
// import { useQuery, keepPreviousData } from '@tanstack/react-query';
// import { enqueueSnackbar } from 'notistack';
// import { LuPrinterCheck } from "react-icons/lu";


// import { api, getInvoices } from '../https';
// import InvoicesDetails from '../components/invoice/InvoicesDetails';

// import { toast } from 'react-toastify'

// import { Select, Progress, Flex } from 'antd'
// import moment from 'moment';
// import ManagementReport from '../components/invoice/ManagementReport';
// import InvoiceDetails from '../components/invoice/InvoiceDetails';
   
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// const InvManagement = () => {

//     const [allInvoices, setAllInvoices] = useState([]);

//     const [frequency, setFrequency] = useState('365');
//     const [type, setType] = useState('bills');
//     const [invoiceType, setInvoiceType] = useState('all');
//     const [invoiceStatus, setInvoiceStatus] = useState('all');
//     const [customer, setCustomer] = useState('all');
//     const [supplier, setSupplier] = useState('all');
//     const [shift, setShift] = useState('all');

//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');
//     const [loading, setLoading] = useState(false);
  
//     // fetch Invoices

//     const fetchInvoices = useCallback(async () => {
//         setLoading(true)
//         try {
//             const response = await api.post('/api/invoice/fetch' , 
//             {
//                     type,
//                     frequency,
//                     invoiceType,
//                     invoiceStatus,
//                     customer,
//                     supplier,
//                     shift,

//                     search,
//                     sort,
                    
//                     page: 1,
//                     limit: 1000
//                 },
//             );
                
//                 setAllInvoices(response.data)
//                 console.log(response.data)

//             if (response.data.success) {
//                 setAllInvoices(response.data.data || []);
              
//             } else {
//                 toast.error(response.data.message || 'invocies not found')
//             }
    
//         } catch (error) {
//             // Show backend error message if present in error.response
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message)
//             }
//             console.log(error)
//         } finally {
//             setLoading(false);
//          }
//     });

//     const isInitialMount = useRef(true);
//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//         } else {
//             fetchInvoices();
//         }
//     }, [type, frequency, invoiceType, invoiceStatus, shift, search, sort]);

//     // Percentage and count
//     const totalInvoices = allInvoices.length;  

//     const totalSaleInvoices = allInvoices.filter(
//         (invoice) => invoice.invoiceType === "Sale invoice"
//     );
//     const totalBuyInvoices = allInvoices.filter(
//         (invoice) => invoice.invoiceType  === "Purchase invoice" //&& invoice.invoiceStatus === "Completed" 
//     );
//     const totalIncomePercent = (totalSaleInvoices.length / totalInvoices) * 100 ;
//     const totalExpensePercent = (totalBuyInvoices.length / totalInvoices) * 100 ;
//     // Total amount 
//     const totalTurnover = allInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0) ;
//     const totalSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.total, 0);
    
//     const totalBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice').reduce((acc, invoice) => acc + invoice.bills.total, 0);
//     const totalSaleTaxTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.tax, 0);
    
//     const totalWithTaxBuyTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Purchase invoice').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);
//     const totalWithTaxSaleTurnover = allInvoices.filter(invoice => invoice.invoiceType === 'Sale invoice').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);

//     // Percentage
//     const totalSaleTurnoverPercent = (totalSaleTurnover / totalTurnover) * 100 ;
//     const totalBuyTurnoverPercent = (totalBuyTurnover / totalTurnover) * 100 ;
    
//     // const twoColors = {
//     //     '0%': '#108ee9',
//     //     '100%': '#87d068',
//     // };
//     // const conicColors = {
//     //     '0%': '#87d068',
//     //     '50%': '#ffe58f',
//     //     '100%': '#ffccc7',
//     // };

//     const data = [
//         { name: 'Sale', value: totalSaleTurnover, color: '#10b981' },
//         { name: 'Purchase', value: totalBuyTurnover, color: '#0ea5e9' }
//     ];

//     // Printing
//     const invoiceRef = useRef(null)
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML
//         const WinPrint = window.open("", "", "width=900, height=650")

//         WinPrint.document.write(` 
//                 <html>
//                     <head>
//                         <title>Invoices Management</title>
//                         <style>
//                             body { font-family: Arial, sans-serif; padding: 20px; }
//                             .receipt-container { width: 100%; }
//                             h2 { text-align: center; }
//                             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//                             th { background-color: #f2f2f2; }
//                             .IdTd {display: none ;}
//                             .updateTd {display: none ;}
//                             .statusTr {display: none ;}
//                             .controls { display: none; }
//                             .button { display: none; }
//                             .backButton {display: none; }
//                             .search {display : none; } 
//                             .tdFooter {display : none; }
//                         </style>
//                     </head>
//                     <body>
//                         ${printContent}
//                     </body>
//                 </html>
//             `)

//         WinPrint.document.close()
//         WinPrint.focus()
//         setTimeout(() => {
//             WinPrint.print()
//             WinPrint.close()
//         }, 1000)
//     };

//     return (
//         <section className ='flex gap-3 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-[#f5f5f5]'>
            
//             <div className ='flex-[3] bg-white h-[100vh] overflow-y-scroll scrollbar-hidden'>
//                 <div ref={invoiceRef} className=''>
                
              
//                 <div className ='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
//                     <div className='backButton flex items-center gap-2'>
//                         <BackButton />
//                         <h1 className='text-md font-semibold text-[#1a1a1a]'>Invocies Management</h1>
//                     </div>
//                     <div className='flex justify-end button  items-center cursor-pointer gap-3'>
//                             <button
//                                 onClick={handlePrint}
//                                 className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
//                             >
//                                 <LuPrinterCheck className="w-4 h-4" />
//                                 Print
//                             </button>
//                     </div>
//                 </div>

          
//                 {/* Search and sorting and Loading */}
//                 <div className="search flex items-center px-15 py-2 shadow-xl">
//                     <input
//                         type="text"
//                         placeholder="Search ..."
//                         className="border border-yellow-700 p-1 rounded-lg w-full text-xs font-semibold"
//                         // max-w-md
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                     {/* Optional: Sort dropdown */}
//                     <select
//                         className="ml-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
//                         value={sort}

//                         onChange={(e) => {
//                             setSort(e.target.value);
//                             setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                         }}
//                     >
//                         <option value="-createdAt">Newest First</option>
//                         <option value="createdAt">Oldest First</option>
//                     </select>
//                 </div>

//                 {/* Loading Indicator */}
//                 {loading && (
//                     <div className="mt-4 flex justify-center">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
//                         <span className="ml-2">Loading ...</span>
//                     </div>
//                 )}


//                 <div className ='mt-5 bg-white py-1 px-10'>

//                     <div className='overflow-x-auto'>
//                         <table className='text-left w-full'>
//                             <thead className=''>
//                                 <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                     <th className='p-1'></th>
//                                     <th className='p-1 hide-print'>Type</th>
//                                     <th className='p-1 ml-0'></th>
//                                     <th className='p-1'>Items</th>
                                    
//                                     <th className='p-1'>Customer</th>
//                                     <th className='p-1'>Supplier</th>
                                  
//                                     <th className='p-1'>Total</th>
//                                     <th className='p-1'>Tax</th>
//                                     <th className='p-1'>Grand Total</th>
//                                     <th className='p-1'>Payed</th>
//                                     <th className='p-1'>Balance</th>
//                                     <th className='p-1 statusTr'>Status</th>
                                
//                                 </tr>
//                             </thead>

                                 
//                                 <tbody>
//                                     { 
//                                     allInvoices.map((invoice) =>{  
                                    
//                                     return (   
//                                     <InvoiceDetails  
//                                     fetchInvoices ={fetchInvoices}

//                                     id ={invoice._id} date ={invoice.date} type ={invoice.invoiceType} shift ={invoice.shift} 
//                                     length ={invoice.items === null? 'N/A' : invoice.items.length} customer ={invoice.customer === null? 'N/A' : invoice.customerName}
//                                     supplier ={invoice.supplier === null? 'N/A' : invoice.supplierName} payment ={invoice.paymentMethod}total ={invoice.bills.total} tax={invoice.bills.tax}
//                                     totalWithTax={invoice.bills.totalWithTax} payed={invoice.bills.payed} balance ={invoice.bills.balance} status={invoice.invoiceStatus} items={invoice.items}
                                    
//                                     />
//                                         )
//                                       })
//                                     }
//                                 </tbody> 
//                             {/* <tfoot>
//                                 <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-600 text-xs font-semibold">
//                                     <td className="p-2 text-[#1a1a1a]">{allInvoices.length}
//                                         <span className='font-normal'>   Invoice</span></td>

//                                     <td className="p-2" colSpan={15}></td>
                                  
//                                 </tr>
//                             </tfoot> */}

//                                 {/* Footer Section */}
//                                 {allInvoices.length > 0 && (


//                                     <tfoot className='bg-[#F1E8D9] border-t-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                         <tr>
//                                             <td className='p-2' colSpan={1}>{allInvoices.length} فاتوره</td>

//                                             <td className='p-2' colSpan={3}>
//                                                 Purchases : {allInvoices.filter(t => t.invoiceType === 'Purchase invoice')
//                                                     .reduce((sum, t) => sum + t.bills.totalWithTax, 0).toFixed(2)}
//                                             </td>

//                                             <td className='p-2' colSpan={3}>
//                                                 Sales : {allInvoices.filter(t => t.invoiceType === 'Sale invoice')
//                                                     .reduce((sum, t) => sum + t.bills.totalWithTax, 0).toFixed(2)}
//                                             </td>

//                                             <td className='p-2' colSpan={3}>
//                                                 Profits : {(
//                                                     allInvoices.filter(t => t.invoiceType === 'Sale invoice').reduce((sum, t) => sum + t.bills.totalWithTax, 0) -
//                                                     allInvoices.filter(t => t.invoiceType === 'Purchase invoice').reduce((sum, t) => sum + t.bills.totalWithTax, 0)
//                                                 ).toFixed(2)} AED
//                                             </td>
//                                             <td></td><td className='tdFooter'></td>

//                                         </tr>

//                                     </tfoot>
//                                 )}



//                         </table>
//                         {!loading && allInvoices.length === 0 && (
//                             <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start '>
//                                 {search
//                                     ? `No invoice found for "${search}"`
//                                     : `Your invoices list is empty . Start adding invoice !`}
//                             </p>
//                         )}
                                    
//                     </div>
            
//                 </div>

//                 </div>
                    
//             </div>            

//             <div className ='flex-[1] bg-white px-2 py-3'>
                
//                 <div className="flex gap-2 items-center px-15 py-2 shadow-xl bg-white">
//                     <select id='frequency' value={frequency} onChange={(e) => setFrequency(e.target.value)}
//                         className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
//                         <option value='90'> 90 Days</option>
//                         <option value='60'> 60 Days</option>
//                         <option value='30'> 30 Days</option>
//                         <option value='7'> 7 Days</option>
//                         <option value='1'>1 Day</option>

//                     </select>


//                     <select id='orderStatus' value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)}
//                         className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
//                         <option value='all'>All</option>
//                         <option value='In Progress'>In Progess</option>
//                         <option value='Completed'>Completed</option>
//                         <option value='Cancelled'>Cancelled</option>
//                         <option value='Pending'>Pending</option>

//                     </select>


//                     <select id='shift' value={shift} onChange={(e) => setShift(e.target.value)}
//                         className='border-b border-yellow-700 rounded-sm px-2 py-1 text-sm'>
//                         <option value='all'>All</option>
//                         <option value='Morning'>Morning</option>
//                         <option value='Evening'>Evening</option>
//                     </select>
//                 </div>

//                 <div className ='flex flex-col items-start mt-2 bg-white'>
//                     <p className='text-xs text-[#1a1a1a] font-semibold ml-2 mb-2 mt-2'>Count of Invoices :-</p>
                    
//                     <div className='flex items-center justify-between w-full p-3 rounded-sm'>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <p className ='text-xs font-normal text-[#1a1a1a] '>
//                                 <span className ='text-xs font-medium text-[#0ea5e9]'>Count of sales : </span>
//                                 {totalSaleInvoices.length}
//                             <span className = 'text-xs font-normal text-[#0ea5e9]'> invoices</span>
//                             </p>
//                         </div>
//                         <div className ='flex  items-center justify-center gap-3'>
//                             <p className ='text-xs font-normal text-[#1a1a1a] '>
//                                 <span className ='text-xs font-medium text-[#0ea5e9]'>Count of purchase : </span>
//                                 {totalBuyInvoices.length}
//                             <span className = 'text-xs font-normal text-[#0ea5e9]'> invoices</span>
//                             </p>
//                         </div>
//                     </div>

//                 </div>
              

//                <p className ='text-xs text-[#1a1a1a] font-semibold ml-2 mb-2 mt-2'>Invoices total :-</p>
//                 <div className ='flex flex-col items-start  bg-white rounded-sm'>
//                     <div className ='flex items-center justify-between w-full px-1'>
//                         <div className ='flex items-center justify-betwee p-2'>
//                             <p className ='font-semibold text-md text-[#be3e3f]'>
//                                 <span className ='text-xs font-normal text-[#1a1a1a]'>Sales tax : </span>
//                                 {totalSaleTaxTurnover.toFixed(2)}
//                                 <span className ='font-normal text-xs text-[#1a1a1a]'> AED</span>
//                             </p>
//                         </div>
//                         {/* <div className ='flex items-end justify-end  p-2 '>
//                             <p className ='font-semibold text-md text-[#be3e3f]'>
//                                 <span className ='text-xs font-normal text-[#1a1a1a]'>Sales discount : </span>0
//                                 <span className ='font-normal text-xs text-[#1a1a1a]'> AED</span>
//                             </p>
//                         </div> */}
//                         <div className='flex items-start justify-start p-2'>
//                             <p className='font-semibold text-md text-[#0ea5e9]'>
//                                 <span className='text-xs font-normal text-[#1a1a1a]'>Sale total : </span>
//                                 {totalSaleTurnover.toFixed(2)}<span className='font-normal text-xs text-black'> AED</span>
//                             </p>
//                         </div>
//                     </div>

//                     <div className ='flex items-center justify-between w-full px-1'>
                    
//                         <div className='flex items-start justify-start p-2'>
//                             <p className='font-semibold text-md text-emerald-600'>
//                                 <span className='text-xs font-normal text-[#1a1a1a]'>Sale G-Total : </span>
//                                 {totalWithTaxSaleTurnover.toFixed(2)}
//                                 <span className='font-normal text-xs text-[#1a1a1a]'> AED</span>
//                             </p>
//                         </div>

//                         <div className='flex items-end justify-end  p-2'>
//                             <p className='font-semibold text-md text-[#0ea5e9]'>
//                                 <span className='text-xs font-normal text-[#1a1a1a]'>Purchase total : </span>
//                                 {totalBuyTurnover.toFixed(2)}
//                                 <span className='font-normal text-xs text-[#1a1a1a]'> AED</span>
//                             </p>
//                         </div>

//                     </div>

//                     <div className ='flex items-center justify-between w-full px-1'>
                      
//                         <div className ='flex items-end justify-end  p-2'>
//                             <p className ='font-semibold text-md text-emerald-600'>
//                                 <span className ='text-xs font-normal text-[#1a1a1a]'>Purchase G-Total : </span>
//                                 {totalWithTaxBuyTurnover.toFixed(2)}
//                                 <span className ='font-normal text-xs text-black'> AED</span>
//                             </p>
//                         </div>

//                         <div className='flex items-end justify-end  p-2'>
//                             <p className={`${totalSaleTurnover - totalBuyTurnover <= 0 ? 'text-[#0ea5e9]' : 'text-green-600'} text-center font-semibold text-md`}>
//                                 <span className='text-xs font-normal text-blue-600'>Expected Profits = </span>
//                                 {(totalSaleTurnover - totalBuyTurnover).toFixed(2)}
//                                 <span className='font-normal text-xs text-black'> AED</span></p>

//                         </div>
//                     </div>


//                 </div>

//                 {/* <div className ='flex flex-col items-start mb-5'>
//                     <p className ='text-sm text-[#1a1a1a] font-semibold ml-2 mb-1'>Invoices percentage :-</p>
//                     <div className ='flex items-center justify-between w-full px-15'>
//                         <div className ='flex items-start justify-start p-1'>
//                             <p className ='font-semibold text-lg text-green-600'>
//                                 <span className ='text-xs font-medium text-[#1a1a1a]'>Sale invoices : </span>
//                                 {totalSaleTurnoverPercent.toFixed(0)} 
//                                 <span className = 'font-medium text-xs text-black'> %</span>
//                             </p>
//                         </div>

//                         <div className ='flex items-start justify-start shadow-lg/30 p-1 rounded-lg bg-zinc-100'>
//                             <Progress type ='circle' strokeColor={twoColors}  size={60} percent ={totalSaleTurnoverPercent.toFixed(0)} />
//                         </div>

//                     </div>
//                 </div> */}
//                 {/* <div className ='flex flex-col items-start'>       
//                     <div className ='flex items-center justify-between w-full px-15'>
                     
//                         <div className ='flex items-end justify-end  p-1'>
//                             <p className ='font-semibold text-lg text-sky-600'><span className ='text-xs font-medium text-blue'>Purchase invoices : </span>{totalBuyTurnoverPercent.toFixed(0)} <span className = 'font-medium text-xs text-black'> %</span></p>
//                         </div>
//                         <div className ='flex items-end justify-end shadow-lg/30 rounded-lg bg-zinc-100 p-1'>
//                             <Progress type ='circle' strokeColor={conicColors}  size={60} percent ={totalBuyTurnoverPercent.toFixed(0)} />
//                         </div>
//                     </div>
//                 </div> */}

//                 <div className='flex flex-col items-start mt-8'>
//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>Graphical Explanation :-</p>

//                     <div className='w-full h-50'>
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={data}
//                                     cx="50%"
//                                     cy="50%"
//                                     innerRadius={60}
//                                     outerRadius={80}
//                                     paddingAngle={5}
//                                     dataKey="value"
//                                 >
//                                     {data.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={entry.color} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip
//                                     formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
//                                 />
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>

//                     <div className='flex justify-between w-full mt-4 text-xs'>
//                         <div className='text-center'>
//                             <div className='w-4 h-4 bg-green-500 rounded-full mx-auto mb-1'></div>
//                             <div>Sale: AED {totalSaleTurnover.toFixed(2)}</div>
//                             <div className='text-green-600 font-semibold'>{totalSaleTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                         <div className='text-center'>
//                             <div className='w-4 h-4 bg-[#0ea5e9] rounded-full mx-auto mb-1'></div>
//                             <div>Burchase: AED {totalBuyTurnover.toFixed(2)}</div>
//                             <div className='text-[#0ea5e9] font-semibold'>{totalBuyTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                     </div>

//                 </div>  
//             </div>

        

//         </section>
//     );
// };




// export default InvManagement ;