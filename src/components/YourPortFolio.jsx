import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate} from 'react-router-dom';

const YourPortfolio = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['userName', 'userRole', 'userId']); // Include userId in cookies


  useEffect(() => {
    if (!cookies.userId) {
      navigate('/login');
    } else {
      // Redirect based on user role and pass userId as parameter
      if (cookies.userRole === 'Admin') {
        navigate(`/admin/${cookies.userId}`);
      } else if (cookies.userRole === 'Viewer') {
        navigate(`/user-details/${cookies.userId}`);
      }
    }
  }, [cookies.userId, cookies.userRole, navigate]);

  return <div>Loading...</div>; // You can add a loading spinner here if needed
};

export default YourPortfolio;
