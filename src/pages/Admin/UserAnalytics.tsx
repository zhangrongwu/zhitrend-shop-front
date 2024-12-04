import { useQuery } from '@tanstack/react-query';
import { ChartBarIcon, UserGroupIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';

interface UserAnalytics {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
  };
  behaviorStats: {
    totalViews: number;
    totalSearches: number;
    totalCartAdds: number;
    totalPurchases: number;
  };
  topSearches: {
    keyword: string;
    count: number;
  }[];
  userRetention: {
    date: string;
    retention: number;
  }[];
  userBehaviorFlow: {
    action: string;
    count: number;
    nextActions: {
      action: string;
      count: number;
    }[];
  }[];
}

export default function UserAnalytics() {
  const { data: analytics, isLoading } = useQuery<UserAnalytics>({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/admin/analytics/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  // 准备图表数据
  const retentionData = {
    labels: analytics?.userRetention.map(d => d.date),
    datasets: [
      {
        label: '用户留存率',
        data: analytics?.userRetention.map(d => d.retention * 100),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 用户统计卡片 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">总用户数</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.userStats.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">活跃用户</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.userStats.activeUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">新增用户</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.userStats.newUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 用户行为统计 */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-medium">用户行为统计</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">浏览量</p>
            <p className="text-xl font-semibold">
              {analytics?.behaviorStats.totalViews.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">搜索次数</p>
            <p className="text-xl font-semibold">
              {analytics?.behaviorStats.totalSearches.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">加购次数</p>
            <p className="text-xl font-semibold">
              {analytics?.behaviorStats.totalCartAdds.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">购买次数</p>
            <p className="text-xl font-semibold">
              {analytics?.behaviorStats.totalPurchases.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 用户留存率趋势 */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-medium">用户留存率趋势</h3>
        <div className="h-64">
          <Line data={retentionData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* 热门搜索词 */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-medium">热门搜索词</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {analytics?.topSearches.map((search, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">{search.keyword}</span>
              <span className="text-sm text-gray-500">{search.count}次</span>
            </div>
          ))}
        </div>
      </div>

      {/* 用户行为路径 */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-medium">用户行为路径</h3>
        <div className="space-y-6">
          {analytics?.userBehaviorFlow.map((flow, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                <div className="text-lg font-medium">{flow.action}</div>
                <span className="ml-2 text-sm text-gray-500">({flow.count}次)</span>
              </div>
              <div className="pl-8 space-y-2">
                {flow.nextActions.map((next, nextIndex) => (
                  <div key={nextIndex} className="flex items-center">
                    <svg
                      className="mr-2 w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <div className="text-sm">{next.action}</div>
                    <span className="ml-2 text-xs text-gray-500">({next.count}次)</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 