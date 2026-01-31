import { useEffect, useState } from "react";
import { getUserData } from "../https";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const useLoadData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Don't fetch user if we're on login page
      if (location.pathname === '/auth') {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getUserData();
        
        if (data?.success) {
          const {_id, name, email, phone, role } = data.data;
          dispatch(setUser({ _id, name, email, phone, role }));
        } else {
          throw new Error("No user data");
        }
      } catch (error) {
        document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        dispatch(removeUser());
        
        // Only navigate to auth if not on login page
        if (location.pathname !== '/auth') {
          navigate('/auth');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [dispatch, navigate, location.pathname]);

  return isLoading;
};

export default useLoadData;



// import { useEffect, useState } from "react";
// import { getUserData } from "../https";
// import { removeUser, setUser } from "../redux/slices/userSlice";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const useLoadData = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//         try {
//             const { data } = await getUserData();
//             console.log(data);

//             const { _id, employeeNo, name, password, email, phone, role, department, userJob, jobNo, jobDate, userSalary, image } = data.data;
//             dispatch(setUser({ _id, employeeNo, name, password, email, phone, role, department, userJob, jobNo, jobDate,  userSalary, image }));
        
        
//         } catch (error) {
//             dispatch(removeUser());
//             navigate('/auth');
//             console.log(error);
        
//         } finally {
//           setIsLoading(false);
//         }
//     }

//     fetchUser();
//   }, [dispatch, navigate]);

//   return isLoading;
// };


// export default useLoadData;