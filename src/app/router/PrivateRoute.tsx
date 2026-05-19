import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoute = () => {
  const isAuthenticated = true

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}
