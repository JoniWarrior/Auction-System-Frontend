'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

const GuestRoute = ({ children }: PropsWithChildren) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);

  if (isAuthenticated) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default GuestRoute;
