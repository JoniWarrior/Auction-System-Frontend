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
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthRoute;
