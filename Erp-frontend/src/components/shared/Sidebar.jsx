import React, { useState, useEffect } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { SidebarMenuLinks } from '../../assets/assets';
import { FaChevronDown, FaChevronRight, FaBars, FaTimes } from "react-icons/fa";
import { logout } from '../../https';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { RiLogoutCircleRLine, RiDashboardLine } from "react-icons/ri";
import { MdKeyboardDoubleArrowRight, MdPerson } from "react-icons/md";
import { removeUser } from '../../redux/slices/userSlice';
import hotel from '../../assets/images/enterprice.jpg';

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setIsMobileMenuOpen(false);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  // Logout mutation
  const logOutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      dispatch(removeUser());
      localStorage.removeItem('token');
      document.cookie = 'accessToken=; Max-Age=0; path=/;';
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
    }
  });

  const handleLogOut = () => {
    document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    logOutMutation.mutate();
  };

  const toggleSubMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => {
    return activePath === path;
  };

  const isSubItemActive = (subItems) => {
    if (!subItems) return false;
    return subItems.some(subItem => activePath === subItem.path);
  };

  const isMenuActive = (menu) => {
    return isActive(menu.path || '') || isSubItemActive(menu.subItems);
  };

  // Close mobile menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 768 && 
          !event.target.closest('.sidebar-container') && 
          !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mobile-menu-button"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        sidebar-container
        fixed md:relative
        h-screen
        z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-94'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
        bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700
        text-white
        shadow-2xl
      `}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-blue-700/50">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-blue-500/30">
                <img
                  src={hotel}
                  alt="Enterprise RP"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              {(!isCollapsed || isMobileMenuOpen) && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight">Enterprise RP</span>
                  <span className="text-xs text-blue-300">Hotel Management</span>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button (Desktop) */}
            <button
              onClick={toggleCollapse}
              className="hidden md:block p-2 hover:bg-blue-700/50 rounded-lg transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <MdKeyboardDoubleArrowRight 
                className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                size={18}
              />
            </button>
          </div>

          {/* User Info */}
          {(!isCollapsed || isMobileMenuOpen) && userData && (
            <div className="mt-4 p-3 bg-blue-800/30 rounded-lg border border-blue-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center">
                  <MdPerson size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{userData.name || 'Admin'}</p>
                  <p className="text-xs text-blue-300 truncate">{userData.role || 'Manager'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900/50">
          {SidebarMenuLinks.map((link, index) => {
            const hasSubItems = link.subItems && link.subItems.length > 0;
            const isMenuActiveState = isMenuActive(link);
            const isExpanded = expandedMenus[link.name] || false;
            const IconComponent = link.icon;

            return (
              <div key={index} className="mb-1 px-2">
                {/* Main Menu Item */}
                <div
                  className={`
                    relative flex items-center justify-between w-full py-3 px-4 rounded-lg
                    cursor-pointer transition-all duration-200
                    group
                    ${isMenuActiveState 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-blue-700/50 hover:text-blue-100'
                    }
                    ${isCollapsed && !isMobileMenuOpen ? 'justify-center px-3' : ''}
                  `}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleSubMenu(link.name);
                    } else {
                      navigate(link.path || '#');
                      if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  {/* Icon and Text */}
                  <div className={`flex items-center ${isCollapsed && !isMobileMenuOpen ? '' : 'gap-3'}`}>
                    <div className={`
                      flex items-center justify-center
                      ${isMenuActiveState 
                        ? 'text-white' 
                        : 'text-blue-300 group-hover:text-white'
                      }
                      transition-colors
                    `}>
                      <IconComponent size={20} />
                    </div>
                    
                    {(!isCollapsed || isMobileMenuOpen) && (
                      <span className="font-medium text-lg">{link.name}</span>
                    )}
                  </div>

                  {/* Submenu Arrow */}
                  {hasSubItems && (!isCollapsed || isMobileMenuOpen) && (
                    <span className={`
                      transition-transform duration-200
                      ${isExpanded ? 'rotate-180' : ''}
                      ${isMenuActiveState ? 'text-white' : 'text-blue-400'}
                    `}>
                      <FaChevronDown size={12} />
                    </span>
                  )}

                  {/* Active Indicator */}
                  {isMenuActiveState && !isCollapsed && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-lg"></div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobileMenuOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-blue-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                      {link.name}
                    </div>
                  )}
                </div>

                {/* Submenu Items */}
                {hasSubItems && isExpanded && (!isCollapsed || isMobileMenuOpen) && (
                  <div className="ml-8 mt-1 space-y-1 pl-2 border-l-2 border-blue-600/50">
                    {link.subItems?.map((subItem, subIndex) => {
                      const isSubActive = isActive(subItem.path);
                      const SubIconComponent = subItem.icon;

                      return (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          onClick={() => window.innerWidth < 768 && setIsMobileMenuOpen(false)}
                          className={({ isActive: navActive }) => `
                            flex items-center gap-2 w-full py-2 px-3 rounded
                            transition-all duration-150
                            ${navActive || isSubActive
                              ? 'bg-blue-500/30 text-white border-l-2 border-blue-400'
                              : 'text-blue-200 hover:bg-blue-700/30 hover:text-white'
                            }
                          `}
                        >
                          {SubIconComponent && (
                            <SubIconComponent 
                              className={`
                                ${isSubActive ? 'text-blue-300' : 'text-blue-400'}
                                transition-colors
                              `}
                              size={14}
                            />
                          )}
                          <span className="font-medium text-md">{subItem.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-blue-700/50">
          <button
            onClick={handleLogOut}
            className={`
              w-full flex items-center gap-3 py-3 px-4 rounded-lg
              bg-gradient-to-r from-blue-700 to-blue-800
              hover:from-blue-600 hover:to-blue-700
              transition-all duration-200
              shadow-md hover:shadow-lg
              ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}
            `}
          >
            <RiLogoutCircleRLine 
              className="text-white"
              size={20}
            />
            {(!isCollapsed || isMobileMenuOpen) && (
              <span className="font-medium">Logout</span>
            )}
          </button>
          
          {/* Version/Info */}
          {(!isCollapsed || isMobileMenuOpen) && (
            <div className="mt-4 text-center">
              <p className="text-xs text-blue-300/70">v2.1.0 • ERP System</p>
            </div>
          )}
        </div>
      </div>

      {/* Add custom CSS for scrollbar */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(30, 64, 175, 0.3);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(37, 99, 235, 0.6);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
      `}</style>
    </>
  );
};

