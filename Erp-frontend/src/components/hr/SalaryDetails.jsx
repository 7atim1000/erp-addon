import React , { useEffect ,useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion'

import { api } from '../../https' 
import { toast } from 'react-toastify'

const SalaryDetails = ({setIsDetailsSalaryModal}) => {

    const employeeData = useSelector(state => state.employee);

    // fetch empSalary
    const empName = employeeData.empName;
    const department = employeeData.department ;

    const [list, setList] = useState([]);
    const fetchempSalary = async() => {
                
        try {

            const res = await api.post('/api/salary/fetch',
                {empName, department}
            );

            setList(res.data.salaries)
            //setList(res.data.cart)
            console.log(res.data.salaries)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    console.log(empName , department)
    
    useEffect(() => {
        fetchempSalary()

    }, [empName])  // with out department



    // Printing
    const invoiceRef = useRef(null);

    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Order Receipt</title>
                        <style>
                            body { fonst-family: Arial, sans-serif; padding: 20px; }
                            .receip-container { width: 300px; border: 1px solid #ddd; padding: 10px;}
    
                            h2 {text-align: center;}
                        </style>
                </head>
                <body>
                    ${printContent}
                </body>
        </html>
        `);

        WinPrint.document.close();
        WinPrint.focus();
        setTimeout(() => {
            WinPrint.print();
            WinPrint.close();
        }, 1000);
    }



    return (
        <div className='fixed inset-0 bg-opacity-50 flex justify-center items-center' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
            <div className='bg-white p-4 rounded-lg shadow-lg  w-[400px] h-[calc(100vh-2rem)]'>
                {/* Receipt content for printing */}
                <div ref={invoiceRef} className='p-4'>

                    {/*Receipt Header*/}
                    <div className='flex justify-center nb-4'>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.0, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                            className='mt-0 w-12 h-12 border-8 border-yellow-700 rounded-full flex items-center'
                        >
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className='text-2xl'
                            >

                            </motion.span>

                        </motion.div>

                    </div>

                    <h2 className='text-xl font-bold text-center mb-2'>Salary monthly details</h2>
                   
                    <p className={`text-start text-sky-600 text-xs font-semibold mt-2`}>Salary monthly details for :
                       <span className ='font-semibold text-black text-md underline '> {employeeData.empName}</span>
                    </p>
                    <p className={`text-start text-sky-600   text-xs font-semibold mt-2`}>Department :
                       <span className ='font-semibold text-black text-md '> {employeeData.department}</span>
                    </p>

                   
                    <p className={`text-start text-gray-600 mt-2`}>
                       <span className ='text-xs font-semibold text-black'>Final Salary : </span> 
                       <span className ='font-semibold text-md text-sky-600 underline'>{employeeData.empSalary}</span>
                       <span className ='text-black text-xs font-normal'> AED</span>
                    </p>

         

                    {/*salary details*/}
                    <div className='mt-4 border-t pt-4'>
                        <h3 className='text-sm font-semibold mb-2'>Salary details :</h3>
                  
                        <div className='text-sm text-[#1f1f1f] mt-5'>

                            {
                                list.map((salary, index) => (

                                <div key={index} className='flex flex-col justify-between items-center'>
                                    <div className='flex justify-between w-full'>
                                        <span className='text-xs text-medium'>Basic salary :</span>
                                        <span className='text-sm font-bold'>{salary.basicSalary.toFixed(2)}
                                            <span className='text-xs font-normal text-sky-600'> AED</span>
                                        </span>
                                    </div>
                                
                                    <div className='flex justify-between w-full border-t border-gray-200 mt-2'>
                                        <span className='text-xs text-medium'>Subsistence :</span>
                                        <span className='text-sm font-bold'>{salary.subsistence.toFixed(2)}
                                            <span className='text-xs font-normal text-sky-600'> AED</span>
                                        </span>
                                    </div>

                                     <div className='flex justify-between w-full border-t border-gray-200 mt-2'>
                                        <span className='text-xs text-medium'>Housing allowance :</span>
                                        <span className='text-sm font-bold'>{salary.housingAllowance.toFixed(2)}
                                            <span className='text-xs font-normal text-sky-600'> AED</span>
                                        </span>
                                    </div>

                                     <div className='flex justify-between w-full border-t border-gray-200 mt-2'>
                                        <span className='text-xs text-medium'>Depotation allowance :</span>
                                        <span className='text-sm font-bold'>{salary.depotationAllowance.toFixed(2)}
                                            <span className='text-xs font-normal text-sky-600'> AED</span>
                                        </span>
                                    </div>

                                     <div className='flex justify-between w-full border-t border-gray-200 mt-2'>
                                        <span className='text-xs text-medium'>Incentives :</span>
                                        <span className='text-sm font-bold'>{salary.incentives.toFixed(2)}
                                            <span className='text-xs font-normal text-sky-600'> AED</span>
                                        </span>
                                    </div>

                                     <div className='flex justify-between w-full border-t border-gray-200 mt-10 bg-[#D2B48C] p-3'>
                                        <span className='text-xs text-medium'>Final salary :</span>
                                        <span className='text-sm font-bold'>{salary.finalSalary.toFixed(2)}
                                            <span className='text-xs font-normal text-sky-600'> AED</span>
                                        </span>
                                    </div>
                               

                               

                                </div>
                                
                            ))}
                        </div>
                    </div>




                </div>

                {/** Buttons */}
                <div className='flex justify-between mt-4'>
                    <button
                        onClick={handlePrint}
                        className='text-sky-600 font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        Print Salary
                    </button>
                    <button
                        onClick={() => setIsDetailsSalaryModal(false)}
                        className='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>

    );
};



export default SalaryDetails ;