export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">关于我们</h3>
            <p className="text-gray-400">
              我们致力于为您提供最优质的购物体验。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">联系方式</h3>
            <p className="text-gray-400">电话：123-456-7890</p>
            <p className="text-gray-400">邮箱：support@example.com</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">关注我们</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                微信
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                微博
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 商城. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 