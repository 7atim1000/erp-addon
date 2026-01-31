import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    
    exchangeId :"",
    customerId :"",
    customerName : "",
    email :"",
    contactNo : "",
    address :"",
    balance : "",

    item: null
}

const customerExchangeSlice = createSlice({
    name :"customerExchange",

    initialState,

    reducers :{
        
        setCustomerExchange :(state, action) => {
            const { customerId, customerName , email, contactNo,  address, balance } = action.payload ;

            state.exchangeId = `${Date.now()}`;

            state.customerId = customerId;
            state.customerName = customerName ;
            state.email = email ;
            state.contactNo = contactNo;
            state.address = address;

            state.balance = balance;
        },
        removeCustomerExchange :(state) => {
            state.customerId = "";
            state.customerName = "" ;
            state.email = "" ;
            state.contactNo = "";
            state.address = "";
            
            state.balance = "";
            state.item = null;
        },
        
        updateExchangeItem :(state, action) => {
            state.item = action.payload.item;
        }
    }
});

export const { setCustomerExchange, removeCustomerExchange, updateExchangeItem } = customerExchangeSlice.actions ;
export default customerExchangeSlice.reducer;
