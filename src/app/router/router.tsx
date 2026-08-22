import {createBrowserRouter, Navigate} from 'react-router-dom';

import {BottomNavLayout} from '@/app/layout/BottomNavLayout';
import {Layout} from '@/app/layout/layout';
import {PrivateRoute} from '@/app/router/PrivateRoute';
import {AuthCallbackPage} from '@/pages/auth/AuthCallbackPage';
import {AuthPage} from '@/pages/auth/AuthPage';
import {ChatPage} from '@/pages/chat/ChatPage';
import {ChatRoom} from '@/pages/chat/ChatRoom';
import {HomePage} from '@/pages/home/HomePage';
import {MyPage} from '@/pages/my/MyPage';
import {ProfileEditPage} from '@/pages/my/ProfileEditPage';
import {OnboardingPage} from '@/pages/onboarding/OnboardingPage';
import {ProfilePage} from '@/pages/profile/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: (
      <Layout>
        <AuthPage />
      </Layout>
    ),
  },
  {
    path: '/auth/callback',
    element: (
      <Layout>
        <AuthCallbackPage />
      </Layout>
    ),
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to='/auth' replace />,
      },
      {
        path: '/onboarding',
        element: (
          <Layout>
            <OnboardingPage />
          </Layout>
        ),
      },
      {
        element: <BottomNavLayout />,
        children: [
          {
            path: '/home',
            element: <HomePage />,
          },
          {
            path: '/chat',
            element: <ChatPage />,
          },
          {
            path: '/my',
            element: <MyPage />,
          },
        ],
      },
      {
        path: '/my/profile-edit',
        element: (
          <Layout>
            <ProfileEditPage />
          </Layout>
        ),
      },
      {
        path: '/profile/:userId',
        element: (
          <Layout>
            <ProfilePage />
          </Layout>
        ),
      },
      {
        path: '/chat/:roomId',

        element: <ChatRoom />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/auth' replace />,
  },
]);
