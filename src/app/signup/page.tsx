'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaLock, FaEnvelope, FaGavel, FaArrowLeft } from 'react-icons/fa';
import API from '@/utils/API/API';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { loginSucces } from '@/store/auth/authSlice';
import { handleRequestErrors, showSuccess } from '@/utils/functions';
import CEmailInput from '@/core/inputs/CEmailInput';
import CPasswordInput from '@/core/inputs/CPasswordInput';
import CNameInput from '@/core/inputs/CNameInput';

export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });
      const { user, accessToken, refreshToken } = response.data.data;
      dispatch(loginSucces({ user, accessToken, refreshToken }));
      showSuccess(`Welcome: ${user?.name}`);
      router.push('/');
    } catch (err) {
      handleRequestErrors(err);
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join thousands of buyers and sellers in our auction community
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <CNameInput
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
            </div>

            <div>
              <CEmailInput
                label="Email Address"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <CPasswordInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <CPasswordInput
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Create Account
            </button>
          </div>

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
  );
}
