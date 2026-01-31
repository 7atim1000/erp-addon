import React , {useState, useEffect}from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from "react-icons/io5";

import { useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { addSalary, updateSalary, updateUserSalary } from '../../https';
import { toast } from 'react-toastify'

const AddSalary = ({setIsAddSalaryModal}) => {

    const employeeData = useSelector((state) => state.employee);

    const handleClose = () => {
        setIsAddSalaryModal(false);


    }


    const [formData, setFormData] = useState({
        basicSalary :"", subsistence :"" , housingAllowance :"" , depotationAllowance : "" , incentives :"" , finalSalary :"", expectedSalary :"",
        employee : "", empName : "", department :"", jobTitle :""
    });

    useEffect(() => {
    if (employeeData) {

        const basic = parseFloat(formData.basicSalary) || 0;
        const subsistence = parseFloat(formData.subsistence) || 0;
        const housingAllowance = parseFloat(formData.housingAllowance) || 0;
        const depotationAllowance = parseFloat(formData.depotationAllowance) || 0;
        const incentives = parseFloat(formData.incentives) || 0;

        const sum = basic + subsistence + housingAllowance + depotationAllowance + incentives ;


        setFormData((prev) => ({
            ...prev,

            employee: employeeData.empId || "",
            employeeNo: employeeData.employeeNo || "",
            empName: employeeData.empName || "",
            department: employeeData.department || "",
            jobTitle: employeeData.empJob || "",

            finalSalary: sum ? sum.toFixed(2) : "0.00",
            expectedSalary : sum ? sum.toFixed(2) : "0.00"

            }));
        }

    }, [employeeData  ,formData.basicSalary, formData.subsistence, formData.housingAllowance, formData.depotationAllowance, formData.incentives]);




    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const handleSubmitSalary = (e) => {

        e.preventDefault();
        console.log(formData)

        salaryMutation.mutate(formData)
            handleUpdateSalary();
            handleUpdateUserSalary();

            window.location.reload()
            setIsAddSalaryModal(false)
 
    };


    const salaryMutation = useMutation({
        mutationFn: (reqData) => addSalary(reqData),

        onSuccess: (resData) => {
            const { data } = resData.data; 
            console.log(data);           

            // setTimeout(() => {
            //     salaryUpdateMutation.mutate(salaryData)
            //     handleUpdateSalary();
            // }, 1500)


        },


        onError: (error) => {
            console.log(error);
        }
    });


    const handleUpdateSalary = () => {

    updateSalary({
        employeeId: employeeData.empId, // or employeeData._id, depending on your data
        empSalary: Number(formData.finalSalary)
    })
    .then(res => {
        // handle success (e.g., show a message, close modal, refresh data)
    })
    .catch(err => {
        // handle error (e.g., show error message)
    });
};


    const handleUpdateUserSalary = () => {

    updateUserSalary({
        employeeNo: employeeData.employeeNo , // or employeeData._id, depending on your data
        userSalary: Number(formData.finalSalary)
    })
    .then(res => {
        // handle success (e.g., show a message, close modal, refresh data)
    })
    .catch(err => {
        // handle error (e.g., show error message)
    });
};




    return (
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50'
         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }} >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll 
                scrollbar-hidden  border-b-4 border-yellow-700'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-1">
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-[#1a1a1a] text-md font-bold'>Salary monthly definition</h2>
                        <p className='text-sm text-[#0ea5e9] font-medium'> <span className='text-[#1a1a1a] font-normal text-sm'>
                            Salary monthly definition for employee : </span> {employeeData.empName} </p>
                   
                    </div>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                        border-b border-[#be3e3f]'>
                        <IoCloseCircle size={25} />
                    </button>
                </div>

                {/*Modal Body  onSubmit={handlePlaceOrder}*/}
                <form onSubmit={handleSubmitSalary} className='mt-5 space-y-6' >

                    <div className ='flex justify-between items-center  shadow-xl  shadow-xl'>
                        <label className='w-[50%] text-[#1f1f1f] block px-4 text-sm font-normal'>Basic Salary :</label>
                        <div className='flex w-[50%] items-center p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='basicSalary'
                                value={formData.basicSalary}
                               
                               onChange={handleInputChange}

                                placeholder='Basic Salary'
                                className='bg-transparent w-full flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className ='flex justify-between items-center shadow-xl'>
                        <label className='w-[50%] text-[#1f1f1f] block text-sm px-3 font-normal'>Subsistence :</label>
                        <div className='flex w-[50%] items-center p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='subsistence'
                                value={formData.subsistence}
                              
                                onChange={handleInputChange}

                                placeholder='Subsistence'
                                className='bg-transparent w-full flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                    <div className='mt-2 flex items-center justify-between shadow-xl '>
                        <label className=' w-[50%] text-[#1f1f1f] block px-3 text-sm font-normal'>Housing Allowance :</label>
                        <div className='flex w-[50%] items-center p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='housingAllowance'
                                value={formData.housingAllowance}
                                
                                onChange={handleInputChange}

                                placeholder='Housing Allowance'
                                className='bg-transparent w-full flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    
                    <div className='mt-2  flex items-center justify-between shadow-xl'>
                        <label className='w-[50%] text-[#1f1f1f] block px-3 text-sm font-normal'>Depotation Allowance :</label>
                        <div className='flex w-[50%] items-center p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='depotationAllowance'
                                value={formData.depotationAllowance}

                                onChange={handleInputChange}

                                placeholder='Depotation Allowance'
                                className='bg-transparent w-full flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    
                    <div className='mt-2 flex items-center justify-between shadow-xl'>
                        <label className='w-[50%] text-[#1f1f1f] block  px-3 text-sm font-normal'>Incentives :</label>
                        <div className='flex w-[50%] items-cente p-3 bg-white shadow-xl '>
                            <input
                                type='text'
                                name='incentives'
                                value={formData.incentives}
                                
                                onChange={handleInputChange}

                                placeholder='Incentives'
                                className='bg-transparent w-full flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    
                    <div className='mt-2 flex items-center justify-between shadow-xl'>
                        <label className='w-[50%] block  text-sm px-3 font-normal'>Final salary :</label>
                        <div className='flex w-[50%] items-center p-3 shadow-xl bg-[#F1E8D9] text-white rounded-sm'>
                            <input
                                type='text'
                                name='finalSalary'
                                value={formData.finalSalary}
                                onChange={handleInputChange}

                                placeholder=''
                                className='bg-transparent flex-1 w-full text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold '
                                required
                                autoComplete='none'
                                readOnly
                            />
                        </div>
                    </div>

                    <div className ="hidden">
                        <label className='block mb-2 mt-3 text-sm font-normal'>Expected salary :</label>
                        <div className='flex items-center py-3 px-4 shadow-lg/30  text-white'>
                            <input
                                hidden
                                type='text'
                                name='expectedSalary'
                                value={formData.expectedSalary}
                                onChange={handleInputChange}

                                placeholder=''
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                                readOnly
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='p-2 rounded-lg mt-3 py-3 text-sm bg-[#0ea5e9] border-b-2 text-white font-semibold cursor-pointer'
                    >
                       Confirm Salary
                    </button>

                  

                </form>
            </motion.div>
        </div>

    );
};



export default AddSalary ;