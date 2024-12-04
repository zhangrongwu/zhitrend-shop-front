import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EyeIcon, TruckIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  user_name: string;
}

export default function OrderManagement() {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '获取订单列表失败');
      }
      return response.json();
    },
  });

  // 更新订单状态
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`http://localhost:8787/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '更新订单状态失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setAlert({ type: 'success', message: '订单状态更新成功' });
    },
    onError: (error: Error) => {
      setAlert({ type: 'error', message: error.message });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '待付款' },
      paid: { color: 'bg-green-100 text-green-800', text: '已付款' },
      shipped: { color: 'bg-blue-100 text-blue-800', text: '已发货' },
      delivered: { color: 'bg-purple-100 text-purple-800', text: '已送达' },
      cancelled: { color: 'bg-red-100 text-red-800', text: '已取消' },
    };
    return statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert
        show={!!alert}
        type={alert?.type || 'success'}
        message={alert?.message || ''}
        onClose={() => setAlert(null)}
      />

      {/* 页面标题 */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">订单管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            查看和管理所有订单，包括订单状态更新和详细信息查看。
          </p>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单号
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                客户
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金额
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                下单时间
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order) => {
              const { color, text } = getStatusBadge(order.status);
              return (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
                      {text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    {order.status === 'paid' && (
                      <button
                        onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'shipped' })}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <TruckIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 订单详情弹窗 */}
      <Modal
        open={isModalOpen}
        title="订单详情"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">订单号</label>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">客户</label>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.user_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">金额</label>
                <p className="mt-1 text-sm text-gray-900">¥{selectedOrder.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">状态</label>
                <p className="mt-1 text-sm text-gray-900">{getStatusBadge(selectedOrder.status).text}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">下单时间</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 