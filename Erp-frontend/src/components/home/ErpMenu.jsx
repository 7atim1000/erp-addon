import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaFileInvoiceDollar, 
  FaStoreAlt, 
  FaCalculator, 
  FaUsers, 
  FaSignOutAlt,
  FaBuilding,
  FaChartLine,
  FaCogs,
  FaShieldAlt,
  FaUsersCog
} from "react-icons/fa";


import FinanModal from './FinanModal';
import InvoiceModal from './InvoiceModal';
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { logout } from '../../https';
import { removeUser } from '../../redux/slices/userSlice';
import HrModal from './HrModal';
import StoresModal from './StoresModal';

const ErpMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Menu items configuration
    const menuItems = [
        {
            id: 'users',
            label: 'Users',
            icon: <FaUsersCog className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: 'from-blue-500 to-blue-600',
            // modalComponent: InvoiceModal,
            // modalState: 'isInvoiceModalOpen',
            action: 'users'  // Pass as function
        },
        {
            id: 'invoice',
            label: 'Invoices',
            icon: <FaFileInvoiceDollar className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: 'from-blue-500 to-blue-600',
            modalComponent: InvoiceModal,
            modalState: 'isInvoiceModalOpen',
            action: 'invoice'
        },
        // {
        //     id: 'stores',
        //     label: 'Stores',
        //     icon: <FaStoreAlt className="h-5 w-5 sm:h-6 sm:w-6" />,
        //     color: 'from-blue-500 to-indigo-600',
        //     modalComponent: StoresModal,
        //     modalState: 'isStoresModal',
        //     action: 'stores'
        // },
        {
            id: 'financial',
            label: 'Financials',
            icon: <FaCalculator className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: 'from-blue-500 to-blue-700',
            modalComponent: FinanModal,
            modalState: 'isFinanModalOpen',
            action: 'finan'
        },
        // {
        //     id: 'hr',
        //     label: 'HR Management',
        //     icon: <FaUsers className="h-5 w-5 sm:h-6 sm:w-6" />,
        //     color: 'from-blue-500 to-blue-800',
        //     modalComponent: HrModal,
        //     modalState: 'isHrModal',
        //     action: 'hr'
        // },
        {
            id: 'logout',
            label: 'Logout',
            icon: <FaSignOutAlt className="h-5 w-5 sm:h-6 sm:w-6" />,
            color: 'from-red-500 to-red-600',
            action: 'logout'
        }
    ];

    // Additional utility buttons
    // const utilityItems = [
    //     {
    //         id: 'reports',
    //         label: 'Reports',
    //         icon: <FaChartLine className="h-5 w-5" />,
    //         color: 'bg-blue-100 text-blue-700'
    //     },
    //     {
    //         id: 'settings',
    //         label: 'Settings',
    //         icon: <FaCogs className="h-5 w-5" />,
    //         color: 'bg-blue-100 text-blue-700'
    //     },
    //     {
    //         id: 'security',
    //         label: 'Security',
    //         icon: <FaShieldAlt className="h-5 w-5" />,
    //         color: 'bg-blue-100 text-blue-700'
    //     }
    // ];

    // Modal states
    const [isFinanModalOpen, setIsFinanModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isHrModal, setIsHrModal] = useState(false);
    const [isStoresModal, setIsStoresModal] = useState(false);

    // Logout mutation
    const logOutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: (data) => {
            dispatch(removeUser());
            localStorage.removeItem('token');
            document.cookie = 'accessToken=; Max-Age=0; path=/;';
            navigate('/auth');
        },
        onError: (error) => {
            console.error('Logout error:', error);
        }
    });

    const handleLogOut = () => {
        if (!logOutMutation.isLoading) {
            document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            logOutMutation.mutate();
        }
    };

    // Modal handlers
    const handleModal = (action) => {
        switch (action) {
            case 'finan':
                setIsFinanModalOpen(true);
                break;
            case 'invoice':
                setIsInvoiceModalOpen(true);
                break;
            case 'hr':
                setIsHrModal(true);
                break;
            case 'stores':
                setIsStoresModal(true);
                break;
            case 'logout':
                handleLogOut();
                break;
             case 'users':
                navigate('/users');
                break;
            default:
                break;
        }
    };

    // Get modal component by id
    const getModal = () => {
        if (isFinanModalOpen) return <FinanModal setIsFinanModalOpen={setIsFinanModalOpen} />;
        if (isInvoiceModalOpen) return <InvoiceModal setIsInvoiceModalOpen={setIsInvoiceModalOpen} />;
        if (isHrModal) return <HrModal setIsHrModal={setIsHrModal} />;
        if (isStoresModal) return <StoresModal setIsStoresModal={setIsStoresModal} />;
        return null;
    };

    return (
        <div className="bg-gradient-to-b from-white to-white rounded-xl sm:rounded-2xl p-4 sm:p-3 shadow-lg w-full">
            {/* Header */}
            <div className="mb-2 sm:mb-2">
                {/* <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                        <FaBuilding className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                            ERP Dashboard
                        </h2>
                        <p className="text-sm text-gray-600">Quick access to all modules</p>
                    </div>
                </div> */}
                
                {/* Utility Buttons - Mobile */}
                {/* <div className="sm:hidden flex items-center justify-between mb-4">
                    {utilityItems.map((item) => (
                        <button
                            key={item.id}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${item.color} transition-all hover:scale-105`}
                        >
                            {item.icon}
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </div> */}
            </div>

            {/* Main Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-2 sm:mb-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleModal(item.action)}
                        disabled={item.id === 'logout' && logOutMutation.isLoading}
                        className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        {/* Content */}
                        <div className="relative p-4 sm:p-2">
                            <div className={`flex items-center justify-center h-10 w-10 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                                {item.icon}
                            </div>
                            
                            <h3 className="text-center text-sm sm:text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                                {item.label}
                            </h3>
                            
                            {item.id === 'logout' && logOutMutation.isLoading && (
                                <div className="mt-2 flex justify-center">
                                    <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Hover Border */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </button>
                ))}
            </div>

            {/* Utility Buttons - Desktop */}
            {/* <div className="hidden sm:flex items-center justify-center gap-4 mb-6">
                {utilityItems.map((item) => (
                    <button
                        key={item.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${item.color} hover:bg-blue-200 transition-colors duration-200`}
                    >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </div> */}

            {/* Status Bar */}
            {/* <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm text-gray-700 font-medium">System Status: </span>
                        <span className="text-sm text-green-600 font-semibold">Operational</span>
                    </div>
                    <span className="text-xs text-gray-500">Last updated: Now</span>
                </div>
            </div> */}

            {/* Modals */}
            {getModal()}
        </div>
    );
};

