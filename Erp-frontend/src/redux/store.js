import { configureStore } from '@reduxjs/toolkit'

import customerSlice from './slices/customerSlice'
import customerExchangeSlice from './slices/customerExchangeSlice'

import supplierSlice from './slices/supplierSlice'
import supplierReceiptSlice from './slices/supplierReceiptSlice'

import saleSlice from './slices/saleSlice';
import buySlice from './slices/buySlice';
import invoiceSlice from './slices/invoiceSlice';
import receiptSlice from './slices/receiptSlice';

import userSlice from './slices/userSlice';
import employeeSlice from './slices/employeeSlice';
import salariesSlice from './slices/salariesSlice';

import exchangeSlice from './slices/exchangeSlice';


const store = configureStore({
    
    reducer :{

        customer :customerSlice,
        customerExchange : customerExchangeSlice,
        
        
        supplier :supplierSlice,
        supplierReceipt :supplierReceiptSlice,

        sale :saleSlice,
        buy :buySlice,
        invoice : invoiceSlice,
        receipt : receiptSlice,

        exchange :exchangeSlice,

        user: userSlice,
        employee: employeeSlice,

        salaries: salariesSlice,
    },


    devTools: import.meta.env.NODE_ENV !== "production",
});




export default store ;

