import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/shared/BackButton';
import { useSelector } from 'react-redux';
import { CiEdit } from "react-icons/ci";
import { FaMapMarkerAlt, FaCalendarAlt, FaUserInjured, FaHistory, FaEnvelope, FaPhone, FaUserTie, FaBuilding, FaBriefcase, FaCalendarDay, FaIdCard } from "react-icons/fa";
import { getAvatarName, getBgColor } from '../utils';
import BottomNav from '../components/shared/BottomNav';
import ProfileEditModal from '../components/hr/ProfileEditModal';
import { motion } from 'framer-motion';

const Profile = () => {
    const navigate = useNavigate();
    const userData = useSelector(state => state.user);
    
    const [isEditProfileModal, setIsEditProfileModal] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);

    const handleEdit = (user) => {
        setCurrentProfile(user);
        setIsEditProfileModal(true);
    };

    const actionButtons = [
        { 
            label: 'Company Map', 
            icon: <FaMapMarkerAlt className='text-white' size={18} />,
            bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            action: 'map',
            navigate: () => navigate('/map')
        },
        { 
            label: 'Annual Leave', 
            icon: <FaCalendarAlt className='text-white' size={18} />,
            bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700',
            action: 'annual',
            navigate: () => navigate('/myannualleave')
        },
        { 
            label: 'Sick Leave', 
            icon: <FaUserInjured className='text-white' size={18} />,
            bgColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
            hoverColor: 'hover:from-amber-600 hover:to-amber-700',
            action: 'sick',
            navigate: () => navigate('/mysickleave')
        },
        { 
            label: 'Activity Log', 
            icon: <FaHistory className='text-white' size={18} />,
            bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
            hoverColor: 'hover:from-purple-600 hover:to-purple-700',
            action: 'activity',
            navigate: () => navigate('/activities') // Update this route as needed
        }
    ];

    return (
        <section className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto'>
                            <BackButton className="text-white hover:bg-white/20" />
                            <div className='flex items-center gap-4'>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className='relative'
                                >
                                    <div className='w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white'>
                                        {userData.image ? (
                                            <img 
                                                src={userData.image} 
                                                alt={userData.name}
                                                className='w-full h-full object-cover'
                                            />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-500'>
                                                <span className='text-2xl font-bold text-white'>
                                                    {userData.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-green-500 rounded-full border-2 border-white'></div>
                                </motion.div>
                                
                                <div className='flex-1 min-w-0'>
                                    <h1 className='text-xl md:text-2xl font-bold truncate'>{userData.name}</h1>
                                    <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1'>
                                        <div className='inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm'>
                                            <FaBuilding className='w-3 h-3' />
                                            <span>{userData.department}</span>
                                        </div>
                                        <div className='inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm'>
                                            <FaBriefcase className='w-3 h-3' />
                                            <span>{userData.userJob}</span>
                                        </div>
                                        <div className='text-blue-100 text-sm mt-1 md:mt-0'>
                                            ID: {userData.employeeNo || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(userData)}
                            className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap'
                        >
                            <CiEdit className='text-white w-5 h-5' />
                            <span className='font-medium'>Edit Profile</span>
                        </motion.button>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Left Column - Action Cards */}
                    <div className='lg:col-span-1 space-y-4'>
                        {actionButtons.map((button, index) => (
                            <motion.div
                                key={button.action}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <button
                                    onClick={button.navigate}
                                    className={`w-full ${button.bgColor} ${button.hoverColor} text-white p-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between group`}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2 bg-white/20 rounded-lg'>
                                            {button.icon}
                                        </div>
                                        <span className='font-semibold text-left'>{button.label}</span>
                                    </div>
                                    <div className='transform group-hover:translate-x-1 transition-transform duration-300'>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column - Profile Information */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Basic Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className='bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden'
                        >
                            <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200'>
                                <div className='flex items-center gap-2'>
                                    <div className='p-2 bg-blue-600 rounded-lg'>
                                        <FaIdCard className='w-5 h-5 text-white' />
                                    </div>
                                    <h2 className='text-lg font-bold text-gray-800'>Basic Information</h2>
                                </div>
                            </div>
                            <div className='p-4 md:p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg'>
                                        <div className='p-2 bg-blue-100 rounded-lg'>
                                            <FaEnvelope className='w-4 h-4 text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 mb-1'>Email Address</p>
                                            <p className='text-sm font-medium text-gray-800 truncate'>{userData.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg'>
                                        <div className='p-2 bg-blue-100 rounded-lg'>
                                            <FaPhone className='w-4 h-4 text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 mb-1'>Contact Number</p>
                                            <p className='text-sm font-medium text-gray-800'>{userData.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg'>
                                        <div className='p-2 bg-blue-100 rounded-lg'>
                                            <FaUserTie className='w-4 h-4 text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 mb-1'>Full Name</p>
                                            <p className='text-sm font-medium text-gray-800'>{userData.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg'>
                                        <div className='p-2 bg-blue-100 rounded-lg'>
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 mb-1'>Permissions</p>
                                            <p className='text-sm font-medium text-gray-800'>
                                                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                                    {userData.role || 'N/A'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Job Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className='bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden'
                        >
                            <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200'>
                                <div className='flex items-center gap-2'>
                                    <div className='p-2 bg-blue-600 rounded-lg'>
                                        <FaBriefcase className='w-5 h-5 text-white' />
                                    </div>
                                    <h2 className='text-lg font-bold text-gray-800'>Job Information</h2>
                                </div>
                            </div>
                            <div className='p-4 md:p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg'>
                                        <div className='p-2 bg-blue-100 rounded-lg'>
                                            <FaIdCard className='w-4 h-4 text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 mb-1'>Employee Number</p>
                                            <p className='text-sm font-medium text-gray-800'>{userData.employeeNo || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg'>
                                        <div className='p-2 bg-blue-100 rounded-lg'>
                                            <FaBriefcase className='w-4 h-4 text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 mb-1'>Job Title</p>
                                            <p className='text-sm font-medium text-gray-800'>{userData.userJob || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg'>
                                        <div className='p-2 bg-blue-100 rounded-lg'>
                                            <FaCalendarDay className='w-4 h-4 text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 mb-1'>Join Date</p>
                                            <p className='text-sm font-medium text-gray-800'>{userData.jobDate || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg'>
                                        <div className='p-2 bg-blue-100 rounded-lg'>
                                            <FaBuilding className='w-4 h-4 text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 mb-1'>Department</p>
                                            <p className='text-sm font-medium text-gray-800'>{userData.department || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Additional Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden'
                        >
                            <div className='p-6 text-white'>
                                <div className='flex items-center justify-between mb-4'>
                                    <div>
                                        <h3 className='text-lg font-bold'>Profile Status</h3>
                                        <p className='text-blue-100 text-sm'>Your profile is complete and active</p>
                                    </div>
                                    <div className='p-2 bg-white/20 rounded-lg'>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='text-center p-3 bg-white/10 rounded-lg'>
                                        <p className='text-xs text-blue-200'>Last Updated</p>
                                        <p className='font-semibold'>Just now</p>
                                    </div>
                                    <div className='text-center p-3 bg-white/10 rounded-lg'>
                                        <p className='text-xs text-blue-200'>Profile Views</p>
                                        <p className='font-semibold'>Regular</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className='mt-6 bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='text-sm text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <span>Employee Profile • Last updated: Today</span>
                            </div>
                        </div>
                        <div className='text-xs text-gray-500'>
                            Keep your profile updated for better management
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditProfileModal && currentProfile && (
                <ProfileEditModal
                    user={currentProfile}
                    setIsEditProfileModal={setIsEditProfileModal}
                    userData={userData}
                />
            )}

            <BottomNav />
        </section>
    );
};

export default Profile;

// import React, {useState} from 'react'
// import {useNavigate} from 'react-router-dom'
// import BackButton from '../components/shared/BackButton';
// import { useSelector } from 'react-redux';
// import { CiEdit } from "react-icons/ci";
// import { getAvatarName, getBgColor } from '../utils';
// import BottomNav from '../components/shared/BottomNav';
// import ProfileEditModal from '../components/hr/ProfileEditModal';

// const Profile = () => {
//     const navigate = useNavigate();
//     const userData = useSelector(state => state.user);
    
//     // update
//     const Button = [
//         { label: 'Edit profile', icon: <CiEdit className='text-sky-600' size={20} />, action: 'profile' }
//     ];

//     const [isEditProfileModal, setIsEditProfileModal] = useState(false);
//     const [currentProfile, setCurrentProfile] = useState(null);

//     const handleEdit = (user) => {
//         setCurrentProfile(user);
//         setIsEditProfileModal(true);
//     };
 

//     // annual leave
//     const annualButton = [
//         { label: 'Annual leave',  action: 'annual' }
//     ];

 
//     const handleOpenAnnualLeave = (action) => {
//         if (action === 'annual') navigate('/myannualleave')
//     }

//     // sick leave
//     const sickButton = [
//         { label: 'Sick leave',  action: 'sick' }
//     ];

//     const handleOpenSickLeave = (action) => {
//         if (action === 'sick') navigate('/mysickleave')
//     }

//     // map
//     const mapButton = [
//         { label: 'Company map',  action: 'map' }
//     ];

//     const handleOpenMap = (action) => {
//         if (action === 'map') navigate('/map')
//     }

//     // activities
//     const actButton = [
//         { label: 'Activity log',  action: 'activity' }
//     ];

//     const handleOpenActivities = (action) => {
//         if (action === 'activity') navigate('/map')
//     }



//     return (
//         <section className='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5]'>
//             <div className='flex-[5] bg-white shadow-lg rounded-lg pt-0 '>
                
//                 <div className='flex items-center justify-between px-4 py-3 shadow-xl'>
                    
               
//                     <div className='flex justify-start flex-wrap gap-3 items-center cursor-pointer'>
//                         <img src={userData.image} className='h-22 w-22 rounded-full  border-b-3 border-yellow-700' />
                       
//                         <div className='flex flex-col gap-1 mt-5 '>

//                             <h1 className='text-black text-sm font-bold tracking-wide'>
//                                 {userData.name}
//                             </h1>
//                             <p className='text-black text-xs font-normal tracking-wide text-sky-600'>
//                                 {userData.department}
//                             </p>
//                             <p className='text-black text-xs font-normal tracking-wide text-sky-600'>
//                                 {userData.userJob}
//                             </p>

//                         </div>
//                         <BackButton />
//                         </div>


//                         <div className ='flex justify-end'>
                            
//                             <div className='flex items-center justify-end gap-3'>
                                
//                                 {Button.map(({ label, icon, action }) => {
//                                     return (
//                                         <button
//                                             onClick={() => handleEdit(userData)}
//                                             className='shadow-lg/30 cursor-pointer bg-white  text-[#1a1a1a] 
//                                             px-5 py-2 rounded-sm font-semibold text-sm flex items-center gap-2'>
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}

                                 
//                             </div>

//                         </div>
//                 </div>

//                 {/* end header */}
//                 <div className ='py-2 px-10 flex flex-col gap-2 mt-5 shadow-xl'>
//                     <h1 className ='text-sky-600'>Basic Information :</h1>
//                     <div className='flex items-center gap-2 text-xs px-5'>
//                         <p>Email :</p>
//                         <p>{userData.email}</p>
//                     </div>
//                     <div className='flex items-center gap-2 text-xs px-5'>
//                         <p>Name :</p>
//                         <p>{userData.name}</p>
//                     </div>
//                     <div className='flex items-center gap-2 text-xs px-5'>
//                         <p>Contact No :</p>
//                         <p>{userData.phone}</p>
//                     </div>
//                         <div className='flex items-center gap-2 text-xs px-5'>
//                         <p>Permissions :</p>
//                         <p>{userData.role}</p>
//                     </div>

//                 </div>

//                 <div className='py-2 px-10 flex flex-col gap-2 mt-5 shadow-xl'>
//                     <h1 className='text-sky-600'>Job Information :</h1>
//                     <div className='flex items-center gap-2 text-xs px-5'>
//                         <p>Job number :</p>
//                         <p>{userData.employeeNo}</p>
//                     </div>
//                     <div className='flex items-center gap-2 text-xs px-5'>
//                         <p>Job name :</p>
//                         <p>{userData.userJob}</p>
//                     </div>
//                     <div className='flex items-center gap-2 text-xs px-5'>
//                         <p>Job date :</p>
//                         <p>{userData.jobDate}</p>
//                     </div>
//                     <div className='flex items-center gap-2 text-xs px-5'>
//                         <p>Department :</p>
//                         <p>{userData.department}</p>
//                     </div>

//                 </div>

//             </div>

//             <div className ='flex-[1] '>
               

//                 <div className='flex w-full items-center justify-between gap-3 mt-2'>
//                     {mapButton.map(({ label, icon, action }) => {
//                         return (

//                             <button

//                                 onClick={() => handleOpenMap(action)}
//                                 className='shadow-lg/30 flex items-center justify-center cursor-pointer bg-white text-[#1a1a1a] w-full 
//                                 px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2'
//                             >
//                                 {label} {icon}

//                                 <button className='rounded-full p-3 text-white flex items-center justify-end'
//                                     style={{ backgroundColor: getBgColor() }}
//                                 >
//                                     {getAvatarName(label)}
//                                 </button>

//                             </button>

//                         )
//                     })}
//                 </div>


//                 <div className='flex w-full items-center justify-between gap-3 mt-2'>
//                     {annualButton.map(({ label, icon, action }) => {
//                         return (
//                             <button
//                                 onClick={() => handleOpenAnnualLeave(action)}
//                                 className ='shadow-lg/30 flex items-center justify-center cursor-pointer bg-white text-[#1a1a1a] w-full 
//                                 px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2'
//                                 >
//                                 {label} {icon}

//                                 <button  className ='rounded-full p-3 text-white flex items-center justify-end'
//                                 style ={{ backgroundColor: getBgColor() }}    
//                                 >
//                                         {getAvatarName(label)}
//                                 </button>
//                             </button>
                            
//                         )
//                     })}
//                 </div>

//                 <div className='flex w-full items-center justify-between gap-3 mt-2'>
//                     {sickButton.map(({ label, icon, action }) => {
//                         return (
                             
//                             <button
                            
//                                 onClick={() => handleOpenSickLeave(action)}
//                                 className='shadow-lg/30 flex items-center justify-center cursor-pointer bg-white text-[#1a1a1a] w-full 
//                                 px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2'
//                             >
//                                 {label} {icon}

//                                <button className='rounded-full p-3 text-white flex items-center justify-end'
//                                     style={{ backgroundColor: getBgColor() }}
//                                 >
//                                     {getAvatarName(label)}
//                                 </button>
                                
//                             </button>

//                         )
//                     })}
//                 </div>

//                 <div className='flex w-full items-center justify-between gap-3 mt-2'>
//                     {actButton.map(({ label, icon, action }) => {
//                         return (
                             
//                             <button
                            
//                                 // onClick={() => handleOpenSickLeave(action)}
//                                 className='shadow-lg/30 flex items-center justify-center cursor-pointer bg-white text-[#1a1a1a] w-full 
//                                 px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2'
//                             >
//                                 {label} {icon}

//                                <button className='rounded-full p-3 text-white flex items-center justify-end'
//                                     style={{ backgroundColor: getBgColor() }}
//                                 >
//                                     {getAvatarName(label)}
//                                 </button>
                                
//                             </button>

//                         )
//                     })}
//                 </div>

             

//                 {/* Edit Employee Modal */}
//                 {isEditProfileModal && currentProfile && (
//                     <ProfileEditModal
//                         user ={currentProfile}
//                         setIsEditProfileModal={setIsEditProfileModal}
//                         userData={userData}
//                     />
//                 )}


//             </div>
//             <BottomNav />
//         </section>
//     );
// };



// export default Profile;