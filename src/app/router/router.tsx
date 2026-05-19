import { createBrowserRouter, Navigate } from 'react-router-dom'

import { PrivateRoute } from '@/app/router/PrivateRoute'
import { AuthPage } from '@/pages/auth/AuthPage'
import { ChatPage } from '@/pages/chat/ChatPage'
import { HomePage } from '@/pages/home/HomePage'
import { MyPage } from '@/pages/my/MyPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to="/auth" replace />,
      },
      {
        path: '/onboarding',
        element: <OnboardingPage />,
      },
      {
        path: '/home',
        element: <HomePage />,
      },
      {
        path: '/profile/:userId',
        element: <ProfilePage />,
      },
      {
        path: '/chat',
        element: <ChatPage />,
      },
      {
        path: '/chat/:roomId',
        element: <ChatPage />,
      },
      {
        path: '/my',
        element: <MyPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth" replace />,
  },
])
