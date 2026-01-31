import React from 'react'
import BackButton from '../components/shared/BackButton';
import SalaryContainer from '../components/hr/SalaryContainer';
import CartInfo from '../components/hr/CartInfo';
import SalaryBills from '../components/hr/SalaryBills';

const SalaryMonthly = () => {
    return (
        <section className ='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5]'>
                <div className ='flex-[3] bg-white shadow-lg rounded-lg pt-0 '>
                    
                    <div className='flex items-center justify-between p-2 shadow-xl'>
                        <div className='flex flex-wrap gap-0 items-center cursor-pointer'>
                            <BackButton />
                            <h1 className='text-black text-md font-bold tracking-wide'>Monthly Salaries</h1>
                        </div>
                    </div>

                    <div>
                        <SalaryContainer /> 

                    </div>
                    

                </div>
                <div className ='flex-[1] bg-white  rounded-lg pt-0'>
                    <CartInfo />
                    <SalaryBills />
                </div>
        </section>
    );
};



export default SalaryMonthly ;