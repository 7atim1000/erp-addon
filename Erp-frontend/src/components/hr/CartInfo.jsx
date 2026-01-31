import React , {useRef,useEffect} from 'react'

import { MdDeleteForever } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux'
import { removeDetail } from '../../redux/slices/salariesSlice';

const CartInfo = () => {

    const salaryData = useSelector(state => state.salaries);

    // scrollbar
    const scrolLRef = useRef();

    useEffect(() => {
        if (scrolLRef.current) {
            scrolLRef.current.scrollTo({
                top: scrolLRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }

    }, [salaryData]);


    // to remove item
    const dispatch = useDispatch();

    const handleRemove = (itemId) => {
        dispatch(removeDetail (itemId))
    }


    return (
        <div className ='px-4 py-1 shadow-lg/30'>
            <h1 className ='text-xs underline text-[#1a1a1a] font-normal'>Monthly Salary Details : </h1>

            <div className='mt-4 overflow-y-scroll h-[350px] bg-[#F1E8D9] rounded-sm' ref={scrolLRef}>
                {salaryData.length === 0
                    ? (<p className='text-xs text-[#be3e3f] flex justify-center'>Your cart is empty . Start adding items !</p>)
                    : salaryData.map((item) => {

                        return (
                            <div className='bg-white rounded-sm p-2 mb-1 shadow-lg/30'>

                                <div className='flex items-center justify-between'>
                                    <h1 className='text-xs font-normal'>{item.empName}</h1>
                                    <p className={`${item.paymentMethod === 'Cash' ? "text-sky-600" : "text-green-600"} 
                                    text-xs font-semibold underline`}>{item.paymentMethod}</p>
                                </div>


                                <div className='flex items-center justify-between mt-1'>
                                    
                                    <p className='text-[#1a1a1a]'>
                                        <span className='text-xs text-sky-600 font-normal'>{item.finalSalary.toFixed(2)}</span>
                                    </p>
                                    <p className='text-[#1a1a1a]'>
                                        <span className='text-xs text-orange-600 font-normal'>{item.Monthlydeduction.toFixed(2)}</span>
                                    </p>
                                    <p className='text-[#1a1a1a]'>
                                        <span className='text-xs font-normal'>AED </span>
                                        <span className='text-xs text-green-600 font-semibold underline'>{item.monthlySalary.toFixed(2)}</span>
                                    </p>
                                   
                              
                                    <MdDeleteForever onClick={() => handleRemove(item.id)} 
                                    className='text-[#be3e3f] cursor-pointer w-5 h-5' />
                                
                                </div>

                            </div>

                        )
                    })}


            </div>

        </div>
    );
};



export default CartInfo ;