'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGavel, FaArrowLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { loginSucces } from '@/store/auth/authSlice';
import API from '@/utils/API/API';
import { handleRequestErrors } from '@/utils/functions';
import CEmailInput from '@/core/inputs/CEmailInput';
import CPasswordInput from '@/core/inputs/CPasswordInput';
import GradientButton from '@/core/buttons/electrons/GradientButton';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data.data;
      console.log('AccesToken: ', accessToken);
      console.log('Refresh Token: ', refreshToken);
      dispatch(loginSucces({ user, accessToken, refreshToken }));
      router.push('/');
    } catch (err) {
      handleRequestErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-purple-600 hover:text-purple-700 flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <FaGavel className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gray-800">Auction</span>
          </div>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your auctions, bids, and seller dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <CEmailInput
              label="Email Address"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CPasswordInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                Forgot your password?
              </a>
            </div>
          </div>
          <GradientButton isLoading={isLoading} label="Sign in" type="submit" />
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
