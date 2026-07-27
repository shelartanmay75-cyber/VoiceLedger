import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mic } from 'lucide-react';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] p-0.5 shadow-[0_0_25px_rgba(59,130,246,0.5)] animate-pulse flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F14] rounded-[14px] flex items-center justify-center">
              <Mic className="w-6 h-6 text-[#3B82F6]" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping" />
            Verifying Authentication...
          </div>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
