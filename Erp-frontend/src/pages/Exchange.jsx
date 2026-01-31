import React , {useState} from 'react'
import { useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import BackButton from '../components/shared/BackButton'
import SelectCustomer from '../components/exchange/SelectCustomer';

import { ImUserPlus } from "react-icons/im";
import CustomerAdd from '../components/customers/CustomerAdd';

import MenuContainer from '../components/exchange/MenuContainer';
import CustomerInfo from '../components/exchange/CustomerInfo';
import CartInfo from '../components/exchange/CartInfo';
import Bill from '../components/exchange/Bill';

const Exchange = () => {
   

    const customerData = useSelector(state => state.customerExchange);

    const cstBtn = [{ label: "Select Customer", action: 'customer' }];

    const [isSelectCustomerModalOpen, setIsSelectCustomerModalOpen] = useState(false);
    const handleCstModalOpen = (action) => {
        if (action === 'customer') setIsSelectCustomerModalOpen(true)
    };


    // Add new customer
    const addcstButton = [
        { label: '', icon: <ImUserPlus className='text-sky-600' size={25} />, action: 'customer' }
    ];

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

    const handleOpenModal = (action) => {
        if (action === 'customer') setIsCustomerModalOpen(true);
    };
    
    return (
       <section className ='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5]'>
          
            <div className='flex-[3] bg-white shadow-xl rounded-lg pt-0'>

                <div className='flex items-center justify-between  bg-white 
                flex justify-between items-center px-5 py-2 shadow-xl mb-2'>

                    <div className='flex items-center'>
                        <BackButton />
                        <h1 className='text-md font-semibold text-[#1a1a1a] tracking-wide'>Exchange Invoice</h1>
                    </div>

                    <div className='flex items-center justify-content gap-4 shadow-xl px-1 h-10 bg-zinc-100 rounded-sm'>
                        <div className='flex items-center gap-3 cursor-pointer '>

                            <div className='p-4  mb-4 rounded-md flex justify-center cursor-pointer'>
                                {cstBtn.map(({ label, action }) => {

                                    return (
                                        <button onClick={() => handleCstModalOpen(action)} className='flex gap-2 items-center cursor-pointer'>
                                            <p className='text-xs mt-3 underline text-zinc-600 font-semibold'>{label}</p>
                                            <IoMdArrowDropright className='inline mt-4 text-yellow-700' size={20} />
                                        </button>
                                    );
                                })}
                            </div>

                            <FaCircleUser className='h-6 w-6 text-green-600' />
                           
                            <div className='flex justify-between gap-3 items-center'>
                                <p className='text-xs font-normal text-[#1a1a1a]'>
                                    Customer :
                                </p>
                                <p className='text-xs font-medium text-sky-600'>
                                    {customerData.customerName || 'Customer name'}
                                </p>

                            </div>

                            <div className='flex items-center justify-between gap-3'>
                                <p className='text-xs font-normal text-[#1a1a1a]'>
                                    Balance :
                                </p>

                                <p className={`${customerData.balance === 0 ? 'text-green-600' : 'text-[#be3e3f]'} text-xs font-medium`}>
                                    {(Number(customerData.balance) || 0).toFixed(2)}
                                    <span className='text-xs text-black font-normal'> AED</span>
                                </p>
                            </div>

                            {/* bg-[#D2B48C] */}
                            {/* <div className='flex items-center justify-around gap-3'>
                                {addcstButton.map(({ label, icon, action }) => {
                                    return (
                                        <button
                                            onClick={() => handleOpenModal(action)}
                                            className='shadow-lg cursor-pointer bg-zink-100 hover:bg-[#0ea5e9]/30 text-yellow-700
                                            px-2 py-1 rounded-lg font-semibold text-sm flex items-center gap-2'>
                                            {label} {icon}
                                        </button>
                                    )
                                })}
                            </div> */}

                        </div>

                    </div>

                    {isCustomerModalOpen && 
                    <CustomerAdd 
                    setIsCustomerModalOpen={setIsCustomerModalOpen} />} 
                </div>

                <div className =''>
                    <MenuContainer />
                </div>

            


            </div>

            {isSelectCustomerModalOpen &&
                <SelectCustomer 
                setIsSelectCustomerModalOpen={setIsSelectCustomerModalOpen}/>}

            {/* right side */}
            <div className='flex-[1] bg-white shadow-xl'>
                
                <CustomerInfo />
                <CartInfo />
          
                <Bill />
            </div>

       </section>
    );
};


export default Exchange ;
