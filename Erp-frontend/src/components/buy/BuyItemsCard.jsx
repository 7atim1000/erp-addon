import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/slices/buySlice';
import { updateService } from '../../redux/slices/supplierSlice';
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaPlus, FaMinus, FaBox, FaTag } from "react-icons/fa";

const BuyItemsCard = ({id, name, price, qty, unit, cat}) => {
    const [qntCount, setQntCount] = useState(0);
    const [itemId, setItemId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
            
    const increment = (id) => {                        
        setItemId(id);                                  
        setQntCount((prev) => prev + 1)
    }
    
    const decrement = (id) => {
        setItemId(id);
        if (qntCount <= 0) return;
        setQntCount((prev) => prev - 1); 
    }

    const dispatch = useDispatch();

    const handleAddToCart = async (item) => {
        if (qntCount === 0) return;
        
        if (qntCount > 0) {
            setIsAdding(true);
            const { name, price } = item;
            
            // Prepare data for Redux
            const service = {serviceId: id};
            const newObj = { 
                id: id, 
                name, 
                pricePerQuantity: price, 
                quantity: qntCount, 
                price: price * qntCount 
            };
            
            // Dispatch actions
            dispatch(addItems(newObj));
            dispatch(updateService({service}));
            
            // Reset with animation delay
            setTimeout(() => {
                setQntCount(0);
                setItemId(null);
                setIsAdding(false);
            }, 500);
        }
    }

    const isOutOfStock = qty === 0;
    const currentQuantity = id === itemId ? qntCount : 0;

    return (
        <div className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-lg group ${
            isOutOfStock 
                ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200' 
                : 'bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:border-blue-300'
        }`}>
            {/* Stock Status Badge */}
            <div className={`absolute -top-2 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                isOutOfStock 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </div>

            {/* Item Header */}
            <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`p-2 rounded-lg ${
                                isOutOfStock ? 'bg-gray-100' : 'bg-blue-100'
                            }`}>
                                <FaBox className={`w-4 h-4 ${
                                    isOutOfStock ? 'text-gray-500' : 'text-blue-600'
                                }`} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 line-clamp-2">
                                {name}
                            </h3>
                        </div>
                        
                        {/* Category */}
                        {cat && (
                            <div className="flex items-center gap-1 mb-2">
                                <FaTag className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{cat}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button 
                        onClick={() => handleAddToCart({id, name, price, qty, unit, cat})}
                        disabled={isOutOfStock || qntCount === 0 || isAdding}
                        className={`p-3 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0 ml-2 ${
                            isOutOfStock || qntCount === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : isAdding
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md'
                        }`}
                        title={isOutOfStock ? "Out of stock" : "Add to cart"}
                    >
                        <BsFillCartCheckFill 
                            className={`w-5 h-5 ${
                                isAdding ? 'animate-pulse' : ''
                            }`} 
                        />
                    </button>
                </div>
                
                {/* Quantity and Price Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                        {/* Available Quantity */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Available:</span>
                            <span className={`text-sm font-bold ${
                                isOutOfStock ? 'text-red-600' : 'text-green-600'
                            }`}>
                                {qty} {unit}
                            </span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Price:</span>
                            <span className="text-lg font-bold text-blue-700">
                                {price.toFixed(2)} <span className="text-sm font-normal text-gray-500">AED</span>
                            </span>
                        </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between bg-white border border-blue-200 rounded-xl px-4 py-2.5 shadow-sm">
                        <button
                            onClick={() => decrement(id)}
                            disabled={currentQuantity === 0 || isOutOfStock}
                            className={`p-1.5 rounded-lg transition duration-200 cursor-pointer ${
                                currentQuantity === 0 || isOutOfStock
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-red-500 hover:text-white hover:bg-red-500'
                            }`}
                            aria-label="Decrease quantity"
                        >
                            <FaMinus className="w-4 h-4" />
                        </button>
                        
                        <div className="mx-4 min-w-[40px] text-center">
                            <span className={`text-2xl font-bold ${
                                isOutOfStock ? 'text-gray-400' : 'text-blue-700'
                            }`}>
                                {currentQuantity}
                            </span>
                        </div>
                        
                        <button
                            onClick={() => increment(id)}
                            disabled={isOutOfStock}
                            className={`p-1.5 rounded-lg transition duration-200 cursor-pointer ${
                                isOutOfStock
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-blue-600 hover:text-white hover:bg-blue-600'
                            }`}
                            aria-label="Increase quantity"
                        >
                            <FaPlus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Price Preview */}
            {currentQuantity > 0 && !isOutOfStock && (
                <div className="mt-4 pt-3 border-t border-blue-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Total for {currentQuantity} {unit}:</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-700">
                            {(price * currentQuantity).toFixed(2)} <span className="text-sm font-normal text-gray-500">AED</span>
                        </span>
                    </div>
                </div>
            )}

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center p-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <FaBox className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-sm font-semibold text-red-600">Currently Unavailable</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyItemsCard;

// import React, {useState} from 'react'
// import { useDispatch } from 'react-redux';
// import { addItems } from '../../redux/slices/buySlice';
// import { updateService } from '../../redux/slices/supplierSlice';
// import { BsFillCartCheckFill } from "react-icons/bs";


// const BuyItemsCard = ({id, name, price, qty, unit, cat}) => {

//     const [qntCount, setQntCount] = useState(0);
//     const [itemId, setItemId] = useState();             
            
//         const increment = (id) => {                        
//             setItemId(id);                                  
//             setQntCount((prev) => prev + 1)
//         }
//         const decrement = (id) => {
//             setItemId(id);
//             if (qntCount <= 0) return;
//             setQntCount((prev) => prev - 1); 
//         }



//         const dispatch = useDispatch();

//         const handleAddToCard = (item) => {
//             if (qntCount === 0) return ;
        
//             if (qntCount > 0) {
//             const { name, price } = item;
        
//             //slice item  for sale send ID versioal ID
//             const service = {serviceId: id}  
//             // editing service or ItemId from this method to itemId = id means id from {id, name, price, qty, unit, cat}

//             // const newObj = { id: new Date(), name, pricePerQuantity :price, quantity :qntCount, price :price * qntCount };
//             const newObj = { id: id, name, pricePerQuantity :price, quantity :qntCount, price :price * qntCount };
            
//             // send data to saleInfo
//             // store data in sale Slice
//             dispatch(addItems(newObj));

//             // slice item
//             dispatch(updateService({service}))
        
//             setQntCount(0);
//         }
//     }

//     return (
//         <div className ='flex flex-col  gap-2 p-2 rounded-lg h-[185px] cursor-pointer bg-zinc-100 shadow-lg/30 mt-0 hover:bg-white' >
//             <div className ='flex justify-between items-center flex-wrap mb-0'>
                                                          
//                 <div className ='flex flex-col gap-0 mb-0'>
//                     <h1 className ='text-sm font-semibold text-sky-600 flex justify-start items-start'>{name}</h1>
//                     <p className ={`${qty === 0 ? "text-red-600" : "text-green-600"} text-md font-semibold`}><span className ='text-xs text-black font-normal'>Available : </span>{qty}<span className ='text-xs text-black font-normal'> {unit}</span></p>
//                     <p className ='text-xs underline text-green-600 mt-2'>{cat}</p>
//                 </div>
                   
//                 <div className ='mt-0'>
//                     <button onClick ={() => handleAddToCard({id, name, price, qty, unit, cat})}
//                         className ='cursor-pointer mt-0'>
//                         <BsFillCartCheckFill  className ='text-green-600 rounded-lg flex justify-end items-end' size={35}/>
//                     </button>
//                 </div>
                                                       
//             </div>

//             <div className ='flex items-center justify-between px-0 w-full '>
       
//              <p className ='text-md font-semibold text-red-600'><span className ='text-xs text-black font-normal'>Price : </span>{price.toFixed(2)}<span className ='text-xs text-black font-normal'> AED</span></p>
                                       
//                     <div className ='flex gap-3 items-center  justify-between bg-white shadow-lg/50 px-4 py-3 rounded-lg mr-0'>
//                         <button
//                             onClick ={()=>  decrement(id)}
//                             className ='text-red-500 text-lg  cursor-pointer'
//                         >
//                             &minus;
//                         </button>

//                         <span className ={`${qntCount > 9 ? "text-lg" : "text-5xl"} text-sky-500 flex flex-wrap gap-2  font-semibold`}>{id === itemId ? qntCount : "0"}</span>
                           
//                         <button
//                             // disabled={qty === 0}
//                             onClick ={()=> increment(id)}
//                             className ='text-blue-600 text-lg cursor-pointer'
//                         >
//                             &#43;
//                         </button>
//                     </div>
//             </div>

//         </div>
//     );
        
// }


// export default  BuyItemsCard ;