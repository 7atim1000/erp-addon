import { useState, useEffect } from 'react';

const AnalogClock = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate clock hands angles
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;
  
  const secondStyle = {
    transform: `rotate(${seconds * 6}deg)`
  };
  const minuteStyle = {
    transform: `rotate(${minutes * 6}deg)`
  };
  const hourStyle = {
    transform: `rotate(${hours * 30 + minutes * 0.5}deg)`
  };

  return (
    <div className={`relative w-12 h-12 ${className}`}>
      {/* Clock Face */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-50 to-white border border-blue-200 shadow-sm">
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>

        {/* Hour Marks - 4 main marks only */}
        {[0, 3, 6, 9].map((i) => {
          const angle = i * 30;
          const rad = (angle * Math.PI) / 180;
          const radius = 35;
          const x = 50 + radius * Math.sin(rad);
          const y = 50 - radius * Math.cos(rad);
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}

        {/* Hour Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 h-1/4 bg-blue-800 origin-bottom transform -translate-x-1/2 -translate-y-full z-1"
          style={hourStyle}
        />

        {/* Minute Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-px h-1/3 bg-blue-600 origin-bottom transform -translate-x-1/2 -translate-y-full z-2"
          style={minuteStyle}
        />

        {/* Second Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-[0.5px] h-2/5 bg-blue-500 origin-bottom transform -translate-x-1/2 -translate-y-full z-3"
          style={secondStyle}
        />
      </div>
    </div>
  );
};

export default AnalogClock;



// import { useState, useEffect } from 'react';
// import { FaClock } from "react-icons/fa";

// const AnalogClock = ({ className = '', showDigital = true }) => {
//   const [time, setTime] = useState(new Date());

//   // Update clock every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Calculate clock hands angles
//   const seconds = time.getSeconds();
//   const minutes = time.getMinutes();
//   const hours = time.getHours() % 12;
  
//   const secondStyle = {
//     transform: `rotate(${seconds * 6}deg)`
//   };
//   const minuteStyle = {
//     transform: `rotate(${minutes * 6}deg)`
//   };
//   const hourStyle = {
//     transform: `rotate(${hours * 30 + minutes * 0.5}deg)`
//   };

//   // Format time for digital display
//   const formatTime = (date) => {
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     const seconds = date.getSeconds().toString().padStart(2, '0');
//     return `${hours}:${minutes}:${seconds}`;
//   };

//   return (
//     <div className={`flex flex-col items-center ${className}`}>
//       {/* Digital Time Display */}
//       {showDigital && (
//         <div className="mb-4 text-center">
//           <div className="flex items-center justify-center gap-2 mb-1">
//             <FaClock className="h-4 w-4 text-blue-500" />
//             <span className="text-sm font-medium text-gray-600">Live Time</span>
//           </div>
//           <div className="font-mono text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
//             {formatTime(time)}
//           </div>
//           <p className="text-xs text-gray-500 mt-1">
//             {time.toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}
//           </p>
//         </div>
//       )}

//       {/* Clock Container */}
//       <div className="relative">
//         {/* Outer Ring with Gradient */}
//         <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 blur opacity-30"></div>
        
//         {/* Clock Face */}
//         <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-b from-blue-50 to-white shadow-xl border-4 border-blue-200">
          
//           {/* Center Dot */}
//           <div className="absolute top-1/2 left-1/2 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg">
//             <div className="absolute inset-0 rounded-full bg-blue-400 blur-sm"></div>
//           </div>

//           {/* Hour Numbers */}
//           {[...Array(12)].map((_, i) => {
//             const angle = i * 30;
//             const rad = (angle * Math.PI) / 180;
//             const radius = 42; // Percentage from center
//             const x = 50 + radius * Math.sin(rad);
//             const y = 50 - radius * Math.cos(rad);
            
//             return (
//               <div
//                 key={i}
//                 className="absolute font-semibold text-blue-800 transform -translate-x-1/2 -translate-y-1/2"
//                 style={{
//                   left: `${x}%`,
//                   top: `${y}%`,
//                   fontSize: i % 3 === 0 ? '1.1rem' : '0.9rem', // Emphasize 3, 6, 9, 12
//                   fontWeight: i % 3 === 0 ? 'bold' : 'semibold'
//                 }}
//               >
//                 {i === 0 ? 12 : i}
//               </div>
//             );
//           })}

//           {/* Hour Marks (small ticks) */}
//           {[...Array(60)].map((_, i) => {
//             const angle = i * 6;
//             const rad = (angle * Math.PI) / 180;
//             const radius = i % 5 === 0 ? 40 : 42; // Longer marks for hours
//             const length = i % 5 === 0 ? 6 : 3;
//             const width = i % 5 === 0 ? 2 : 1;
//             const x = 50 + radius * Math.sin(rad);
//             const y = 50 - radius * Math.cos(rad);
            
//             return (
//               <div
//                 key={i}
//                 className={`absolute ${i % 5 === 0 ? 'bg-blue-600' : 'bg-blue-400'} rounded-full`}
//                 style={{
//                   left: `${x}%`,
//                   top: `${y}%`,
//                   width: `${width}px`,
//                   height: `${length}px`,
//                   transform: `translate(-50%, -50%) rotate(${angle}deg)`,
//                 }}
//               />
//             );
//           })}

//           {/* Hour Hand */}
//           <div 
//             className="absolute top-1/2 left-1/2 w-2 h-1/4 bg-gradient-to-b from-blue-800 to-blue-600 origin-bottom transform -translate-x-1/2 -translate-y-full z-10 rounded-t-lg shadow-md"
//             style={hourStyle}
//           >
//             <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 rounded-t"></div>
//           </div>

//           {/* Minute Hand */}
//           <div 
//             className="absolute top-1/2 left-1/2 w-1.5 h-1/3 bg-gradient-to-b from-blue-700 to-blue-500 origin-bottom transform -translate-x-1/2 -translate-y-full z-11 rounded-t-lg shadow-md"
//             style={minuteStyle}
//           >
//             <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-300 rounded-t"></div>
//           </div>

//           {/* Second Hand */}
//           <div 
//             className="absolute top-1/2 left-1/2 w-0.5 h-2/5 bg-gradient-to-b from-blue-500 to-blue-300 origin-bottom transform -translate-x-1/2 -translate-y-full z-12 rounded-t-lg"
//             style={secondStyle}
//           >
//             {/* Second hand circle at base */}
//             <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transform -translate-x-1/2 shadow-sm"></div>
//             {/* Second hand tail */}
//             <div className="absolute -bottom-8 left-1/2 w-1 h-6 bg-gradient-to-t from-blue-400 to-blue-300 transform -translate-x-1/2 rounded-b"></div>
//           </div>

//           {/* Inner Circle */}
//           <div className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-white rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-200 shadow-inner"></div>

//           {/* Branding */}
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-4 text-center">
//             <div className="text-xs font-semibold text-blue-600">ERP</div>
//             <div className="text-[10px] text-blue-500">SYSTEM</div>
//           </div>
//         </div>
//       </div>

//       {/* Decorative elements */}
//       <div className="mt-4 flex items-center gap-4">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800"></div>
//           <span className="text-xs text-gray-600">Hours</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"></div>
//           <span className="text-xs text-gray-600">Minutes</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
//           <span className="text-xs text-gray-600">Seconds</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalogClock;



// import { useState, useEffect } from 'react';

// const AnalogClock = ({ className = '' }) => {
//   const [time, setTime] = useState(new Date());

//   // Update clock every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Calculate clock hands angles
//   const seconds = time.getSeconds();
//   const minutes = time.getMinutes();
//   const hours = time.getHours() % 12;
  
//   const secondStyle = {
//     transform: `rotate(${seconds * 6}deg)`
//   };
//   const minuteStyle = {
//     transform: `rotate(${minutes * 6}deg)`
//   };
//   const hourStyle = {
//     transform: `rotate(${hours * 30 + minutes * 0.5}deg)`
//   };

//   return (
//     <div className={`relative rounded-full border-2 border-[#0ea5e9] ${className}`}>
//       {/* Clock center dot */}
//       <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#0ea5e9] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />
      
//       {/* Hour marks */}
//       {[...Array(12)].map((_, i) => (
//         <div 
//           key={i}
//           className="absolute w-1 h-1 bg-white rounded-full"
//           style={{
//             top: '15%',
//             left: '50%',
//             transform: `rotate(${i * 30}deg) translateX(-50%) translateY(-50%) rotate(-${i * 30}deg)`,
//             transformOrigin: '0 0'
//           }}
//         />
//       ))}
      
//       {/* Clock hands */}
//       <div 
//         className="absolute top-1/2 left-1/2 w-1 h-1/4 bg-[#1a1a1a] origin-bottom transform -translate-x-1/2 -translate-y-full z-2"
//         style={hourStyle}
//       />
//       <div 
//         className="absolute top-1/2 left-1/2 w-0.5 h-1/3 bg-[#1a1a1a] origin-bottom transform -translate-x-1/2 -translate-y-full z-3"
//         style={minuteStyle}
//       />
//       <div 
//         className="absolute top-1/2 left-1/2 w-px h-2/5 bg-[#0ea5e9] origin-bottom transform -translate-x-1/2 -translate-y-full z-4"
//         style={secondStyle}
//       />
//     </div>
//   );
// };

// export default AnalogClock;