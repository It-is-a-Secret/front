import {createBrowserRouter, Navigate} from 'react-router-dom';

import {BottomNavLayout} from '@/app/layout/BottomNavLayout';
import {Layout} from '@/app/layout/layout';
import {PrivateRoute} from '@/app/router/PrivateRoute';
import {AuthCallbackPage} from '@/pages/auth/AuthCallbackPage';
import {AuthPage} from '@/pages/auth/AuthPage';
import {ChatPage} from '@/pages/chat/ChatPage';
import {ChatRoom} from '@/pages/chat/ChatRoom';
import {NewChatRoom} from '@/pages/chat/NewChatRoom';
import {HomePage} from '@/pages/home/HomePage';
import {PwaInstallGuide} from '@/pages/home/features/pwa-install-prompt/PwaInstallGuide';
import {MyPage} from '@/pages/my/MyPage';
import {ProfileEditPage} from '@/pages/my/ProfileEditPage';
import {OnboardingPage} from '@/pages/onboarding/OnboardingPage';
import {ProfilePage} from '@/pages/profile/ProfilePage';
import {TermsPage} from '@/pages/terms/TermsPage';

export const router = createBrowserRouter([
  ...(import.meta.env.DEV
    ? [
        ...(['android', 'ios'] as const).map((platform) => ({
          path: `/__preview/install-guide/${platform}`,
          element: (
            <Layout>
              <PwaInstallGuide previewPlatform={platform} />
            </Layout>
          ),
        })),
        {
          path: '/__preview/photo-feedback',
          lazy: async () => {
            const {PhotoFeedbackPreview} =
              await import('@/pages/home/PhotoFeedbackPreview');
            return {Component: PhotoFeedbackPreview};
          },
        },
      ]
    : []),
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
    path: '/terms',
    element: (
      <Layout>
        <TermsPage />
      </Layout>
    ),
  },
  {
    path: '/install-guide',
    element: (
      <Layout>
        <PwaInstallGuide />
      </Layout>
    ),
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to='/home' replace />,
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
        path: '/chat/new/:feedId',
        element: <NewChatRoom />,
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
