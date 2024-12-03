import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 如果不是管理员，重定向到首页
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold">管理后台</h2>
        </div>
        <nav className="mt-4">
          <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-100">
            商品管理
          </Link>
          <Link to="/admin/categories" className="block px-4 py-2 hover:bg-gray-100">
            分类管理
          </Link>
          <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-100">
            订单管理
          </Link>
          <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-100">
            用户管理
          </Link>
          <Link to="/admin/reports" className="block px-4 py-2 hover:bg-gray-100">
            销售报表
          </Link>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">后台管理</h1>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                退出登录
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 