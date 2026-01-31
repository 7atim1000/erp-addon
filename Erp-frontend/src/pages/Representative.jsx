import React, { useState , useEffect } from 'react'
import { MdDelete, MdOutlineAddToDrive } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";


import { toast } from 'react-toastify';
import BackButton from '../components/shared/BackButton';
import RepresentativeAdd from '../components/representative/RepresentativeAdd';
import BottomNav from '../components/shared/BottomNav';
import { api } from '../https';




const Representative = () => {

    const Button = [
        { label : 'Add Representative' , icon : <MdOutlineAddToDrive className ='text-white' size={20} />, action :'rep' }
    ];

    const [isRepModalOpen, setIsRepModalOpen] = useState(false);
    
    const handleOpenModal = (action) => {
        if (action === 'rep') setIsRepModalOpen(true)
    };


    
            
    // fetch Representative - any error on .map or length check next function
    const [list, setList] = useState([])

    const fetchRep = async() => {
        try {
            const response = await api.get('/api/representative/')
            if (response.data.success){
                setList(response.data.representative)
                } else{
                    toast.error(response.data.message)
                }
            
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
            
    useEffect(()=>{
        fetchRep() 
    },[])
            
            
    const removeRep = async (id) => {
                  
        try {
            
        const response = await axios.post(backendUrl + '/api/representative/remove', { id }, )
        if (response.data.success){
        toast.success(response.data.message)
                   
        //Update the LIST after Remove
        await fetchRep();
                    
        } else{
            toast.error(response.data.message)
        }
                
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            }
    };
     

    return (

        <section className ="h[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden">
            <div className ='flex items-center justify-between px-8 py-2'>
                <div className ='flex items-center'>
                    <BackButton />
                    <h1 className ='text-lg font-semibold text-[#1f1f1f]'>Representative Managment</h1>
                </div>
                                                    
                <div className ='flex items-center justify-around gap-3'>
                    {Button.map(({ label, icon, action}) => {
                    return(
                    <button 
                        onClick = {() => handleOpenModal(action)}
                        className ='shadow-lg cursor-pointer bg-zinc-500 hover:bg-green-600 text-white hover:text-white
                        px-5 py-2 rounded-lg text-blue-500 font-semibold text-sm flex items-center gap-2'> 
                        {label} {icon}
                    </button>
                    )
                })}
                </div>
                                                
                {isRepModalOpen && <RepresentativeAdd setIsRepModalOpen={setIsRepModalOpen} />}  
                                                
            </div>


            <div className ='mt-10' >
                                  
                <div className ='overflow-x-auto mx-5'>
                    <table className ='w-full text-left text-[#1a1a1a]'>
                    <thead className ='bg-slate-200 text-xs font-semibold text-[#1a1a1a]'>
                    <tr>
                        <th className ='p-2'>Name</th>
                        <th className ='p-2'>Contact No</th>
                        <th className ='p-2'>Address</th>

                        <th className ='p-2'>Balance</th>
                        <th className ='p-2'></th> 
                         <th className ='p-2'></th>  
                    </tr>
                    </thead>
                                    
                    <tbody>
                                
                    {list.length === 0 
                    ? (<p className ='ml-5 mt-5 text-xs text-red-700 flex items-start justify-start'>Your representative list is empty . Start adding new one !</p>) 
                    :list.map((rep, index) => (
                                
                        <tr
                        key ={index}
                        className ='border-b border-slate-200 hover-bg-slate-500 text-xs font-semibold'
                        >
                        
                        <td className ='p-2' hidden>{rep._id}</td>
                        <td className ='p-2'>{rep.repName}</td>
                        <td className ='p-2'>{rep.contactNo}</td>
                        <td className ='p-2'>{rep.address}</td>

                   
                        <td className ='p-2'>{rep.balance.toFixed(2)}</td>
                        <td className ='p-2 text-sky-500 underline'>AED</td>
                                    
                        <td className ='p-4 text-center flex gap-4'>
                        
                        <button className ={`text-red-700 cursor-pointer text-sm font-semibold`}>
                            <LiaEditSolid size ={20} className ='w-7 h-7 text-sky-500 rounded-full bg-white flex justify-end'/>
                        </button>
                        
                        <button className ={`text-red-700 cursor-pointer text-sm font-semibold`}>
                            <MdDelete onClick={()=>removeRep(rep._id)} size ={20} className ='w-7 h-7 text-red-600 rounded-full bg-white'/> 
                        </button>
                        </td>
                        
                                                           
                    </tr>
                            ))}
                        
                                    
                                </tbody>
                            </table>
                                    
                        </div>
                                    
                    </div>
                         
                 
            
        <BottomNav />
        </section>
    );
}



export default Representative ;