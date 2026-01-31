import React, { useState, useEffect } from 'react' 
import { GiSunflower } from "react-icons/gi";
import { BsFillMoonStarsFill, BsCalendarDate, BsClock } from "react-icons/bs";
import { FaUserCircle, FaHandSparkles, FaBell } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { useSelector } from 'react-redux';
import AnalogClock from './AnalogClock';

const Greetings = () => {
    
    const userData = useSelector(state => state.user);
    const [dateTime, setDateTime] = useState(new Date());
    const [notifications, setNotifications] = useState(3); // Example notification count
    
    // Get current shift
    function getCurrentShift() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
    }
    

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const currentShift = getCurrentShift();
    const shiftIcon = currentShift === 'Morning' 
        ? <GiSunflower className="h-5 w-5 text-amber-500" />
        : <BsFillMoonStarsFill className="h-5 w-5 text-blue-400" />;

    return (
        <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-blue-100 shadow-sm">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 sm:px-6 py-1">
                    
                    {/* Left Section: User Welcome */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* User Avatar */}
                        <div className="relative">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                {userData?.image ? (
                                    <img 
                                        src={userData.image} 
                                        alt={userData.name}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="h-8 w-8" />
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Welcome Message */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <FaHandSparkles className="h-4 w-4 text-blue-500 hidden sm:block" />
                                <h1 className="text-base sm:text-lg font-bold text-gray-800">
                                    Welcome back, <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                        {userData?.name || 'User'}
                                    </span>!
                                </h1>
                            </div>
                            {/* <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                <HiOutlineLightBulb className="h-3 w-3 text-blue-400" />
                                {currentShift === 'Morning' 
                                    ? "Start your day with excellent service! 🌟"
                                    : "Keep up the great work for our customers! 🌙"
                                }
                            </p> */}
                        </div>
                    </div>

                    {/* Center Section: Shift & Stats */}
                    <div className="flex items-center justify-center gap-6">
                        {/* Shift Indicator */}
                        <div className="flex flex-col items-center">
                            <div className={`max-sm:hidden p-2 rounded-lg ${currentShift === 'Morning' ? 'bg-amber-50' : 'bg-blue-50'} border ${currentShift === 'Morning' ? 'border-amber-200' : 'border-blue-200'}`}>
                                {shiftIcon}
                            </div>
                            {/* <div className="mt-2 text-center">
                                <span className={`text-xs font-semibold ${currentShift === 'Morning' ? 'text-amber-600' : 'text-blue-600'}`}>
                                    {currentShift}
                                </span>
                            </div> */}
                        </div>

                        {/* Notifications */}
                        {/* <div className="flex flex-col items-center relative">
                            <div className="p-2 rounded-lg bg-white border border-gray-200 relative">
                                <FaBell className="h-5 w-5 text-gray-600" />
                                {notifications > 0 && (
                                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {notifications}
                                    </div>
                                )}
                            </div>
                            <span className="mt-2 text-xs text-gray-600">Alerts</span>
                        </div> */}
                    </div>

                    {/* Right Section: Date & Time */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Date Card */}
                        <div className="flex-1 md:flex-none bg-white rounded-lg border border-blue-100 p-3 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <BsCalendarDate className="h-4 w-4 text-blue-500" />
                                <span className="text-xs font-semibold text-blue-700">Today</span>
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                                {formatDate(dateTime)}
                            </p>
                        </div>

                        {/* Time Card with Analog Clock */}
                        <div className="bg-gradient-to-br from-blue-400 to-blue-900 rounded-xl p-2 shadow-lg">
                            <div className="flex items-center justify-between gap-4">
                                {/* Digital Time */}
                                <div className="hidden sm:block">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BsClock className="h-3 w-3 text-blue-200" />
                                        <span className="text-xs font-semibold text-blue-200">Local Time</span>
                                    </div>
                                    <div className="font-mono text-lg font-bold text-white">
                                        {formatTime(dateTime)}
                                    </div>
                                </div>
                                
                                {/* Analog Clock */}
                                <div className="flex items-center">
                                    <AnalogClock className="w-13 h-13 sm:w-15 sm:h-15" />
                                </div>
                            </div>
                            
                            {/* Mobile Time Display */}
                            <div className="sm:hidden mt-2 text-center">
                                <div className="font-mono text-sm font-semibold text-blue-100">
                                    {formatTime(dateTime)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Bar */}
                {/* <div className="border-t border-blue-100 bg-white">
                    <div className="flex flex-wrap justify-center sm:justify-between items-center gap-3 px-4 sm:px-6 py-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs text-gray-600">System: <span className="font-semibold text-green-600">Operational</span></span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">Active Users:</span>
                                <span className="font-semibold text-blue-600">24</span>
                            </div>
                            <div className="h-3 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">Today's Sales:</span>
                                <span className="font-semibold text-green-600">AED 12,450</span>
                            </div>
                            <div className="h-3 w-px bg-gray-300 hidden sm:block"></div>
                            <div className="hidden sm:flex items-center gap-1">
                                <span className="text-gray-500">Completion Rate:</span>
                                <span className="font-semibold text-blue-600">94%</span>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Greetings;


// import React, {useState, useEffect} from 'react' 

// import { GiSunflower } from "react-icons/gi";
// import { BsFillMoonStarsFill } from "react-icons/bs";

// import { useSelector } from 'react-redux';
// import AnalogClock from './AnalogClock';

// const Greetings = () => {
    
//     const userData = useSelector(state => state.user);
//     const [dateTime, setDateTime] = useState(new Date());
    
//     // Add this function inside your component (before return)
//     function getCurrentShift() {
//         const hour = new Date().getHours();
//         // Example: Morning = 6:00-17:59, Evening = 18:00-5:59
//         return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
//     }
    
//     //const userData = useSelector(state => state.user)

//     useEffect(() => {
//         const timer = setInterval(() => setDateTime(new Date()), 1000);
//         return () => clearInterval(timer);
//     }, []);

//     const formatDate = (date) => {
//         const months = [
//             'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//         ];
//         return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, 
//             ${date.getFullYear()}`;
//     };

//     const formatTime = (date) =>
//         `${String(date.getHours()).padStart(2, '0')}:${String(
//             date.getMinutes()
//         ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    
//     return (
       
//         <div className ='flex justify-between items-center mt-0 px-8 py-1 border-bottom shadow-xl'>
            
//             <div className ='flex flex-col gap-1'>
//                 <h1 className ='text-xs font-medium text-[#0ea5e9] flex items-center gap-2'>Welcome : 
//                 <p className ='text-md font-semibold text-[#1a1a1a]'>{userData.name || 'Username'}</p></h1>
//                 <p className ='text-sm font-medium flex items-center justify-between gap-1 text-[#0ea5e9]'>Give your best services for customers</p>
//             </div>

//             <div className='flex items-center gap-2 justify-center'>

//                 {getCurrentShift() === 'Morning' ? (
//                     <GiSunflower className='text-orange-400' size={24} />
//                 ) : (
//                     <BsFillMoonStarsFill className='text-[#0ea5e9]' size={24} />
//                 )}
//                 <h1 className='text-sm text-black font-semibold'>
//                     {getCurrentShift()} shift
//                 </h1>

//             </div>
            
//             <div className ='flex flex-col gap-1 items-center'>
//             {/* <h1 className ='text-sm font-semibold text-blue-700'>{formatTime(dateTime)}</h1>  */}
//                 <AnalogClock className="w-10 h-10 flex items-center" />
//                 <p className ='text-xs font-normal text-[#1f1f1f]'>{formatDate(dateTime)}</p>
//             </div>

//         </div>
    
//     );
  
// };

// export default Greetings ;