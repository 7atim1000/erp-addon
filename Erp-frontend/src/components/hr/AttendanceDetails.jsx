import React , { useEffect ,useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion'

import { api } from '../../https' 
import { toast } from 'react-toastify'

const AttendanceDetails = ({setIsAttendanceModal}) => {

    const employeeData = useSelector(state => state.employee);

    // fetch empSalary
    const empName = employeeData.empName;
    const department = employeeData.department ;

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Default: newest first
    
    const [list, setList] = useState([]);
    const fetchempSalary = async() => {
                
        try {

            const res = await api.post('/api/attendance/fetch',
                {
                empName, 
                department, 
                search: searchTerm,
                sort: sortOrder
                }
            );

            setList(res.data)
            //setList(res.data.cart)
            console.log(res.data)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

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
                    <title>Employee Attendance Report</title>
                        <style>
                            body { fonst-family: Arial, sans-serif; padding: 20px; }
                            .receipt-container { width: 100%; border: 1px solid #ddd; padding: 10px;}
                            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }

                            .tr-hidden { display: none; }
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
        <div className='fixed inset-0 flex items-center justify-center z-50' 
        style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
            <div className='bg-white p-2 rounded-sm shadow-lg/30 w-[50vw] max-w-6xl md:mt-1 mt-1 h-[calc(100vh)] 
            overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hidden'>
                {/* Receipt content for printing */}
                <div ref={invoiceRef} className='p-4'>

                    {/*Receipt Header*/}
                    {/* <div className='flex justify-center nb-4'>
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
                    </div> */}

                    <div className ='shadow-xl mt-2 p-2'>
                        <h2 className='text-md font-bold text-center mb-2 text-[#1a1a1a]'>Attendance monthly details</h2>

                        <p className={`text-start text-sky-600 text-xs font-semibold mt-2`}>Attendance monthly details for :
                            <span className='font-semibold text-black text-md underline '> {employeeData.empName}</span>
                        </p>
                        <p className={`text-start text-sky-600   text-xs font-semibold mt-2`}>Department :
                            <span className='font-semibold text-black text-md '> {employeeData.department}</span>
                        </p>
                    </div>


                    <div className='mt-2 overflow-x-auto'>

                        <div className='overflow-x-auto px-5'>
                            <table className='w-full text-left text-[#1a1a1a] h-[calc(100vh-30rem)]'>
                                <thead className ='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                    <tr>
                                        <th></th>
                                        {/* <th className='p-2'>Default time</th> */}
                                        <th className='p-2'>Attendance time</th>
                                        <th className='p-2'>Delay time</th>
       
                                        <th className ='tr-hidden'></th>


                                    </tr>
                                </thead>

                                <tbody>

                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className='ml-5 mt-5 text-xs text-red-700 flex items-start justify-start'>
                                                Your attendance list is empty.
                                            </td>
                                        </tr>
                                    ) : (
                                        list.map((attendance, index) => (
                                            <tr
                                                key={index}
                                                className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                                    hover:bg-[#F1E8D9] cursor-pointer'
                                            >

                                                <td className='p-1 text-xs font-semibold' hidden>{attendance._id}</td>
                                               
                                                <td className='p-1 text-xs font-semibold'>{attendance.date ? new Date(attendance.date).toLocaleDateString('en-GB') : ''}</td>
                                           

                                                <td className={`p-1 ${attendance.attendanceType === 'Attendance'
                                                    ? "text-green-600 text-sm font-medium"
                                                    : "text-orange-600 text-sm font-medium"
                                                    }`}>{attendance.attendanceTime}
                                                    <p className='text-white inline'>--</p>
                                                    <span className='text-xs font-normal underline inline'> {attendance.attendanceType}</span>
                                                </td>
                                                {/* <td className='p-2 text-xs font-semibold'>{attendance.defaultAttenTime}</td> */}
                                                <td className='p-1 text-xs text-orange-600 font-semibold'>{attendance.delayAttenTime}
                                                    <p className='text-white inline'>--</p>
                                                    <span className='text-xs font-normal text-black underline inline'> Minutes</span>
                                                </td>

                                                {/* <td className='p-2 text-xs font-semibold'>{userData.userSalary}</td>
                                                <td className='p-2 text-xs font-semibold hidden'>{salaryMinute.toFixed(3)}</td> */}

                                                {/* <td className={`${attendance.attendanceType === "Attendance" ? "text-orange-600"
                                                    : "text-black"} p-2 text-xs font-semibold`}>

                                                    {attendance.attendanceType === "Attendance"
                                                        ? (attendance.delayAttenTime * salaryMinute).toFixed(3)
                                                        : 0}
                                                </td> */}


                                                {/* <td className='p-2 text-center flex gap-4'>
                                                    <button>
                                                        <GiConfirmed size={20} className='w-6 h-6 text-sky-600 rounded-full shadow-lg/30 flex justify-end cursor-pointer'
                                                            onClick={() => {

                                                                updateDeduction({

                                                                    empNo: attendance.employeeNo,
                                                                    //   deduction: Number(formData.finalSalary)
                                                                    deduction: (attendance.delayAttenTime * salaryMinute).toFixed(3),
                                                                    expectedSalary: userData.userSalary - (attendance.delayAttenTime * salaryMinute).toFixed(3),
                                                                })

                                                                toast.success('The deduction accounted successfully .')

                                                                    .then(res => {
                                                                        // handle success (e.g., show a message, close modal, refresh data)
                                                                    })
                                                                    .catch(err => {
                                                                        // handle error (e.g., show error message)  + PAST DEDUCTION
                                                                    });

                                                            }}
                                                        />
                                                    </button>

                                                </td> */}


                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                        </div>

                    </div>



                </div>

                {/** Buttons */}
                <div className='flex justify-between mt-4 rounded-md border border-gray-300'>
                    <button
                        onClick={handlePrint}
                        className='text-sky-600 font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        Print
                    </button>
                    <button
                        onClick={() => setIsAttendanceModal(false)}
                        className='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>

    );
};



export default AttendanceDetails ;