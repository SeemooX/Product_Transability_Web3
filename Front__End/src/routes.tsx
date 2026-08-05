import { createBrowserRouter } from 'react-router';
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AddStep } from './pages/AddStep';
import { ProductHistory } from './pages/ProductHistory';
import { ProfilePage } from './pages/ProfilePage';
import ProductDetails from './pages/ProductDetails';
import { QRScan } from './pages/QRScan';
import { PublicOnlyRoute } from './context/PublicOnlyRoute';
import { ProtectedRoute } from './context/ProtectedRoute';
import { AdminRoute } from './context/AdminProtectedRoute';
import CreateUser from './pages/admin/CreateUser';
import { HistoryPage } from './pages/HistoryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicOnlyRoute>
        <WelcomePage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products',
    element: (
      <ProtectedRoute>
        <ProductsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scan',
    element: (
      <ProtectedRoute>
        <QRScan />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history/:id',
    element: (
      <ProtectedRoute>
        <ProductHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <ProductHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products/:id',
    element: (
      <ProtectedRoute>
        <ProductDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: 'products/addstep/:id',
    element: (
      <ProtectedRoute>
        <AddStep />
      </ProtectedRoute>
    ),
  },
  {
    path: '/createUser',
    element: (
      <AdminRoute>
        <CreateUser />
      </AdminRoute>
    ),
  }
]);