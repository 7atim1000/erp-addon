import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    empId :"",
    employeeNo :"",
    empName : "",
    contactNo : "",
    empSalary : "",

    department :"",
    empJob :"",
}

const employeeSlice = createSlice({
    name: "employee",

    initialState,

    reducers: {

        setEmployee: (state, action) => {
            const { empId, employeeNo, empName, contactNo , empSalary, department, empJob } = action.payload;

            state.empId = empId;
            state.employeeNo = employeeNo;
            state.empName = empName;
            state.contactNo = contactNo;
            state.empSalary = empSalary;

            state.department = department;
            state.empJob = empJob;

        },
        removeEmployee: (state) => {
            state.empId = "";
            state.employeeNo ="";
            state.empName = "";
            state.contactNo = "";
            state.empSalary = "";

            state.department ="";
            state.empJob ="";
        },

     
    }
});

export const { setEmployee, removeEmployee } = employeeSlice.actions ;
export default employeeSlice.reducer;

