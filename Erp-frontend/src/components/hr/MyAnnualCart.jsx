import React from 'react'
import { getAvatarName, getBgColor } from '../../utils';
import { MdArrowRight } from "react-icons/md";



const MyAnnualCart = ({id, employee, deparment, status, type, days, date}) => {
    return(
        <div className='w-[250px]  h-[175px] bg-white hover:bg-[#d2b48c] p-4 rounded-lg cursor-pointer shadow-lg/30 mb-3 mt-2'>

            <div className='flex gap-1 items-center justify-between px-1 '>

                <h1 className='text-[#1a1a1a] text-sm font-semibold'><span className='text-xs font-normal text-[#1a1a1a]'>Type</span> 
                <MdArrowRight className='inline ml-2 text-yellow-700' size={25} /> 
                    {type}
                </h1>
                <p className= {`
                    ${status === 'Pending' ? 'text-orange-700 bg-orange-200'
                    : 'text-green-600 bg-green-200'}
                     ${status === 'Rejected' ? 'text-red-800 bg-red-100'
                    : 'text-green-600 bg-green-200'}
                     px-2 py-1 text-xs font-semibold rounded-lg`
                    }
                    
                    >{status}</p>
            </div>


            {/*bg-[#025cca] */}
            <div className='flex items-center justify-center mt-5 mb-5 gap-1 w-full' style={{ backgroundColor: status ? getBgColor() : "#1f1f1f" }}>
                <h1 className={`flex items-center text-white rounded-full p-4 text-sm `} >{days}</h1>
                <MdArrowRight className='inline ml-2 text-white' size={25} /> 
                <span className ='text-xs font-semibold text-white '> Days</span>
            </div>

            <p className='text-[#1a1a1a] text-xs'>Request date : 
                <span className='text-sky-600 text-sm'> {new Date(date).toLocaleDateString('en-GB')}</span>
            </p>



        </div>
    );
};


export default MyAnnualCart;