'use client';

import { useState } from 'react';

// 视频数据
const videos = [
  {
    id: 1,
    title: '道达智能工厂实拍 - 现代化生产线',
    category: '工厂实拍',
    duration: '5:32',
    views: 12580,
    date: '2026-03-01',
    thumbnail: '/images/videos/factory-tour.jpg',
    videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
    description: '走进道达智能生产基地，探访从原材料到成品的完整生产流程，见证每一辆观光车的诞生。',
  },
  {
    id: 2,
    title: '23 座电动观光车产品介绍',
    category: '产品介绍',
    duration: '3:45',
    views: 8960,
    date: '2026-02-25',
    thumbnail: '/images/videos/product-23seat.jpg',
    videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
    description: '详细讲解 23 座电动观光车的核心参数、性能特点和适用场景。',
  },
  {
    id: 3,
    title: '张家界客户见证 - 运营一年后的心得',
    category: '客户见证',
    duration: '4:20',
    views: 6750,
    date: '2026-02-20',
    thumbnail: '/images/videos/customer-zhangjiajie.jpg',
    videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
    description: '张家界国家森林公园负责人分享使用道达智能观光车一年的运营数据和体验。',
  },
  {
    id: 4,
    title: '电池安全测试 - 极端环境挑战',
    category: '技术展示',
    duration: '6:15',
    views: 15200,
    date: '2026-02-15',
    thumbnail: '/images/videos/battery-test.jpg',
    videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
    description: '实拍电池包针刺、挤压、高温、低温等极端安全测试，见证过硬品质。',
  },
  {
    id: 5,
    title: '三亚亚特兰蒂斯酒店交付仪式',
    category: '项目案例',
    duration: '3:10',
    views: 5430,
    date: '2026-02-10',
    thumbnail: '/images/videos/sanya-delivery.jpg',
    videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
    description: '20 辆高端定制礼宾车交付三亚亚特兰蒂斯酒店，提升奢华服务标准。',
  },
  {
    id: 6,
    title: '智能调度系统演示',
    category: '技术展示',
    duration: '4:50',
    views: 7890,
    date: '2026-02-05',
    thumbnail: '/images/videos/smart-dispatch.jpg',
    videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
    description: '演示车队智能调度系统，实时监控、路径优化、运力调度一目了然。',
  },
  {
    id: 7,
    title: '无障碍观光车 - 关爱每一个人',
    category: '产品介绍',
    duration: '3:30',
    views: 9200,
    date: '2026-01-28',
    thumbnail: '/images/videos/accessible-vehicle.jpg',
    videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
    description: '专为行动不便人士设计的无障碍观光车，让每个人都能享受美好风景。',
  },
  {
    id: 8,
    title: '2025 年度客户大会精彩回顾',
    category: '公司动态',
    duration: '8:20',
    views: 4560,
    date: '2026-01-20',
    thumbnail: '/images/videos/annual-meeting.jpg',
    videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
    description: '来自全国 200+ 客户齐聚苏州，共商行业发展，见证年度颁奖。',
  },
];

const categories = ['全部', '产品介绍', '客户见证', '工厂实拍', '技术展示', '项目案例', '公司动态'];

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const filteredVideos = selectedCategory === '全部' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">视频中心</h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            深入了解道达智能的产品、技术和客户故事
          </p>
        </div>
      </section>

      {/* 分类筛选 */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 视频列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  {/* 占位图 */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  {/* 播放按钮 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* 时长标签 */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>

                  {/* 分类标签 */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      {video.category}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.date}</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {video.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 加载更多 */}
      <div className="text-center py-12">
        <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          加载更多视频
        </button>
      </div>

      {/* 视频上传 CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">想观看更多视频？</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            关注我们的 B 站官方账号，获取最新产品视频和使用教程
          </p>
          <a
            href="https://space.bilibili.com/xxxxx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#00A1D6] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#008EC2] transition-colors shadow-lg"
          >
            关注 B 站官方账号
          </a>
        </div>
      </section>
    </div>
  );
}
