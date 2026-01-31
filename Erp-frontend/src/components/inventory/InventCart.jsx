import React from 'react' ;
import { getAvatarName, getBgColor } from '../../utils';

const InventCart = ({id, name, store, cat}) => {
    
    return(

          <div className='flex flex-col justify-start gap-2 p-2 rounded-lg h-[145px] w-[170px] cursor-pointer bg-white shadow-lg/30 mt-0 ' >
        
            <div className='flex justify-between items-center mb-0'>
                <div className='flex flex-col items-center justify-between gap-0 mb-0 w-full'>
                    <h1 className='text-md font-semibold text-[#1a1a1a] flex justify-start items-start'>{name}</h1>
                    <div className='flex justify-between gap-5'>
                        <p className='text-xs font-semibold text-yellow-700 mt-0'>{store}</p>
                        <p className='text-xs font-semibold text-sky-600 mt-0'>{cat}</p>
                    </div>

                    <div className='flex justify-center items-center w-full mt-5'>
                        <button
                            className='w-12 h-12 flex justify-center items-center text-sm font-bold rounded-full text-white'
                            style={{ backgroundColor: getBgColor() }}
                        >
                            {getAvatarName(name)}
                        </button>
                    </div>
                </div>
            </div>
        
             
           
            
        
                </div>
      
    );
};


export default InventCart ;