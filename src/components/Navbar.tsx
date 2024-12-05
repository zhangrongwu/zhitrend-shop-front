import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              商城
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/products" className="text-gray-700 hover:text-gray-900">
                商品
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-gray-900">
                  购物车
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-gray-900">
                  订单
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin/products"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    管理后台
                  </Link>
                )}
                <div className="relative group">
                  <button className="text-gray-700 hover:text-gray-900">
                    {user.email}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      个人信息
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 