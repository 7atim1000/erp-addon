import React , { useState } from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { useDispatch } from 'react-redux'
import { addDetails } from '../../redux/slices/salariesSlice';

import { toast } from 'react-toastify' ;

const SalariesCard = ({id, department, employeeNo , empName , jobTitle, final, deduction, expected}) => {

    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState();

    const [salaryId, setSalaryId] = useState();

    const handleAddToCard = (item) => {
        
        if (!paymentMethod) {
            //enqueueSnackbar('please select a payment method', {variant: "warning"});
            toast.warning('Please select payment method !')
            return;
        }

        if (paymentMethod === "Cash" || paymentMethod === 'Online') {

            const { empName, expected } = item;
            const newDetails = { id: `${Date.now()}`, empName, department :department, finalSalary: final, Monthlydeduction: deduction, monthlySalary: expected, paymentMethod: paymentMethod };

            dispatch(addDetails(newDetails));
            console.log(addDetails);
            setPaymentMethod(false);
        }
        
    }

  

    return (
        // bg-[#D2B48C]
        <div className ='flex flex-col justify-around w-[190px]  h-[230px] gap-0 p-1 rounded-lg cursor-pointer bg-white  hover:bg-white shadow-lg/30'>

            <div className='flex flex-col gap-1 items-start justify-center'>
                <div className='flex gap-1'>
                    {/* <FaCircleUser className='text-[#D2B48C] h-10 w-10 ' size={30} /> */}
                    <h3 style={{ color: '#1a1a1a' }} className='text-xs font-normal'>{empName}</h3>
                    <div className ='flex flex-col gap-1'>
                        <p className ='text-[#0ea5e9] text-xs font-normal underline'>{jobTitle}</p>
                        <p className='text-xs font-normal text-emerald-600 underline'>{department}</p>

                    </div>
                    
                </div>

                <p className='text-xs text-[#1a1a1a] mt-1'>Fixed Salary : 
                    <span className ='text-[#0ea5e9]'> {final.toFixed(2)}</span>
                </p>
                <p className='text-xs text-[#1a1a1a] mt-1'>Monthly deduction :
                    <span className ='text-[#be3e3f]'> {deduction.toFixed(2)}</span>
                </p>
                <p className='text-xs text-[#1a1a1a] mt-1'>Monthly Salary :
                    <span className ='text-xs font-normal text-emerald-600'> {expected.toFixed(2)}</span>
                </p>

                
                <div className ='flex items-center gap-7 justify-between'>
                <div className ='flex flex-col gap-3 mt-5'>
                    <button className={`px-4 py-2 w-full rounded-sm text-sky-600 text-sm font-semibold cursor-pointer shadow-lg/30
                        ${paymentMethod === 'Cash' ? "bg-green-600 text-white" : "bg-white"}`}
                        onClick={() => setPaymentMethod('Cash')}
                    >Cash</button>

                    <button className={`px-4 py-2 w-full rounded-sm text-green-600 text-sm font-semibold cursor-pointer shadow-lg/30
                ${paymentMethod === 'Online' ? "bg-green-600 text-white" : "bg-white "}`}
                        onClick={() => setPaymentMethod('Online')}
                    >Online</button>
                </div>
                <button className='mt-7 bg-[#0ea5e9] h-20 w-20 text-white p-2 rounded-sm text-[#1a1a1a] cursor-pointer font-semibold text-sm font-medium shadow-lg/30'
                        onClick ={() =>  handleAddToCard({id ,empName, final, deduction, expected})}
                    >Send
                    </button>
                </div>
            
                <div className='flex w-full  items-start gap-3 px-5 mt-2'>
                    
                </div>
            </div>

        
                

                

              
      

                

        </div>
    );
};



export default SalariesCard ;
