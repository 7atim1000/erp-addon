import React , {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { MdOutlineAddToDrive } from "react-icons/md";
import BackButton from '../components/shared/BackButton';
import { api } from '../https';
import { toast } from 'react-toastify'
import MyAnnualCart from '../components/hr/MyAnnualCart';
import VacationAnnualAdd from '../components/hr/VacationAnnualAdd';
import BottomNav from '../components/shared/BottomNav';
import VacationSickleaveAdd from '../components/hr/VacationSickleaveAdd';
import MySickleaveCart from '../components/hr/MySickleaveCart';


const MySickleave = () => {
   const userData = useSelector(state => state.user);

   const reqButton = [{label: 'New request', action: "requirement",  icon: <MdOutlineAddToDrive className ='text-yellow-700' size ={20}/>}]
   
   const [isRequirementModal, setIsRequirementModal] = useState();
   const handelAddRequirement = (action)=>{
    if(action === 'requirement') setIsRequirementModal(true) 
   };


    
    const [vacationStatus, setVacationStatus] = useState('all');
    console.log('Current status:', vacationStatus); // Debugging

    const [vacationType, setVacationType] = useState('sick leave');
    const [department, setDepartment] = useState('all')
    const [empName, setEmpName] = useState('all')
    const [search, setSearch] = useState('');

    const [list, setList] = useState([]);
    const fetchVacations = async () => {
        try {
            // Request all records by setting a high limit and ignoring other parameters
            const res = await api.post('/api/vacation/fetch', {
                vacationStatus,
                vacationType,
                
                empName: userData.name,     // Ignore filtering by employee name
                department,                 // with filtering by department
                //search: '',               // Empty search string
                search,
                sort: '',                   // No sorting
                page: 1,                    // First page
                limit: 1000                 // Large number to get all records
            });

            // Use whichever property your backend returns the data in
            setList(res.data.data || res.data.vacations || []);

        } catch (error) {
            console.error('Error fetching:', error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
      fetchVacations();
    }, [vacationType, vacationStatus]); 
    


    return(
        <section className ='bg-[#f5f5f5] h-[calc(100vh-2rem)] overflow-y-scroll scrollbar-hidden'>
            <div className='flex items-center justify-between px-10 py-3 shadow-xl'>

                <div className='flex items-center justify-between gap-2'>
                    <BackButton />
                 
                    <div className ='flex flex-col gap-1'>
                        <h1 className='text-[#1a1a1a] text-lg font-bold tracking-wider'>
                            Sick leave
                        </h1>
                        <div className ='flex items-center justify-between'>
                            <span className ='text-sm text-[#1a1a1a]'>Sir : </span>
                            <span className ='text-[#f5f5f5]'>-</span>
                            <span className ='text-md text-sky-600 text-sm'>{userData.name}</span>
                        </div>

                    </div>
                   
                </div>

                <div className='flex items-center justify-around gap-3'>
                    {reqButton.map(({ label, icon, action }) => {
                        return (
                            <button
                                onClick={() => handelAddRequirement(action)}
                                className='shadow-lg cursor-pointer bg-white text-[#1a1a1a] 
                                    px-5 py-2 font-semibold text-sm flex items-center gap-2 shadow-xl hover:bg-[#d2b48c]'>
                                {label} {icon}
                            </button>
                        )
                    })}
                </div>
            </div>


            <div className='flex items-center justify-center gap-2 mt-3 shadow-xl py-2'>
                <button
                    onClick={() => setVacationStatus('all')}
                    className={`
        shadow-lg/30 text-[#1a1a1a] text-xs cursor-pointer 
        rounded-lg px-5 py-2 font-semibold
        ${vacationStatus === 'all' ? 'bg-[#d2b48c]' : 'bg-white'}
      `}
                >
                    All
                </button>
              
                <button
                    onClick={() => setVacationStatus('Pending')}
                    className={`
        shadow-lg/30 text-[#1a1a1a] text-xs cursor-pointer 
        rounded-lg px-5 py-2 font-semibold
        ${vacationStatus === 'Pending' ? 'bg-[#d2b48c]' : 'bg-white'}
      `}
                >
                    Pending
                </button>
             
                <button
                    onClick={() => setVacationStatus('Approved')}
                    className={`
        shadow-lg/30 text-[#1a1a1a] text-xs cursor-pointer 
        rounded-lg px-5 py-2 font-semibold
        ${vacationStatus === 'Approved' ? 'bg-[#d2b48c]' : 'bg-white'}
      `}
                >
                    Approved
                </button>

                <button
                    onClick={() => setVacationStatus('Rejected')}
                    className={`
        shadow-lg/30 text-[#1a1a1a] text-xs cursor-pointer 
        rounded-lg px-5 py-2 font-semibold
        ${vacationStatus === 'Rejected' ? 'bg-[#d2b48c]' : 'bg-white'}
      `}
                >
                    Rejected
                </button>
            </div>


            <div className='px-10 py-4 flex flex-wrap gap-6 overflow-y-scroll scrollbar-hidden h-[calc(100vh-5rem-5rem)]'>

                {list.length === 0
                    ? (<p className='ml-5 mt-2 text-xs text-[#1a1a1a] flex items-start justify-start'>Your sick leave list is empty !</p>)
                    : list.map((vacation, index) => (
                        <MySickleaveCart id= {vacation._id} employee= {vacation.empName} department= {vacation.departmet}
                        status= {vacation.vacationStatus} type= {vacation.vacationType} days= {vacation.daysCount} 
                        date = {vacation.date} 
                         />
                    ))}


            </div>


            {isRequirementModal && <VacationSickleaveAdd setIsRequirementModal = {setIsRequirementModal} />}
          
      

           <BottomNav />
        </section>
    );
};

export default MySickleave;