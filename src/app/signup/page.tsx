'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaGavel, FaArrowLeft } from 'react-icons/fa';
import API from '@/utils/API/API';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { loginSucces } from '@/store/auth/authSlice';
import { handleRequestErrors } from '@/utils/functions';
import CEmailInput from '@/core/inputs/CEmailInput';
import CPasswordInput from '@/core/inputs/CPasswordInput';
import GradientButton from '@/core/buttons/electrons/GradientButton';
import CNameInput from '@/core/inputs/CNameInput';
import AuthService from '@/services/AuthService';
import GuestRoute from '@/routes/GuestRoute';

export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // const response = await API.post('/auth/register', {
      //   name,
      //   email,
      //   password,
      //   confirmPassword
      // });
      const response = await AuthService.register(name, email, password, confirmPassword);
      const { user, accessToken, refreshToken } = response.data.data;
      dispatch(loginSucces({ user, accessToken, refreshToken }));
      router.push('/');
    } catch (err) {
      handleRequestErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestRoute>
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
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join thousands of buyers and sellers in our auction community
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <CNameInput
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <CPasswordInput
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <GradientButton isLoading={isLoading} label="Create Account" type="submit" />
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </GuestRoute>
  );
}
