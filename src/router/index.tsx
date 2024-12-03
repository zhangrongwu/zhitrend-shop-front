import { createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../layouts/Layout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductManagement from '../pages/Admin/ProductManagement';
import CategoryManagement from '../pages/Admin/CategoryManagement';
import OrderManagement from '../pages/Admin/OrderManagement';
import UserManagement from '../pages/Admin/UserManagement';
import SalesReport from '../pages/Admin/SalesReport';

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> }
        ]
      },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { path: 'products', element: <ProductManagement /> },
          { path: 'categories', element: <CategoryManagement /> },
          { path: 'orders', element: <OrderManagement /> },
          { path: 'users', element: <UserManagement /> },
          { path: 'reports', element: <SalesReport /> }
        ]
      }
    ]
  }
]); 