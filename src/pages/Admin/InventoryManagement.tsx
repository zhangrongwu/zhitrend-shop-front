import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Alert from '../../components/Alert';
import { ArrowUpIcon, ArrowDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface InventoryItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  low_stock_threshold: number;
  last_restock_date: string;
}

interface InventoryLog {
  id: number;
  product_id: number;
  product_name: string;
  quantity_change: number;
  type: 'in' | 'out' | 'adjust';
  reason: string;
  created_at: string;
}

export default function InventoryManagement() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const queryClient = useQueryClient();

  // 获取库存列表
  const { data: inventory, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/admin/inventory', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return response.json();
    },
  });

  // 获取库存日志
  const { data: logs } = useQuery<InventoryLog[]>({
    queryKey: ['inventory-logs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/admin/inventory/logs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch inventory logs');
      return response.json();
    },
  });

  // 调整库存
  const adjustInventoryMutation = useMutation({
    mutationFn: async (data: { productId: number; quantity: number; type: 'in' | 'out'; reason: string }) => {
      const response = await fetch('http://localhost:8787/api/admin/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to adjust inventory');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-logs'] });
      setAlert({ type: 'success', message: '库存调整成功' });
      setSelectedProduct(null);
      setQuantity('');
      setReason('');
    },
    onError: () => {
      setAlert({ type: 'error', message: '库存调整失败' });
    },
  });

  const handleAdjust = (type: 'in' | 'out') => {
    if (!selectedProduct || !quantity || !reason) {
      setAlert({ type: 'error', message: '请填写完整信息' });
      return;
    }

    adjustInventoryMutation.mutate({
      productId: selectedProduct,
      quantity: Number(quantity),
      type,
      reason,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Alert
        show={!!alert}
        type={alert?.type || 'success'}
        message={alert?.message || ''}
        onClose={() => setAlert(null)}
      />

      {/* 库存概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">库存总览</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>总SKU数</span>
              <span className="font-medium">{inventory?.length}</span>
            </div>
            <div className="flex justify-between">
              <span>低库存预警</span>
              <span className="font-medium text-red-600">
                {inventory?.filter(item => item.quantity <= item.low_stock_threshold).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 库存列表 */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">库存列表</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    当前库存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    预警阈值
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后入库时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${
                        item.quantity <= item.low_stock_threshold ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.low_stock_threshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.last_restock_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedProduct(item.product_id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        调整库存
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 库存日志 */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">库存变动日志</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数量变化
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    原因
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs?.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.type === 'in' ? '入库' : log.type === 'out' ? '出库' : '调整'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.quantity_change > 0 ? `+${log.quantity_change}` : log.quantity_change}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 