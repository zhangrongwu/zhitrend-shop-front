import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ProductSkeleton, BannerSkeleton } from '../components/Skeleton';
import LazyImage from '../components/LazyImage';

export default function Home() {
  const { data: homeData, isLoading, error } = useQuery({
    queryKey: ['home'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8787/api/home');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '获取数据失败');
      }
      return response.json();
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-600 mb-4">加载失败: {error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <BannerSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const {
    banners = [],
    featuredProducts = [],
    newProducts = [],
    categories = []
  } = homeData;

  return (
    <div className="bg-white">
      {/* Hero Slider Section */}
      {banners.length > 0 && (
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
                  <LazyImage
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
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            精选商品
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="relative overflow-hidden rounded-lg shadow-lg group"
              >
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="mb-4">{product.description}</p>
                  {product.discount && (
                    <span className="inline-block bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {product.discount}
                    </span>
                  )}
                  {product.code && (
                    <span className="inline-block bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                      优惠码: {product.code}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            新品首发
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newProducts.map(product => (
              <div
                key={product.id}
                className="relative overflow-hidden rounded-lg shadow-lg group"
              >
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="mb-4">{product.description}</p>
                  {product.discount && (
                    <span className="inline-block bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {product.discount}
                    </span>
                  )}
                  {product.code && (
                    <span className="inline-block bg-yellow-500 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                      优惠码: {product.code}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            分类
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
              <div
                key={category.id}
                className="relative overflow-hidden rounded-lg shadow-lg group"
              >
                <LazyImage
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="mb-4">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 