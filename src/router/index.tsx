import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../layouts/Layout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';

// Admin pages
import Dashboard from '../pages/Admin/Dashboard';
import ProductManagement from '../pages/Admin/ProductManagement';
import OrderManagement from '../pages/Admin/OrderManagement';
import UserManagement from '../pages/Admin/UserManagement';
import SalesReport from '../pages/Admin/SalesReport';
import CategoryManagement from '../pages/Admin/CategoryManagement';
import Settings from '../pages/Admin/Settings';

import ErrorBoundary from '../components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'products', element: <Products /> },
          { path: '/products/:id', element: <ProductDetail /> },
          { path: '/cart', element: <Cart /> },
          { path: '/orders', element: <Orders /> },
          { path: '/profile', element: <Profile /> },
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
          { path: '/about', element: <About /> },
        ],
      },
      {
        path: '/admin',
        element: (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'products', element: <ProductManagement /> },
          { path: 'categories', element: <CategoryManagement /> },
          { path: 'orders', element: <OrderManagement /> },
          { path: 'users', element: <UserManagement /> },
          { path: 'reports', element: <SalesReport /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
]); 