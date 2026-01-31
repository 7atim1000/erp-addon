import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getTotalSalaries, removeAllDetails } from '../../redux/slices/salariesSlice';

import { useMutation } from '@tanstack/react-query';

import { enqueueSnackbar } from 'notistack';
import { toast } from 'react-toastify'
import { addMonthlySalaries } from '../../https';
import MonthlySalariesInvoice from './MonthlySalariesInvoice';

const SalaryBills = () => {

    const dispatch = useDispatch();

    const salariesData = useSelector(state => state.salaries);
    const userData = useSelector((state) => state.user);
    const total = useSelector(getTotalSalaries);

    const [formData, setFormData] = useState({
        month :""
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    //  Invoice
    const [showInvoice, setShowInvoice] = useState(false);
    const [salaryInfo, setSalaryInfo] = useState();



    const handlePlaceSalary =() => {
        
        if (!formData.month){
            toast.warning('Please select month!')
            return;
        }

        const salaryOrderData = {
        
            salaryNumber : `${Date.now()}`,
    
            month: formData.month,
            salaryStatus: "In Progress",
            total: total,
            details: salariesData,

            bills: {
                total: total,
            },
        
            user: userData._id,
        };

       
       
       
        setTimeout(() => {
            monthlySalariesMutation.mutate(salaryOrderData);
        }, 1500)
        
    };


    const monthlySalariesMutation = useMutation ({
        mutationFn: (reqData) => addMonthlySalaries(reqData),

        onSuccess: (resData) => {
            const { data } = resData.data; 
            //console.log(data);

            setSalaryInfo(data)          
            toast.success('Monthly salaries places successfully .');

            setShowInvoice(true);

            dispatch(removeAllDetails());
            formData.month = "";
       
        },

            onError: (error) => {
                console.log(error);
            }

    })




    return (
        <>
            
            <div className ='flex flex-col gap-2 p-3 shadow-lg/30 mt-2'>
                  <p className='text-xs text-[#1a1a1a] font-normal mt-2'>Employees : 
                    <span className ='text-xs text-sky-600 font-normal'> {salariesData.length}</span>
                    
                </p>
                 <p className='ml-0 text-[#1a1a1a] text-xs font-normal'>Total Salaries : 
                    <span className='text-sm text-green-600 font-normal'> {total.toFixed(2)}</span>
                    <span className='text-xs font-normal text-[#1a1a1a]'> AED</span>
                </p>
               
                <div className ='flex gap-2 items-center '>
                <label className='text-[#1a1a1a] block text-xs font-normal'>Month : </label>   
                <form>
                    <select className='w-[125px] shadow-lg/30 text-[#1a1a1a] bg-[#F1E8D9] h-8 rounded-xs text-xs font-semibold' value={formData.month} onChange={handleInputChange} name='month' >
                        <option ></option>
                        <option value="Jan">Jan</option>
                        <option value="Feb">Feb</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="Aug">Aug</option>
                        <option value="Seb">Seb</option>
                        <option value="Oct">Oct</option>
                        <option value="Nov">Nov</option>
                        <option value="Dec">Dec</option>
                    </select>

                </form>
                </div>
            </div>

 
            <button className='w-full mt-2  bg-green-600 text-white p-5 w-full rounded-sm text-[#1a1a1a] cursor-pointer 
            font-semibold text-sm font-medium shadow-lg/30'
                onClick={handlePlaceSalary}
            >Place Salaries</button>

            {showInvoice && (
                <MonthlySalariesInvoice 
                salaryInfo ={salaryInfo} 
                setShowInvoice={setShowInvoice} />
            )}
            
        </>

    );
};




export default SalaryBills ;