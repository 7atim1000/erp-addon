import React , {useState} from 'react' ;
import BackButton from '../components/shared/BackButton';
import { useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";
import { ImUserPlus } from "react-icons/im";

import { IoMdArrowDropright } from "react-icons/io";
import SupplierSelect from '../components/receipt/SupplierSelect';
import MenuContainer from '../components/receipt/MenuContainer';
import SupplierInfo from '../components/receipt/SupplierInfo';
import CartInfo from '../components/receipt/CartInfo';
import Bill from '../components/receipt/Bill';

const Receipt = () => {

    const supplierData = useSelector(state => state.supplierReceipt);

    const suppBtn = [{ label: "Select Supplier", action: 'supplier' }];

    const [isSelectSupplierModalOpen, setIsSelectSupplierModalOpen] = useState(false);
    const handleSupplierModalOpen = (action) => {
        if (action === 'supplier') setIsSelectSupplierModalOpen(true)
    };


    // Add new supplier
    const addsuppButton = [
        { label: '', icon: <ImUserPlus className='text-sky-600' size={25} />, action: 'supplier' }
    ];

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

    const handleOpenModal = (action) => {
        if (action === 'supplier') setIsSupplierModalOpen(true);
    };




    return (
        <section className ='h-[100vh] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5]'>
            {/* right side */}
            <div className='flex-[1] bg-white shadow-xl'>

                <SupplierInfo />
                <CartInfo />

                <Bill /> 
            </div>




            <div className='flex-[3] bg-white shadow-xl rounded-lg pt-0'>

                <div className='flex items-center justify-between  bg-white 
                flex justify-between items-center px-5 py-2 shadow-xl mb-2'>

                    <div className='flex items-center'>
                        <BackButton />
                        <h1 className='text-md font-semibold text-[#1a1a1a] tracking-wide'>Receipt Invoice</h1>
                    </div>

                    <div className='flex items-center justify-content gap-4 shadow-xl px-1 h-10 bg-zinc-100 rounded-sm'>
                        <div className='flex items-center gap-3 cursor-pointer  '>

                            <div className='p-4  mb-4 rounded-md flex justify-center cursor-pointer'>
                                {suppBtn.map(({ label, action }) => {

                                    return (
                                        <button onClick={() => handleSupplierModalOpen(action)} className='flex gap-2 items-center cursor-pointer'>
                                            <p className='text-xs mt-3 underline text-zinc-600 font-semibold'>{label}</p>
                                            <IoMdArrowDropright className='inline mt-4 text-yellow-700' size={20} />
                                        </button>
                                    );
                                })}
                            </div>

                            <FaCircleUser className='h-6 w-6 text-green-600' />

                            <div className='flex justify-between gap-3 items-center'>
                                <p className='text-xs font-normal text-[#1a1a1a]'>
                                    Supplier :
                                </p>
                                <p className='text-xs font-medium text-sky-600'>
                                    {supplierData.supplierName || 'Supplier name'}
                                </p>

                            </div>

                            <div className='flex items-center justify-between gap-3'>
                                <p className='text-xs font-normal text-[#1a1a1a]'>
                                    Balance :
                                </p>

                                <p className={`${supplierData.balance === 0 ? 'text-green-600' : 'text-[#be3e3f]'} text-xs font-medium`}>
                                    {(Number(supplierData.balance) || 0).toFixed(2)}
                                    <span className='text-xs text-black font-normal'> AED</span>
                                </p>
                            </div>

                            {/* bg-[#D2B48C] */}
                            {/* <div className='flex items-center justify-around gap-3'>
                                {addsuppButton.map(({ label, icon, action }) => {
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
                </div>

                <div className='shadow-xl bg-white'>
                    <MenuContainer />
                </div>

            
            
                {isSelectSupplierModalOpen && 
                <SupplierSelect 
                setIsSelectSupplierModalOpen={setIsSelectSupplierModalOpen} />}
                {/* {isCustomerModalOpen && <CustomerAdd setIsCustomerModalOpen={setIsCustomerModalOpen} />} */}

            </div>

        

        </section>

    );
};


export default Receipt;