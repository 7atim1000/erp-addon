import { 
  FaCogs,
  FaUser,
  FaTags,
  FaShoppingCart,
  FaBuilding, 
  FaLayerGroup

} from 'react-icons/fa';

import { PiCurrencyDollarLight } from "react-icons/pi";
import { ImUsers } from "react-icons/im";
import { FaSortAmountUp } from "react-icons/fa";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { ImCalculator } from "react-icons/im";
import { FaCommentsDollar } from "react-icons/fa";
import { AiFillContainer } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";

import { FaUsers } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { IoIosCart } from "react-icons/io";
import { BsUnity } from "react-icons/bs";
import { FaSitemap } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export const SidebarMenuLinks = [
     { 
    name: "Dashboard", 
    path: "/dashboard", 
    icon: MdDashboard,
    },

    { 
    name: "Services", 
    path: "#",
    icon: FaCogs,
    iconUncolored: FaCogs,
    isExpanded: false,
    subItems: [
      {
        name: "Products",
        path: "/services",
        icon: FaSitemap
      },
      {
        name: "Categories",
        path: "/categories",
        icon: FaTags
      },
      {
        name: "Units",
        path: "/units",
        icon: BsUnity
      },
    ]
  },

  { 
    name: "Invoices", 
    path: "#",
    icon: AiFillContainer,
    isExpanded: false,
    subItems: [
      {
        name: "POS",
        path: "/sales",
        icon: IoIosCart
      },
      {
        name: "Purchases",
        path: "/buy",
        icon: AiFillContainer
      },
      {
        name: "Management",
        path: "/invoices",
        icon: IoSettingsSharp
      }
    ]
  },

  { 
    name: "Financials", 
    path: "#",
    icon: ImCalculator,
    
    isExpanded: false,
    subItems: [
      {
        name: "Transactions",
        path: "/transactions",
        icon: GrTransaction
      },
      {
        name: "Incomes",
        path: "/incomes",
        icon: FaSortAmountUp
      },
      {
        name: "Expenses",
        path: "/expenses",
        icon: FaSortAmountUpAlt
      },
    ]
  },

  { 
    name: "Customers", 
    path: "/customers", 
    icon: ImUsers,
  },

  { 
    name: "Suppliers", 
    path: "/suppliers", 
    icon: FaUsers,
  },

  { 
    name: "Permissions", 
    path: "/users", 
    icon: MdOutlineSettings,
  },

  
];

