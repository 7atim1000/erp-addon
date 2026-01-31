import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    //////////////////////////////////////////////////
    // isAuth: !!localStorage.getItem('token'), // Check token on load
    // user: JSON.parse(localStorage.getItem('user')) || null,
    ///////////////////////////////////////////////////

   _id: "",
   employeeNo: "",
   name: "",
   password: "",
   phone: "",
   email: "",
   role: "",
   department: "",
   userJob: "",
   jobNo :"",
   jobDate :"",
   userSalary: "",

   image :"",
  isAuth: false,
}

const userSlice = createSlice ({
    name: "user",

    initialState,
    reducers: {

        setUser: (state, action) => {
            const { _id, employeeNo, name, password, phone, email, role, department, userJob, jobNo, jobDate, userSalary, image } = action.payload;
            
            state._id = _id;
            state.employeeNo = employeeNo, 
            state.name = name;
            state.password = password;
            state.phone = phone;
            state.email = email;
            state.role = role;
            state.department = department;
            state.userJob = userJob;
            state.jobNo = jobNo;
            state.jobDate = jobDate;
            state.userSalary = userSalary;

            state.image = image ;

            state.isAuth = true;
        },

        removeUser: (state) => {
            state._id= "";
            state.employeeNo = ""
            state.name= "";
            state.password = "";
            state.phone= "";
            state.email= "";
            state.role= "";
            state.department= "";
            state.userJob= "";
            state.userSalary = "";
            
            state.image = "";

            state.isAuth= false;
        },


      
        // login(state, action) {
        //     state.isAuth = true;
        //     state.user = action.payload.user;
        //     localStorage.setItem('token', action.payload.token);
        //     localStorage.setItem('user', JSON.stringify(action.payload.user));
        // },
        // logout(state) {
        //     state.isAuth = false;
        //     state.user = null;
        //     localStorage.removeItem('token');
        //     localStorage.removeItem('user');
        // },
      
    }
})


export const { setUser, removeUser  ,login, logout } = userSlice.actions;
export default userSlice.reducer;
