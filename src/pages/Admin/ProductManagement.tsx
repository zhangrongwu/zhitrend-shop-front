import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Alert from '../../components/Alert';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductManagement() {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();

  // 获取商品列表
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  // 创建商品
  const createProductMutation = useMutation({
    mutationFn: async (productData: FormData) => {
      const response = await fetch('http://localhost:8787/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: productData,
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
      setAlert({ type: 'success', message: '商品创建成功！' });
    },
    onError: () => {
      setAlert({ type: 'error', message: '商品创建失败，请重试。' });
    },
  });

  // 更新商品
  const updateProductMutation = useMutation({
    mutationFn: async (productData: FormData) => {
      const response = await fetch(`http://localhost:8787/api/products/${editingProduct?.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: productData,
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
      setAlert({ type: 'success', message: '商品更新成功！' });
    },
    onError: () => {
      setAlert({ type: 'error', message: '商品更新失败，请重试。' });
    },
  });

  // 删除商品
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:8787/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setAlert({ type: 'success', message: '商品删除成功！' });
    },
    onError: () => {
      setAlert({ type: 'error', message: '商品删除失败，请重试。' });
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage(null);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    if (editingProduct) {
      await updateProductMutation.mutateAsync(formData);
    } else {
      await createProductMutation.mutateAsync(formData);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Alert
        show={!!alert}
        type={alert?.type || 'success'}
        message={alert?.message || ''}
        onClose={() => setAlert(null)}
      />

      <h2 className="text-2xl font-bold mb-4">
        {editingProduct ? '编辑商品' : '添加商品'}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">商品名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">价格</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-2">描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">图片</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
        </div>
        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingProduct ? '更新' : '添加'}
          </button>
          {editingProduct && (
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

      <h2 className="text-2xl font-bold mb-4">商品列表</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-2"
            />
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">¥{product.price}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                编辑
              </button>
              <button
                onClick={() => {
                  if (window.confirm('确定要删除这个商品吗？')) {
                    deleteProductMutation.mutate(product.id);
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
  );
} 