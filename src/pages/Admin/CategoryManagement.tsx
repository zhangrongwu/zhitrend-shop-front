import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Alert from '../../components/Alert';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
}

export default function CategoryManagement() {
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
      const response = await fetch('http://localhost:8787/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // 创建分类
  const createCategoryMutation = useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const response = await fetch('http://localhost:8787/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
      setAlert({ type: 'success', message: '分类创建成功！' });
    },
    onError: () => {
      setAlert({ type: 'error', message: '分类创建失败，请重试。' });
    },
  });

  // 更新分类
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: Category) => {
      const response = await fetch(`http://localhost:8787/api/categories/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
      setAlert({ type: 'success', message: '分类更新成功！' });
    },
    onError: () => {
      setAlert({ type: 'error', message: '分类更新失败，请重试。' });
    },
  });

  // 删除分类
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:8787/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setAlert({ type: 'success', message: '分类删除成功！' });
    },
    onError: () => {
      setAlert({ type: 'error', message: '分类删除失败，请重试。' });
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setParentId('');
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      description,
      parent_id: parentId ? Number(parentId) : undefined,
    };

    if (editingCategory) {
      await updateCategoryMutation.mutateAsync({ ...data, id: editingCategory.id });
    } else {
      await createCategoryMutation.mutateAsync(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Alert
        show={!!alert}
        type={alert?.type || 'success'}
        message={alert?.message || ''}
        onClose={() => setAlert(null)}
      />

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {editingCategory ? '编辑分类' : '添加分类'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">分类名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-2">父分类</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">无</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingCategory ? '更新' : '添加'}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                取消
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">分类列表</h2>
        <div className="space-y-4">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600">{category.description}</p>
                )}
                {category.parent_id && (
                  <p className="text-sm text-gray-500">
                    父分类: {categories.find(c => c.id === category.parent_id)?.name}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setName(category.name);
                    setDescription(category.description || '');
                    setParentId(category.parent_id?.toString() || '');
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  编辑
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('确定要删除这个分类吗？')) {
                      deleteCategoryMutation.mutate(category.id);
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 