export default Sidebar;


// import React, { useState } from 'react';
// import { useLocation, NavLink, useNavigate } from 'react-router-dom';
// import { SidebarMenuLinks } from '../../assets/assets';
// import { FaBackwardStep, FaChevronDown, FaChevronRight } from "react-icons/fa6";
// import { logout } from '../../https';
// import { useDispatch, useSelector } from 'react-redux';
// import { useMutation } from '@tanstack/react-query';
// import { RiLogoutCircleRLine } from "react-icons/ri";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import { removeUser } from '../../redux/slices/userSlice';
// import hotel from '../../assets/images/enterprice.jpg';

// const Sidebar = () => {
//   // Logout function :
//   const userData = useSelector(state => state.user);
//     const navigate = useNavigate()
    
//     const dispatch = useDispatch();
    
//   // Logout mutation
//   const logOutMutation = useMutation({
//     mutationFn: () => logout(),
//     onSuccess: (data) => {
//       dispatch(removeUser());
//       localStorage.removeItem('token');
//       document.cookie = 'accessToken=; Max-Age=0; path=/;';
//       navigate('/login');
//     },
//     onError: (error) => {
//       console.error('Logout error:', error);
//     }
//   });

//   const handleLogOut = () => {
//     if (!logOutMutation.isLoading) {
//       document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//       logOutMutation.mutate();
//     }
//   };


    
//   // End logout function 

//   const location = useLocation();
//   const [expandedMenus, setExpandedMenus] = useState({
//     Services: false
//   });

