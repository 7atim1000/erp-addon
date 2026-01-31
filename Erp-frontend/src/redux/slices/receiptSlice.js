import { createSlice } from '@reduxjs/toolkit' ;

const initialState = [] ;

const receiptSlice = createSlice ({
    name :'receipt',
    initialState, 

    reducers: {

        addReceipt: (state, action) => {
            state.push(action.payload);
        },
        removeReceipt: (state, action) => {
            return state.filter(item => item.id != action.payload)
        },
        removeAllReceipt: (state) => {
            return [];
        },
    }

})


export const getReceiptTotalPrice = (state) => state.receipt.reduce((total, item) => total + item.price, 0);
export const { addReceipt, removeReceipt, removeAllReceipt } = receiptSlice.actions ;
export default receiptSlice.reducer ;