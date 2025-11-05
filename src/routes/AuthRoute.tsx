import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

const AuthRoute = ({ children }: PropsWithChildren) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);
  const router = useRouter();

  if (isAuthenticated) {
    return children;
  }

  router.push('/login');
};

export default AuthRoute;