//   const toggleSubMenu = (menuName) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuName]: !prev[menuName]
//     }));
//   };

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const isSubItemActive = (subItems) => {
//     if (!subItems) return false;
//     return subItems.some(subItem => location.pathname === subItem.path);
//   };

//   const isMenuActive = (menu) => {
//     return isActive(menu.path || '') || isSubItemActive(menu.subItems);
//   };


  

//   return (
//     <div className='min-h-0 relative md:flex flex-col pt-2 max-w-13 md:max-w-75 w-full border-r
//             border-emerald-700 text-sm min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900 mr-3'>
      
//       {/* Sidebar Header/Logo */}
//       <div className="p-4 border-b border-emerald-700">
//         <div className="flex items-center justify-between gap-2">
//           <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
//             <img
//               src={hotel}
//               alt="Luxury Hotel"
//               className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
//             />
//           </div>
//           <span className='text-white font-bold text-lg max-md:hidden'>Enterprice RP</span>

//           <div className="">
       
//             <RiLogoutCircleRLine 
//               onClick={handleLogOut} 
//               className ='cursor-pointer text-white border-emerald-50 p-1 ml-2 rounded-[3px]' 
//               size={37}
//             />
          
      
//       </div>

//         </div>
//       </div>

//       <div className='w-full flex-1'>
//         {SidebarMenuLinks.map((link, index) => {
//           const hasSubItems = link.subItems && link.subItems.length > 0;
//           const isMenuActiveState = isMenuActive(link);
//           const isExpanded = expandedMenus[link.name] || false;
          
//           // Get the icon component
//           const IconComponent = isMenuActiveState ? link.icon : (link.iconUncolored || link.icon);
          
//           return (
//             <div key={index} className='mb-1'>
//               {/* Main Menu Item */}
//               <div
//                 className={`relative flex items-center justify-between w-full py-3 px-4 border-b border-emerald-700 cursor-pointer transition-all duration-200
//                   ${isMenuActiveState ? 'bg-emerald-600 text-white shadow-inner' : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'}`}
//                 onClick={() => {
//                   if (hasSubItems) {
//                     toggleSubMenu(link.name);
//                   } else {
//                     navigate(link.path || '#');
//                   }
//                 }}
//               >
//                 <div className='flex items-center gap-2 flex-1'>
//                   {/* Render the icon component */}
//                   <IconComponent 
//                     className={isMenuActiveState ? 'text-white' : 'text-emerald-200'} 
//                     size={20}
//                   />
//                   <span className='max-md:hidden text-lg font-medium'>{link.name}</span>
//                 </div>
                
//                 {hasSubItems && (
//                   <span className='max-md:hidden text-emerald-200'>
//                     {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
//                   </span>
//                 )}
                
//                 {isMenuActiveState && (
//                   <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-400 rounded-l shadow-lg"></div>
//                 )}
//               </div>

//               {/* Submenu Items */}
//               {hasSubItems && isExpanded && (
//                 <div className="ml-4 pl-2 border-l-2 border-emerald-600 bg-emerald-900/50">
//                   {link.subItems?.map((subItem, subIndex) => {
//                     const isSubActive = isActive(subItem.path);
//                     const SubIconComponent = subItem.icon;
                    
//                     return (
//                       <NavLink
//                         key={subIndex}
//                         to={subItem.path}
//                         className={({ isActive: navActive }) => 
//                           `flex items-center gap-2 w-full py-2 px-3 my-1 rounded-r transition-all duration-150
//                           ${navActive || isSubActive 
//                             ? 'bg-emerald-500 text-white shadow-inner' 
//                             : 'text-emerald-200 hover:bg-emerald-700 hover:text-white'
//                           }`
//                         }
//                       >
//                         {SubIconComponent && (
//                           <SubIconComponent 
//                             className={isSubActive ? 'text-white mr-2' : 'text-emerald-300 mr-2'} 
//                             size={16}
//                           />
//                         )}
//                         <span className='max-md:hidden text-sm font-medium'>{subItem.name}</span>
                        
//                         {isSubActive && (
//                           <div className="ml-auto w-1.5 h-4 bg-emerald-300 rounded shadow"></div>
//                         )}
//                       </NavLink>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//     </div>
//   );
// };

// export default Sidebar;

