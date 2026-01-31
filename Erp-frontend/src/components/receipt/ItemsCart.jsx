import React , {useState} from 'react' ;
import { useDispatch } from 'react-redux';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { toast } from 'react-toastify' ;
import { addReceipt } from '../../redux/slices/receiptSlice';

const ItemsCart = ({id, name, price, quantity, unit, cat, expire , store}) => {

    // for expiredate - today date expire date sooon
    const isExpiringSoon = (expireDate) => {
        if (!expireDate) return false;
        const diffInMs = new Date(expireDate) - new Date();
        return diffInMs <= (31 * 24 * 60 * 60 * 1000);
    };

    // For remaning account remainging days 
    const getExpirationStatus = (expireDate) => {
        if (!expireDate) return { text: '—', className: '' };

        const today = new Date();
        const expiryDate = new Date(expireDate);
        const diffInMs = expiryDate - today;
        const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

        let text = '';
        let className = '';

        if (diffInDays < 0) {
            text = `Expired ${Math.abs(diffInDays)} days ago`;
            className = 'text-[#be3e3f]'; // Red for expired
        } else if (diffInDays === 0) {
            text = 'Expires today';
            className = 'text-[#be3e3f]'; // Red for today
        } else if (diffInDays <= 30) {
            text = `Expires in ${diffInDays} days`;
            className = 'text-[#be3e3f]'; // Red for ≤10 days
        } else {
            text = `Expires in ${diffInDays} days`;
            className = 'text-green-600'; // Default (no special styling)
        }

        return { text, className };
    };



    const [qtCount, setqtCount] = useState(0);
    const [itemId, setItemId] = useState();   

    const increment = (id) => {                          // to solve counting
        setItemId(id);                                   // to solve counting DAY
        setqtCount((prev) => prev + 1)
    };

    const decrement = (id) => {
        setItemId(id);

        if (qtCount <= 0) return;
        setqtCount((prev) => prev - 1);
    };

    const dispatch = useDispatch();

    const handleAddToCart = (item) => {

        if (qtCount === 0) {
            toast.warning('Please specify the required quantity.');
            return;
        }
        
        if (quantity < 0) {
            toast.error('Sorry item does not have balance');
            return ;

        }
        if (quantity < qtCount) {
            toast.error('Sorry the balance is not enough the procedure.');
            return ;

        }
          

        // Check expiration
        const today = new Date();
        const expiryDate = new Date(expire);
        const diffInMs = expiryDate - today;
        const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays < 30) {
            toast.error('This item is expired or expires in some days!');
            return;
        };


         if (qtCount > 0  && qtCount <= quantity) {

            const { name, price } = item;
            const newObj = { id: id, name: name, store: store, expire: expire, category: cat, pricePerQuantity: price, qty: qtCount, price: price * qtCount, 
                            quantityBefore: quantity, quantityAfter: quantity + qtCount, unit: unit 
             };

            setqtCount(0);
            dispatch(addReceipt(newObj));

         }

    };


    return (
        <div className='flex flex-col justify-start gap-2 p-2 rounded-lg h-[220px] w-[220px] cursor-pointer bg-white 
        shadow-lg/30 mt-0' >

            <div className='flex justify-between items-center mb-0'>

                <div className='flex flex-col gap-0 mb-0'>
                    <h1 className='text-sm font-medium text-[#1a1a1a] flex justify-start items-start'>{name}</h1>
                    <p className='text-xs text-sky-600 mt-0'>{cat}</p>
                    <p className='text-xs text-emerald-600 mt-0'>{store}</p>
                </div>

                <div className='mt-0'>
                    <button  onClick={() => handleAddToCart({id, name, price, quantity, unit, cat, expire , store})}
                        className='cursor-pointer mt-0'>
                        <IoCheckmarkCircleOutline className='text-emerald-600 rounded-sm flex justify-end items-end 
                        shadow-lg/30' size={30} />
                    </button>
                </div>

            </div>

            <div className='flex items-center justify-center px-0 w-full'>
            
                <div className='flex gap-3 items-center justify-center bg-[#f5f5f5] p-3 rounded-lg mr-0 
                    shadow-lg/30'>
                    <button
                        onClick={() => decrement(id)}
                        className='text-[#0ea5e9] text-lg hover:bg-[#0ea5e9]/30 rounded-full cursor-pointer'
                    >
                        &minus;
                    </button>
                    <span className={`${qtCount > 9 ? "text-lg" : "text-3xl"} text-[#0ea5e9] flex flex-wrap gap-2  
                    font-semibold`}>
                        {id === itemId ? qtCount : "0"}<span 
                        className={`${qtCount > 9 ? "mt-2  text-xs" : "mt-3 text-xs"} text-[#1f1f1f]`}>
                            {unit}
                        </span>
                    </span>

                    <button
                        onClick={() => increment(id)}
                        className='text-[#1a1a1a] text-lg cursor-pointer hover:bg-[#1a1a1a]/30 rounded-full'
                    >
                        &#43;
                    </button>

                </div>
                

            </div>
             
            <div className ='flex items-center justify-between shadow-xl p-2 '>
                <p className ='text-lg font-semibold text-sky-600 shadow-xl'>{price} <span className ='text-yellow-700 text-xs font-normal'> AED</span> </p>
                <p className ='text-lg font-semibold text-green-600 shadow-xl'>
                    <span className ='text-[#1a1a1a] text-xs font-normal'>Available : </span>
                    {quantity} 
                    <span className ='text-yellow-700 text-xs font-normal'> {unit}</span> </p>
            </div>
            
            <div className ='flex items-center justify-between shadow-xl bg-white'>
                <p className ={`p-1 font-semibold text-xs ${isExpiringSoon(expire) ? 'text-[#be3e3f]' : 'text-sky-600'}`}
                >
                    {expire ? new Date(expire).toLocaleDateString('en-GB') : 'N/A'}
                </p>
          
                <span
                    className={`p-1 font-semibold text-xs ${getExpirationStatus(expire).className || 'text-[#1a1a1a]'}`}>
                    {getExpirationStatus(expire).text}
                </span>

            </div>

    

        </div>
    )  ;  
};


export default ItemsCart ;
