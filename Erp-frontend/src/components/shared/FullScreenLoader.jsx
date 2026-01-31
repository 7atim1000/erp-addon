import React from 'react';

const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="text-center">
                {/* Simple horizontal line loader */}
                <div className="relative w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600 to-transparent animate-shimmer"></div>
                </div>
                
                {/* Optional minimal text */}
                <p className="mt-4 text-sm text-gray-500">Loading...</p>
            </div>
        </div>
    );
};

export default FullScreenLoader;


// import React from 'react';
// // localstorage, session, cookies  memories in browser to save login status
// const FullScreenLoader = () => {
//     return (
//         <div>
//             <div className ='fullscreen-loader'>
//                 <div className ='spinner'>
                    
//                 </div>
//             </div>
//         </div>
//     )
// }


// export default FullScreenLoader;