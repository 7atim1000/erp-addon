import React from 'react'
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const MiniCard = ({ title, icon, number, footerNum, currency = 'AED' }) => {
    
    // Define color themes based on title or type
    const getCardTheme = (title) => {
        const themes = {
            'Exchange': {
                bg: 'from-blue-500 to-blue-600',
                text: 'text-blue-700',
                light: 'bg-blue-100',
                iconBg: 'bg-blue-500'
            },
            'Sales': {
                bg: 'from-green-500 to-green-600',
                text: 'text-green-700',
                light: 'bg-green-100',
                iconBg: 'bg-green-500'
            },
            'Purchase': {
                bg: 'from-amber-500 to-amber-600',
                text: 'text-amber-700',
                light: 'bg-amber-100',
                iconBg: 'bg-amber-500'
            },
            'Total Earning': {
                bg: 'from-emerald-500 to-emerald-600',
                text: 'text-emerald-700',
                light: 'bg-emerald-100',
                iconBg: 'bg-emerald-500'
            },
            'default': {
                bg: 'from-blue-500 to-blue-600',
                text: 'text-blue-700',
                light: 'bg-blue-100',
                iconBg: 'bg-blue-500'
            }
        };
        
        return themes[title] || themes.default;
    };

    const theme = getCardTheme(title);
    const isPositive = footerNum >= 0;
    
    // Format number with commas
    const formatNumber = (num) => {
        if (typeof num === 'number') {
            return num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return num;
    };

    return (
        <div className="w-full group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
            
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">{title}</h2>
                        <div className={`h-1 w-8 rounded-full ${theme.bg.replace('from-', 'bg-gradient-to-r ')}`}></div>
                    </div>
                    
                    <div className={`p-2 sm:p-3 rounded-lg ${theme.light} shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                        <div className={`p-1.5 sm:p-2 rounded-md ${theme.iconBg} text-white`}>
                            <span className="h-4 w-4 sm:h-5 sm:w-5 block">
                                {icon}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Number */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-500 font-medium">{currency}</span>
                        <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${theme.text}`}>
                            {formatNumber(number)}
                        </h3>
                    </div>
                    
                    {/* Optional Trend Indicator */}
                    {footerNum !== undefined && (
                        <div className="mt-3 flex items-center gap-2">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {isPositive ? (
                                    <FaArrowUp className="h-3 w-3" />
                                ) : (
                                    <FaArrowDown className="h-3 w-3" />
                                )}
                                <span className="text-xs font-semibold">
                                    {Math.abs(footerNum)}%
                                </span>
                            </div>
                            <span className="text-xs text-gray-500">
                                {isPositive ? 'increase' : 'decrease'} from yesterday
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer with decorative element */}
                <div className="pt-3 sm:pt-4 border-t border-blue-100">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Updated: Today</span>
                        
                        {/* Small indicator dot */}
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs text-gray-500">Live</span>
                        </div>
                    </div>
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 rounded-bl-full ${theme.light} opacity-10`}></div>
            </div>

            {/* Bottom accent bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${theme.bg.replace('from-', 'bg-gradient-to-r ')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>
    );
};

// Responsive wrapper for grid layout
export const MiniCardGrid = ({ children, cols = 1 }) => {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
    };

    return (
        <div className={`grid ${gridCols[cols] || gridCols[2]} gap-4 sm:gap-6 `}>
            {children}
        </div>
    );
};

export default MiniCard;

// import React from 'react'

// const MiniCard = ({title, icon , number, footerNum}) => {
    
//     return (
//         <div className= 'bg-white py-3 px-5 rounded-lg w-[50%] shadow-lg/30 border-b-3 border-[#e3d1b9]'>
//             <div className='flex items-start justify-between'>
                
//                 <h1 className='text-[#1a1a1a] font-semibold text-xs tracking-wide mt-2'>{title}</h1>
//                 <button className={` ${title === 'Exchange' ? 'bg-[#0ea5e9] ' : 'bg-green-600' }
//                     ${title === 'Sales' ? 'bg-orange-300' : '' }
//                     ${title === 'Purchase' ? 'bg-yellow-700' : '' } 
                
//                     p-3 rounded-lg text-white text-sm mt-2 shadow-xl`}>{icon}</button>
//             </div>
           
//             <div>
//                 <h1 className={`text-lg font-bold mt-2 ${title === 'Exchange' ? 'text-[#0ea5e9]' : 'text-green-600'}`}>
//                     <span className ='text-xs font-normal text-[#1a1a1a]'>AED </span>
//                 {number}</h1>
                
//                 {/* from Home page :- <MiniCard title='Total Earning' icon={<BsCashCoin />} number={allInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0).toFixed(2)} footerNum={1.6}/>
//                 <h1 className='text-[#f5f5f5] text-l mt-2'><span className='text-[#02ca3a] text-sm'>{footerNum}%</span> than yesterday</h1> */}
//             </div>
//         </div>
//     )
// };

// export default MiniCard;