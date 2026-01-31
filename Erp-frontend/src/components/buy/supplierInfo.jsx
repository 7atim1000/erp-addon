import React, {useState, useEffect} from 'react'
import { formatDate, getAvatarName } from '../../utils';
import { useSelector } from 'react-redux';
import { FaUser, FaCalendar, FaIdCard, FaUserShield, FaStore, FaWallet } from 'react-icons/fa';
import { IoTimeOutline } from 'react-icons/io5';

const SupplierInfo = () => {
    const supplierData = useSelector(state => state.supplier);
    const userData = useSelector(state => state.user);

    const [dateTime, setDateTime] = useState(new Date());
    
    // Update time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const formattedDate = formatDate(dateTime);
    const avatarName = getAvatarName(supplierData.supplierName || 'Supplier Name');
    const supplierBalance = Number(supplierData.balance) || 0;

    return (
        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 h-full'>
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                        <FaStore className="text-white w-4 h-4" />
                    </div>
                    <div>
                        <h1 className='text-sm font-bold text-gray-800'>
                            {supplierData.supplierName || 'Select Supplier'}
                        </h1>
                        <p className='text-xs text-gray-500'>
                            {supplierData.supplierName ? 'Current supplier' : 'No supplier selected'}
                        </p>
                    </div>
                </div>
                
                <div className="relative group">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                        <div className="text-sm font-bold">{avatarName}</div>
                    </div>
                </div>
            </div>

            {/* Compact Info Section */}
            <div className="space-y-3">
                {/* Invoice ID and Date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaIdCard className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs text-gray-600">Invoice:</span>
                        <span className="text-xs font-semibold text-gray-800">
                            {supplierData.buyId || 'N/A'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendar className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs text-gray-600">{formattedDate.split(',')[0]}</span>
                    </div>
                </div>

                {/* Time and User */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <IoTimeOutline className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-600">{formattedDate.split(',')[1]?.trim() || '--:--'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUserShield className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs font-semibold text-gray-800">{userData.name || 'User'}</span>
                    </div>
                </div>

                {/* User Role */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Role:</span>
                    <span className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                        {userData.role || 'Role'}
                    </span>
                </div>
            </div>

            {/* Balance Section - Only shown when supplier is selected */}
            {supplierData.supplierName && (
                <div className="mt-4 pt-3 border-t border-blue-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                <FaWallet className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Supplier Balance</p>
                                <p className={`text-sm font-bold ${supplierBalance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {supplierBalance.toFixed(2)} AED
                                </p>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            supplierBalance === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {supplierBalance === 0 ? 'Clear' : 'Due'}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Footer */}
            <div className="mt-4 pt-3 border-t border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${supplierData.supplierName ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-xs text-gray-600">
                            {supplierData.supplierName ? 'Selected' : 'Pending'}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">Updated: {formattedDate}</span>
                </div>
            </div>
        </div>
    );
};

export default SupplierInfo;


// import React, {useState} from 'react'
// import { formatDate, getAvatarName } from '../../utils';
// import { useSelector } from 'react-redux';

// const SupplierInfo = () => {
//     const supplierData = useSelector(state => state.supplier);
//     const userData = useSelector(state => state.user);

//     const [dateTime, setDateTime] = useState(new Date());
    
//     return (
        
//         <div className ='flex bg-white items-center justify-between px-2 py-1 shadow-xl'>
//             {/*customer Info */}
//             <div className ='flex flex-col items-start'>
//                 <h1 className ='text-sm text-yellow-700 font-semibold mb-2'>{supplierData.supplierName || 'Impoprter name'}</h1>
//                 <p className ='text-[#1a1a1a] text-xs font-normal'>#{supplierData.buyId || 'NA'}</p>
//                 <p className ='text-[#1a1a1a] text-xs font-normal'>{formatDate(dateTime)}</p>
//                 <p className='text-[#1a1a1a] text-xs font-semibold mt-2'>
//                     By : <span className='text-yellow-700'>{userData.name || 'User Name'} / </span>
//                     <span className='font-normal'>{userData.role}</span>
//                 </p>
//             </div>
//             <button className='bg-[#f5f5f5] shadow-xl/40 text-yellow-700 rounded-full p-3 h-10 mt-2 text-xs font-semibold'>
//                 {getAvatarName(supplierData.supplierName || 'Supplier Name')}
//             </button>   
//         </div>

//     );
// };

// export default SupplierInfo;