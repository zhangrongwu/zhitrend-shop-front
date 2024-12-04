import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import ImageUpload from '../../components/ImageUpload';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id?: number;
  stock?: number;
  status: 'active' | 'inactive';
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  status: 'active' | 'inactive';
  stock: string;
}

export default function ProductManagement() {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    editingProduct: Product | null;
    formData: FormData;
  }>({
    isOpen: false,
    editingProduct: null,
    formData: {
      name: '',
      description: '',
      price: '',
      category_id: '',
      status: 'active',
      stock: '',
    },
  });

  // 获取商品列表
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/admin/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  // 获取分类列表
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/admin/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // 创建/更新商品
  const productMutation = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const url = modalState.editingProduct 
        ? `http://localhost:8787/api/admin/products/${modalState.editingProduct.id}`
        : 'http://localhost:8787/api/admin/products';
      
      const response = await fetch(url, {
        method: modalState.editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to save product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setModalState(prev => ({
        ...prev,
        isOpen: false,
        editingProduct: null,
      }));
      setAlert({
        type: 'success',
        message: `商品${modalState.editingProduct ? '更新' : '创建'}成功`,
      });
    },
    onError: () => {
      setAlert({
        type: 'error',
        message: `商品${modalState.editingProduct ? '更新' : '创建'}失败`,
      });
    },
  });

  // 删除商品
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:8787/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setAlert({ type: 'success', message: '商品删除成功' });
    },
    onError: () => {
      setAlert({ type: 'error', message: '商品删除失败' });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除这个商品吗？')) {
      deleteMutation.mutate(id);
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setModalState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // 验证表单数据
      if (!modalState.formData.name.trim()) {
        setAlert({
          type: 'error',
          message: '请输入商品名称',
        });
        return;
      }

      if (!modalState.formData.price || parseFloat(modalState.formData.price) <= 0) {
        setAlert({
          type: 'error',
          message: '请输入有效的价格',
        });
        return;
      }

      const data = {
        ...modalState.formData,
        price: parseFloat(modalState.formData.price),
        stock: modalState.formData.stock ? parseInt(modalState.formData.stock) : undefined,
        category_id: modalState.formData.category_id ? parseInt(modalState.formData.category_id) : undefined,
      };

      await productMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlert({
        type: 'error',
        message: '提交失败，请重试',
      });
    }
  };

  // 重置表单
  const resetForm = () => {
    setModalState({
      isOpen: false,
      editingProduct: null,
      formData: {
        name: '',
        description: '',
        price: '',
        category_id: '',
        status: 'active',
        stock: '',
      },
    });
  };

  // 打开编辑模态框
  const openEditModal = (product: Product) => {
    setModalState({
      isOpen: true,
      editingProduct: product,
      formData: {
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category_id: product.category_id?.toString() || '',
        status: product.status,
        stock: product.stock?.toString() || '',
      },
    });
  };

  // 打开新建模态框
  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      editingProduct: null,
      formData: {
        name: '',
        description: '',
        price: '',
        category_id: '',
        status: 'active',
        stock: '',
      },
    });
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
          <h1 className="text-xl font-semibold text-gray-900">商品管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理所有商品的基本信息、库存和状态。
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            添加商品
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  商品信息
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  价格
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  库存
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  状态
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.map((product: Product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img
                          className="object-cover w-10 h-10 rounded-full"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">¥{product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? '上架' : '下架'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(product)}
                      className="mr-4 text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 编辑/创建商品模态框 */}
      <Modal
        open={modalState.isOpen}
        title={modalState.editingProduct ? '编辑商品' : '添加商品'}
        onClose={resetForm}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              商品名称
            </label>
            <input
              type="text"
              name="name"
              value={modalState.formData.name}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              商品描述
            </label>
            <textarea
              name="description"
              value={modalState.formData.description}
              onChange={handleInputChange}
              rows={3}
              className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              价格
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">¥</span>
              </div>
              <input
                type="number"
                name="price"
                value={modalState.formData.price}
                onChange={handleInputChange}
                className="block pr-12 pl-7 w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              分类
            </label>
            <select
              name="category_id"
              value={modalState.formData.category_id}
              onChange={handleInputChange}
              className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">选择分类</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              disabled={productMutation.isPending}
              className="inline-flex justify-center px-3 py-2 w-full text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed sm:col-start-2"
            >
              {productMutation.isPending ? '提交中...' : (modalState.editingProduct ? '更新' : '添加')}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex justify-center px-3 py-2 mt-3 w-full text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 shadow-sm hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            >
              取消
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 