import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: '仪表板', href: '/admin', icon: HomeIcon },
  { name: '商品管理', href: '/admin/products', icon: CubeIcon },
  { name: '分类管理', href: '/admin/categories', icon: TagIcon },
  { name: '订单管理', href: '/admin/orders', icon: ShoppingBagIcon },
  { name: '用户管理', href: '/admin/users', icon: UserGroupIcon },
  { name: '销售报表', href: '/admin/reports', icon: ChartBarIcon },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 检查是否是管理员
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* 侧边栏 */}
        <div className="w-64 bg-gray-800 min-h-screen fixed">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4">
              <span className="text-xl font-bold text-white">管理后台</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 ml-64">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
} 