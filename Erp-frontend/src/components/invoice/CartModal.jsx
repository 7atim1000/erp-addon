import React ,{ useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { MdDeleteForever } from 'react-icons/md';
import { LiaEditSolid } from "react-icons/lia";
import { toast } from 'react-toastify';


import { api } from '../../https';

const CartModal = ({setIsCartOpenModal}) => {

    const handleClose = () => {
        setIsCartOpenModal(false);
    } ;

    const invoiceData = useSelector(state => state.invoice);

    const [list, setList] = useState([]);

    //useEffect(() => {
    

    //     const getinvoiceCart = async () => {
    //         try {
    
    //             const res = await axios.post(backendUrl + '/api/invoice/cartOne' , 
    //             {
    //                 invoiceId: invoiceData.invoiceId
    //             });
                
    //             setList(res.data)
    //             console.log(res.data)
             
    
    //         } catch (error) {
    //             console.log(error)
    //             message.error('Fetch Issue with invoice cart')
                
    //         }
    //     };
    
    //         getinvoiceCart();
    //     }, [invoiceData.invoiceId]); 

    // }

      const invoiceId = invoiceData.invoiceId
      const fetchinvoiceItems = async() => {
            
        try {
            
            const res = await api.post('/api/invoice/cartOne' , 
             {
                invoiceId
            }   
            );
                
            setList(res.data)
                // setList(res.data.cart)
                //console.log(res.data)
             
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
            
        useEffect(()=>{
            fetchinvoiceItems() 
        },[invoiceId])
            

    const totalPrice = list.reduce((sum, item) => sum + Number(item.price), 0);
    const totalQuantity = list.reduce((sum, item) => sum + Number(item.quantity), 0);

    return(
    <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)'}}>
        <motion.div
            initial ={{opacity :0 , scale :0.9}}
            animate ={{opacity :1, scale :1}}
            exit ={{opacity :0, scale :0.9}}
            transition ={{durayion :0.3 , ease: 'easeInOut'}}
            className ='bg-white p-6 rounded-lg shadow-lg/30 w-190 h-[95%] md:mt-5 mt-5 overflow-y-scroll'
        >

        <div className="flex justify-between items-center mb-4">
            <h2 className ='text-blue-600 text-sm font-semibold'>Invoice Details</h2>
                <button onClick ={handleClose} className ='rounded-full  text-red-700 cursor-pointer'>
                    <IoCloseCircle size={25}/>
                </button>
        </div>

          <div className ='mt-10' >
                              
            <div className ='overflow-x-auto px-5'>
             <table className ='w-full text-left text-[#1a1a1a]'>
                    <thead className ='bg-zinc-100 text-xs font-semibold text-[#1a1a1a]'>
                        <tr>
                            
                            <th className ='p-1'>Item</th>
                            <th className ='p-1'>Price</th>
                            <th className ='p-1'>Quantity</th>
                            <th className ='p-1'>Total</th>
                            <th className ='p-1'></th>  
                        </tr>
                    </thead>
                                
                    <tbody>
                                                
                    {/* {list.length === 0   1- undefined reading map callback to backend 2-map is not funtion ??*/}
                    {/* (<p className ='ml-5 mt-5 text-xs text-red-700 flex items-start justify-start'>Your customers list is empty . Start adding customers !</p>)  */}
                    {/* {list && Array.isArray(list) && list.map((item, index) => ( */}
                 
                    {list.map((item, index) => (
                    
                    <tr
                       // key ={index}
                        className ='border-b border-zinc-200 text-xs font-semibold'
                    >
                        <td className ='p-1' hidden>{item.id}</td>
                        <td className ='p-1'>{item.name}</td>
                        <td className ='p-1'>{item.pricePerQuantity}</td>
                        <td className ='p-1'>{item.quantity}</td>
                        <td className ='p-1 text-blue-600'>{item.price}</td>
                     
                        
                        <td className ='p-4 text-center flex gap-4'>
                            <button className ={`text-red-700 cursor-pointer text-sm font-semibold`}>
                                <LiaEditSolid size ={20} className ='w-6 h-6 text-sky-600 rounded-full flex justify-end' onClick ={() => setIsItemEditModalOpen(true)}/>
                            </button>
                            <button className ={`text-red-700 cursor-pointer text-sm font-semibold`}>
                                <MdDeleteForever onClick={()=>removeCustomer(customer._id)} size ={20} className ='w-6 h-6 text-orange-600 rounded-full '/> 
                            </button>
                        </td>
            
                                               
                    </tr>
                ))}    
                    </tbody>
                            <tfoot>
                                <tr className="bg-zinc-100 text-xs font-bold">
                                    <td className="p-1" colSpan={1}>Items Count:</td>
                                    <td className="p-1">{list.length} Items</td>
                                    <td className="p-1">Total Qty:</td>
                                    <td className="p-1">{totalQuantity}</td>
                                    <td className="p-1">Total Price: {totalPrice.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        
                    </table>
                                    
            </div>
        
            </div>



        </motion.div>
                     
    </div>

    );
}

export default CartModal 