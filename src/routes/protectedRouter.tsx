
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRoles: string[]; 
}


export const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const isAllowed = allowedRoles.includes(currentUser.tipo);

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};