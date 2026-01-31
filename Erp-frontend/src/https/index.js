import axios from 'axios'


export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});


// api end points

// Auth
export const login = (data) => api.post('/api/auth/login', data);
// export const register = (data) => api.post('/api/auth/register', data);
export const register = (data) => api.post('/api/auth/register', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const getAllUsers = () => api.get('/api/auth/users');
export const getUserData = () => api.get('/api/auth');
export const logout = () => api.post('/api/auth/logout');

export const updateUserRole = (userId, newRole) => {
    return api.put(`/api/auth/${userId}/role`, { role: newRole });
};


export const updateUserSalary = (data) => api.put(`/api/auth/${data.employeeNo}`, { userSalary: data.userSalary });
// export const updateSalary = (data) => api.put(`/api/employee/${data.employeeId}`, { empSalary: data.empSalary });

// Expenses 
export const getExpenses = () => api.get('/api/expenses');
export const addExpense = (data) => api.post('/api/expenses', data);

// income 
export const getIncomes = () => api.get('/api/incomes');
export const addIncome = (data) => api.post('/api/incomes', data);

// Categories
export const getCategories = () => api.get('/api/category');
export const addCategory = (data) => api.post('/api/category', data);

// Services
// export const getServices = () => api.get('/api/services');
export const getServices = (filters = {}) => api.post('/api/services/fetch', filters);
export const addService = (data) => api.post('/api/services', data);
export const updateService = ({serviceId, ...serviceData}) => api.put(`/api/services/${serviceId}`, serviceData);  // serviceData explain in Bill.jsx

// Units
export const getUnits = () => api.get('/api/units');
export const addUnit = (data) => api.post('/api/units', data);

// Suppliers
export const addSupplier = (data) => api.post('/api/suppliers', data);
export const updateSupplier = ({supplierId, ...balanceData}) => api.put(`/api/suppliers/balance/${supplierId}`, balanceData);  // serviceData explain in Bill.jsx


//  Customers
export const addCustomer = (data) => api.post('/api/customers', data);
export const updateCustomer = ({customerId, ...balanceData}) => api.put(`/api/customers/balance/${customerId}`, balanceData);  // serviceData explain in Bill.jsx


//  Representative
export const addRepresentative = (data) => api.post('/api/representative', data);
export const updateRepresentative = ({supplierId, ...supplierData}) => api.put(`/api/suppliers/${supplierId}`, supplierData);  // serviceData explain in Bill.jsx

// Invoices Endpoint
export const addInvoice = (data) => api.post('/api/invoice', data);
//export const getInvoices = () => api.get('/api/invoice');
export const getInvoices = (data) => api.post('/api/invoice', data);
export const updateInvoice = ({invoiceId, invoiceStatus}) => api.put(`/api/invoice/${invoiceId}`, {invoiceStatus});

export const getInvoiceById = (data) => api.post('/api/invoice/cartDetails', data);

// Transaction Endpoint
export const addTransaction = (data) => api.post('/api/transactions/add-transaction', data);


// HR
export const getPublicSalaries = () => api.get('/api/salary');
export const getSalaries = () => api.post('/api/salary/fetch');
export const addSalary = (data) => api.post('/api/salary', data);
export const updateDeduction = (data) => api.put(`/api/salary/${data.empNo}`, { deduction: data.deduction , expectedSalary: data.expectedSalary});
// export const updateSalary = (data) => api.put(`/api/employee/${data.employeeId}`, { empSalary: data.empSalary });

export const addMonthlySalaries = (data) => api.post('/api/monthlysalaries', data);
export const getMonthlySalaries = (data) => api.post('/api/monthlysalaries', data);

export const getEmployees = () => api.get('/api/employee');
export const addEmployee = (data) => api.post('/api/employee', data);


// export const updateSalary = ({employeeId, ...salaryData}) => api.put(`/api/employee/${employeeId}`, salaryData);   
export const updateSalary = (data) => api.put(`/api/employee/${data.employeeId}`, { empSalary: data.empSalary });

export const getDepartments = () => api.get('/api/department');
export const addDepartment = (data) => api.post('/api/department', data);

export const getJobs = () => api.get('/api/job');
export const addJob = (data) => api.post('/api/job', data);

export const addAttendance = (data) => api.post('/api/attendance', data);

export const addVacation = (data) => api.post('/api/vacation/', data);
export const updateVacation = ({vacationId, ...vacationStatus}) => api.put(`/api/vacation/${vacationId}`, vacationStatus);

// Stores
export const getStoresUnits = () => api.get('/api/storesunits');
export const addStoresUnits = (data) => api.post('/api/storesunits', data);

export const getStoresCategories = () => api.get('/api/storescategories');
export const addStoresCategories = (data) => api.post('/api/storescategories', data);

export const getStores = () => api.get('/api/stores');
export const addStore = (data) => api.post('/api/stores', data);

// export const getStoresItems = (sort = '-createdAt') => api.post('/api/storesitems/fetch', { sort });
// api.js
// export const getStoresItems = (storeId = null, sort = '-createdAt') => {
//     return api.get('/api/storesitems', {
//         params: {  // Using GET with query parameters
//             store: storeId,
//             sort
//         }
//     });
// };


export const getStoresItems = (sort = '-createdAt') => api.post('/api/storesitems/fetch', { sort });
export const getStoresItemsInvoice = (search = '') => api.get(`/api/storesitems?search=${search}`);

export const addStoresItems = (data) => api.post('/api/storesitems', data);

export const addStoreInvoice = (data) => api.post('/api/storeinvoice', data);



