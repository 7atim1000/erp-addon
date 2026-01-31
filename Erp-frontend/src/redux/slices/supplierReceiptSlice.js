import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    receiptId :"",
    supplierId :"",
    supplierName : "",
    email : "",
    contactNo : "",
    address :"",
    balance : "",

    service: null
}

const supplierReceiptSlice = createSlice({
    name :"supplierReceipt",

    initialState,

    reducers :{
        
        setSupplierReceipt :(state, action) => {
            const { supplierId, supplierName , email, contactNo,  address, balance } = action.payload ;

            state.receiptId = `${Date.now()}`;
            state.supplierId = supplierId;
            state.supplierName = supplierName ;
            state.email = email ;
            state.contactNo = contactNo;
            state.address = address;
            state.balance = balance
        },
        
        
        removeSupplierReceipt :(state) => {
            state.supplierId = "";
            state.supplierName = "" ;
            state.email = "" ;
            state.contactNo = "";
            state.address = "";

            state.service = null;
        },
    
    }
});

export const { setSupplierReceipt, removeSupplierReceipt } = supplierReceiptSlice.actions ;
export default supplierReceiptSlice.reducer;
