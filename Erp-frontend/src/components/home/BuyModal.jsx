import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { IoCloseCircle } from 'react-icons/io5';


import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { setSupplier } from '../../redux/slices/supplierSlice';
import { api } from '../../https';

const BuyModal = ({setIsBuyModalOpen}) => {

    const navigate = useNavigate();
     
    const [list , setList] = useState([]) 
            
    const fetchList = async () => {
        
        try {
        
            const response = await api.get('/api/suppliers/') // get Method not post Method
            if (response.data.success){
              setList(response.data.suppliers);
    
        
            }
            else{
              toast.error(response.data.message)
            }
          
        
          } catch (error) {
            console.log(error)
            toast.error(error.message)
        
          }
        }
    
    // selection
    const [selectedValue, setSelectedValue] = useState('');
    
    useEffect(()=>{
        fetchList() 
    },[]) 
    
    
    // for selection customer from selection
    const [supplierId, setSupplierId] = useState();

    // send data to store and cardScreen screen
    const dispatch = useDispatch();


    const handleChange = (e) => {
        setSupplierId(e.target.value)
    };

    
    const handleSubmit = () => {
        dispatch(setSupplier({supplierId}))
        navigate('/buy')
    }
        
    

             
    const handleClose = () => {
        setIsBuyModalOpen(false)
    };
        

    return (
        <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50'>
            <motion.div
                initial ={{opacity :0 , scale :0.9}}
                animate ={{opacity :1, scale :1}}
                exit ={{opacity :0, scale :0.9}}
                transition ={{durayion :0.3 , ease: 'easeInOut'}}
                className ='bg-zinc-200 p-6 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 border-b-6 border-zinc-500'
                >
                
                
                {/*Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className ='text-black text-sm font-semibold'>Please select supplier </h2>
                    <button onClick ={handleClose} className ='rounded-full  text-zinc-500 hover:text-red-600 cursor-pointer'>
                    <IoCloseCircle size={25}/>
                    </button>
                </div>
                          
                {/*Modal Body*/}
            
                    <div className ='mt-5'>
                            
                        <label className ='text-black block mb-2 mt-3 px-4 text-sm font-medium'></label>

                        <div className ='mt-5 flex items-center justify-between gap-5'>
                            <div className ='w-[70%] flex items-center rounded-lg p-2 px-4 bg-white shadow-lg/30'>
                                <select className ='w-full bg-white text-[#1a1a1a] h-8 rounded-lg' value={selectedValue} onChange={handleChange}  name ='supplierId' >
                                    <option ></option>

                                    {list.map((supplier, index ) => (
                                        
                                    <option key={index} value={supplier._id}>
                                    <option key={index} value={supplier.supplierName}></option>
                                    {supplier.supplierName}
                                   </option>
                                ))};
                    
                                </select>
                        </div>
        
                    <button
                        type ='submit'
                        className ='rounded-lg px-3 py-2 text-xs font-semibold bg-zinc-500 text-white cursor-pointer hover:bg-green-600 hover:text-white'
                         onClick = {handleSubmit}
                    >
                        Create invoice
                    </button>
                
                    </div>
                    
        
                    </div>
                        
               
            </motion.div>
        </div> 
        
    );
};



export default BuyModal ;