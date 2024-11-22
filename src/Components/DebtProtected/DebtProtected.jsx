import { useContext } from 'react';
import { ContextData } from '../../Provider';
import { Navigate, useLocation } from 'react-router-dom';

const DebtProtected = ({ children }) => {
  const {user, userName, loading } = useContext(ContextData);
  const location = useLocation();

  if (loading) {
    // Show spinner while loading
    return (
      <div className="flex justify-center items-center lg:p-20 mt-5 lg:mt-0">
        <span className="loading loading-ring loading-lg flex justify-center items-center"></span>
      </div>
    );
  }

  if (user && (userName === "DEVELOPER" || userName === "ALAMIN01")) {
    // If user is logged in, render children components
    return children;
  }

  // If user is not logged in, redirect to login page
  return <Navigate state={{ from: location }} to="/" />;
};

export default DebtProtected;
