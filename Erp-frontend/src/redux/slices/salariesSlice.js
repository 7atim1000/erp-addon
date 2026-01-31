import { createSlice } from '@reduxjs/toolkit' ;

const initialState = [] ;

const salariesSlice = createSlice ({

    name :'salaries',
    
    initialState, 

    reducers :{

        addDetails :(state, action) => {
            state.push(action.payload);
        },
        removeDetail :(state, action) => {
            return state.filter(item => item.id != action.payload)
        },
        removeAllDetails :(state) => {
            return [];
        }
    }

});




export const getTotalSalaries = (state) => state.salaries.reduce((total, item) => total + item.monthlySalary, 0);


export const { addDetails, removeDetail, removeAllDetails } = salariesSlice.actions ;
export default salariesSlice.reducer ;
