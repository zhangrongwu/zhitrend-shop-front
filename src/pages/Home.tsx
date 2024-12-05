import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

// 添加轮播图数据
const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    title: '全球购物节',
    description: '限时优惠，全场低至5折',
    link: '/products?sale=true'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
    title: '新品首发',
    description: '探索最新上市的商品',
    link: '/products?new=true'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f',
    title: '品牌特惠',
    description: '精选品牌，折扣特惠',
    link: '/products?brand=featured'
  }
];

// 添加促销活动数据
const promotions = [
  {
    id: 1,
    title: '限时闪购',
    description: '每日精选商品，限时特价',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
    discount: '低至5折',
    endTime: '2024-12-31'
  },
  {
    id: 2,
    title: '新人专享',
    description: '新用户首单立减50元',
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae',
    discount: '立减50元',
    code: 'NEW50'
  },
  {
    id: 3,
    title: '会员特权',
    description: '会员专享95折',
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae',
    discount: '95折',
    memberOnly: true
  }
];

export default function Home() {
  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/products?featured=true');
      if (!response.ok) throw new Error('Failed to fetch featured products');
      return response.json();
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  return (
    <div className="bg-white">
      {/* Hero Slider Section */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          navigation
          className="h-[600px]"
        >
          {banners.map(banner => (
            <SwiperSlide key={banner.id}>
              <div className="relative h-full">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                    <p className="text-xl mb-8">{banner.description}</p>
                    <Link
                      to={banner.link}
                      className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100"
                    >
                      立即查看
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Promotions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          精彩活动
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map(promo => (
            <div
              key={promo.id}
              className="relative overflow-hidden rounded-lg shadow-lg group"
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                <p className="mb-4">{promo.description}</p>
                {promo.discount && (
                  <span className="inline-block bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {promo.discount}
                  </span>
                )}
                {promo.code && (
                  <span className="inline-block bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                    优惠码: {promo.code}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          热门分类
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories?.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative"
            >
              <div className="relative w-full h-80 rounded-lg overflow-hidden group-hover:opacity-75">
                <img
                  src={`https://source.unsplash.com/featured/400x300?${category.name}`}
                  alt={category.name}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            精选商品
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts?.slice(0, 8).map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group">
                <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={product.image || `https://source.unsplash.com/featured/400x400?product`}
                    alt={product.name}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">¥{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="inline-block bg-indigo-600 py-3 px-8 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700"
            >
              查看更多商品
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="flex justify-center">
              <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">全球直邮</h3>
            <p className="mt-2 text-base text-gray-500">
              来自世界各地的商品，直接送达您的手中
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center">
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">欢迎来到商城</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">热门商品</h2>
          {/* 这里可以添加热门商品列表 */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">最新活动</h2>
          {/* 这里可以添加活动列表 */}
        </div>
      </div>
    </div>
  );
} 