export default ErpMenu;


// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { HiMiniUsers } from "react-icons/hi2";
// import { FaInstalod } from "react-icons/fa";

// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { CiCalculator2 } from "react-icons/ci";
// import { FaStoreAlt } from "react-icons/fa";
// import { AiOutlineLogout } from "react-icons/ai";
// import { GrThreeDEffects } from "react-icons/gr";
// import { TbTruckDelivery } from "react-icons/tb";

// import FinanModal from './FinanModal';
// import InvoiceModal from './InvoiceModal';

// import { useDispatch } from 'react-redux'
// import { useMutation } from '@tanstack/react-query'
// import { logout } from '../../https';
// import { removeUser } from '../../redux/slices/userSlice';
// import HrModal from './HrModal';
// import StoresModal from './StoresModal';




// const ErpMenu = () => {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const logOutMutation = useMutation({
//         mutationFn: () => logout(),
//         onSuccess: (data) => {

//             console.log(data);
//             dispatch(removeUser());
           
//             //////////////////////////////////////////////////////
//             // to remove token from localStorage
//             localStorage.removeItem('token');
//             // remove token from cookie 
//             document.cookie = 'accessToken=; Max-Age=0; path=/;';
//             ///////////////////////////////////////////////////////

//             navigate('/auth');
//         },

//         onError: (error) => {
//             console.log(error);
//         }
//     });

    
    
//     const handleLogOut = () => {
//     if (!logOutMutation.isLoading) {
        
//         // Clear client-side cookie just in case
//         document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//         logOutMutation.mutate();
//     }
// };

//     // // In your logout handler
//     // import { useDispatch } from 'react-redux';
//     // import { logout } from '../store/userSlice';

