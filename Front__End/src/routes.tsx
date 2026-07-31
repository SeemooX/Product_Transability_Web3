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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/scan',
    element: <QRScan />,
  },
  {
    path: '/history',
    element: <ProductHistory />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/product',
    element: <ProductDetails />,
  },
  {
    path: '/addstep',
    element: <AddStep />,
  }
]);