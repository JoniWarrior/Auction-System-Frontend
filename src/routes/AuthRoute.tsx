'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { PropsWithChildren } from 'react';

const AuthRoute = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default AuthRoute;
