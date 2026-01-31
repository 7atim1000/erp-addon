import { createSlice } from '@reduxjs/toolkit' ;

const initialState = [] ;

const exchangeSlice = createSlice ({
    name :'exchange',
    
    initialState, 

    reducers :{

        addExchange :(state, action) => {
            state.push(action.payload);
        },
        removeExchange :(state, action) => {
            return state.filter(item => item.id != action.payload)
        },
        removeAllExchange :(state) => {
            return [];
        },
    }

});

export const getExchangeTotalPrice = (state) => state.exchange.reduce((total, item) => total + item.price, 0);

export const { addExchange, removeExchange, removeAllExchange } = exchangeSlice.actions ;
export default exchangeSlice.reducer ;
