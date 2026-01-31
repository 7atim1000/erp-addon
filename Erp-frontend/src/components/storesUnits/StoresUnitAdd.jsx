import React, {useState} from 'react' ;

import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { IoCloseCircle } from 'react-icons/io5';
import { enqueueSnackbar } from 'notistack';

import{ useSelector } from 'react-redux';
import { addStoresUnits } from '../../https';


const StoresUnitAdd = ({setIsUnitModalAdd}) => {
    const userData = useSelector((state) => state.user);
    const userId = userData ? userData._id : "";

    const handleClose = () => {
        setIsUnitModalAdd(false)
    };

    const [formData, setFormData] = useState({
        storeunitName: "", storeunitNo: `${Date.now()}`, user: userId
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)

        storeUnitMutation.mutate(formData)
        window.location.reload();
        setIsUnitModalAdd(false)
    }


    const storeUnitMutation = useMutation({
        mutationFn: (reqData) => addStoresUnits(reqData),
        onSuccess: (res) => {

            const { data } = res;
            //console.log(data)
            enqueueSnackbar(data.message, { variant: "success" });
        },

        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error" });

            console.log(error);
        },
    });


    return(
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-2">
                    <h2 className='text-[#1a1a1a] text-md font-bold'>Add Unit</h2>
                    <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                        border-b border-[#be3e3f]'>
                        <IoCloseCircle size={25} />
                    </button>
                </div>

                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={handleSubmit}>
                    <div className='mt-5'>

                        <div className='flex items-center justify-between'>
                        <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>Unit Name :</label>
                           
                            <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
                                <input
                                    type='text'
                                    name='storeunitName'
                                    value={formData.storeunitName}
                                    onChange={handleInputChange}

                                    placeholder='Enter unit name'
                                    className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
                                    border-b border-yellow-700'
                                    required
                                    autoComplete='none'
                                />
                            </div>
                        </div>

                          <button
                                type='submit'
                                className='p-3 w-full rounded-xs mt-10 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                            cursor-pointer '
                            >
                                Save
                            </button>


                    </div>

                </form>
            </motion.div>
        </div>

    );
};



export default StoresUnitAdd;