//     // const dispatch = useDispatch();
//     // dispatch(logout());

  

//     const accountBtn = [{ label: "Financials", action: 'finan'}];
//     const invoiceBtn = [{ label: "Invoices", action: 'invoice'}];
//     const hrBtn = [{ label: "HR", action: 'hr'}];
//     const storeBtn = [{ label :'Stores', action :'stores'}]

//     const [isFinanModalOpen, setIsFinanModalOpen] = useState(false);
//     const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
//     const [isHrModal, setIsHrModal] = useState(false);
//     const [isStoresModal, setIsStoresModal] = useState(false);

//     const handleOpenModal = (action) => {
//         if (action === 'finan') setIsFinanModalOpen(true)
//     };

//     const handleInvoiceModal = (action) => {
//         if (action === 'invoice') setIsInvoiceModalOpen(true)
//     };
    
//     const handleHrModal = (action) => {
//         if (action === 'hr')    setIsHrModal(true)
//     }  
     
//     const handleStoreModal = (action) => {
//         if (action === 'stores')    setIsStoresModal(true)
//     }  
//     // border-[#e3d1b9]
//     return (
//         <div className ='flex flex-wrap justify-beween gap-4 py-2 w-full'>

//             <div className='w-35 h-14  bg-white flex justify-around items-center  p-2 shadow-xl border-b-2  border-[#0ea5e9]'>
//                 {invoiceBtn.map(({ label, action }) => {
//                     return (
//                         <button onClick={() => handleInvoiceModal(action)} className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'>

//                             {label} <LiaFileInvoiceDollarSolid className='text-[#0ea5e9] inline' size={25} />

//                         </button>

//                     )
//                 })}
//             </div>

//             <div className='w-35 h-14  flex bg-white justify-around items-center  p-2 shadow-xl border-b-2  border-[#0ea5e9]'>
//                 {storeBtn.map(({ label, action }) => {
//                     return(
//                         <button onClick={() => handleStoreModal(action)} 
//                         className='bg-white rounded-lg  p-2  text-sm text-black font-semibold cursor-pointer'>
                            
//                             {label} <FaStoreAlt className='text-[#0ea5e9] inline' size={25} />

//                         </button>
//                     )
//                 })}
//             </div>
            
//             <div className='w-35 h-14 bg-white flex justify-around items-center  p-2 shadow-xl border-b-2 border-[#0ea5e9]'>
//                 {accountBtn.map(({ label, action }) => {
//                     return (
//                         <button onClick={() => handleOpenModal(action)} className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'>
//                             {label} <CiCalculator2 className='text-[#0ea5e9] inline' size={25} />
//                         </button>
//                     )
//                 })}
//             </div>

//             <div className='w-35 h-14  bg-white flex justify-around items-center  p-2 shadow-xl border-b-2 border-[#0ea5e9]'>
//                  {hrBtn.map(({ label, action }) => {
//                     return(
//                         <button onClick={() => handleHrModal(action)} className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'>
//                             {label} <FaInstalod className='text-[#0ea5e9] inline' size={25} />
//                         </button>
//                     )
//                 })}
//             </div>

            
//             <div className='w-35 h-14 bg-white flex justify-around items-center  p-2 shadow-xl border-b-2  border-[#be3e3f]'>
//                 {accountBtn.map(({ label, action }) => {
//                     return (
//                         <button 
//                            className='bg-white rounded-lg  p-2 text-sm text-black font-semibold cursor-pointer'
//                            onClick ={ handleLogOut }
//                         >
                            
//                             Logout <AiOutlineLogout className='text-[#be3e3f] inline' size={25} />
//                         </button>
//                     )
//                 })}
//             </div>
           
        

//             {isFinanModalOpen && <FinanModal setIsFinanModalOpen={setIsFinanModalOpen}/>}
//             {isInvoiceModalOpen && <InvoiceModal setIsInvoiceModalOpen={setIsInvoiceModalOpen}/>}

//             {isHrModal && <HrModal setIsHrModal={setIsHrModal}/>}
//             {isStoresModal && <StoresModal setIsStoresModal={setIsStoresModal}/>}
            
//         </div>
        
//     );
// };



// export default ErpMenu ;