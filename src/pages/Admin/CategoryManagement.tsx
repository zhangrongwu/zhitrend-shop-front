import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
}

export default function CategoryManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string>('');

  const queryClient = useQueryClient();

  // 获取分类列表
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/admin/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '获取分类列表失败');
      }
      return response.json();
    },
  });

  // 创建/更新分类
  const categoryMutation = useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const url = editingCategory 
        ? `http://localhost:8787/api/admin/categories/${editingCategory.id}`
        : 'http://localhost:8787/api/admin/categories';
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '操作失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
      setAlert({
        type: 'success',
        message: `分类${editingCategory ? '更新' : '创建'}成功`,
      });
    },
    onError: (error: Error) => {
      setAlert({
        type: 'error',
        message: error.message,
      });
    },
  });

  // 删除分类
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:8787/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '删除失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setAlert({
        type: 'success',
        message: '分类删除成功',
      });
    },
    onError: (error: Error) => {
      setAlert({
        type: 'error',
        message: error.message,
      });
    },
  });

  const resetForm = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setParentId('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Alert
        show={!!alert}
        type={alert?.type || 'success'}
        message={alert?.message || ''}
        onClose={() => setAlert(null)}
      />

      {/* 页面标题和添加按钮 */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">分类管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理商品分类，支持多级分类结构。
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            添加分类
          </button>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                描述
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                父分类
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories?.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {categories?.find(c => c.id === category.parent_id)?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setName(category.name);
                      setDescription(category.description || '');
                      setParentId(category.parent_id?.toString() || '');
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('确定要删除这个分类吗？')) {
                        deleteMutation.mutate(category.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分类表单弹窗 */}
      <Modal
        open={isModalOpen}
        title={editingCategory ? '编辑分类' : '添加分类'}
        onClose={() => setIsModalOpen(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            categoryMutation.mutate({
              name,
              description,
              parent_id: parentId ? Number(parentId) : null,
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              分类名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              父分类
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">无</option>
              {categories?.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  disabled={category.id === editingCategory?.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:col-start-2"
            >
              {editingCategory ? '更新' : '添加'}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={resetForm}
            >
              取消
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 