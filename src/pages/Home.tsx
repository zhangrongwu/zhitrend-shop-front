export default function Home() {
  return (
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