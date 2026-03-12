'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

// 新闻数据（实际应从 API 获取）
const newsData: Record<string, any> = {
  '1': {
    id: 1,
    title: '道达智能荣获 2025 年度新能源汽车行业创新企业奖',
    category: '公司动态',
    date: '2026-03-10',
    author: '市场部',
    views: 1280,
    image: '/images/news/award-2025.jpg',
    content: `
      <p>2026 年 3 月 8 日，第十三届中国新能源汽车产业峰会在北京隆重举行。道达智能凭借在电动观光车领域的技术创新和卓越市场表现，从 300 多家参评企业中脱颖而出，荣获"2025 年度新能源汽车行业创新企业奖"。</p>
      
      <h3>技术创新驱动发展</h3>
      <p>过去一年来，道达智能持续加大研发投入，成功推出多款创新产品：</p>
      <ul>
        <li>新一代电池管理系统，续航里程提升 30%</li>
        <li>智能调度系统，实现车队运营效率最大化</li>
        <li>无障碍观光车，填补行业空白</li>
        <li>快充技术，充电时间缩短至 2 小时</li>
      </ul>
      
      <h3>市场表现亮眼</h3>
      <p>2025 年，道达智能实现销售收入突破 5 亿元，同比增长 65%。产品覆盖全国 50+ 城市，服务 500+ 知名客户，包括张家界国家森林公园、三亚亚特兰蒂斯酒店、上海迪士尼乐园等标杆项目。</p>
      
      <h3>未来展望</h3>
      <p>道达智能 CEO 表示："获奖是对我们过去一年工作的肯定，也是对未来发展的鞭策。2026 年，我们将继续坚持创新驱动，加大研发投入，推出更多高品质产品，为绿色出行事业贡献力量。"</p>
      
      <p>此次峰会由中国汽车工业协会主办，吸引了来自全国的新能源汽车企业、行业协会、研究机构等 500 多家单位参会。</p>
    `,
    tags: ['获奖', '创新企业', '新能源汽车', '行业峰会'],
  },
  '2': {
    id: 2,
    title: '新款 23 座电动观光车正式上市，续航提升至 180 公里',
    category: '产品发布',
    date: '2026-03-05',
    author: '产品部',
    views: 2560,
    image: '/images/news/new-product-2026.jpg',
    content: `
      <p>经过两年研发，道达智能最新款 23 座电动观光车于 2026 年 3 月 5 日正式发布。新车搭载新一代电池管理系统，续航里程提升至 180 公里，满足全天候运营需求。</p>
      
      <h3>核心升级</h3>
      <ul>
        <li><strong>续航提升：</strong>从 120 公里提升至 180 公里，增幅达 50%</li>
        <li><strong>充电更快：</strong>支持快充技术，2 小时充满 80%</li>
        <li><strong>动力更强：</strong>电机功率提升至 7.5kW，爬坡能力达 25%</li>
        <li><strong>更安全：</strong>配备 ABS 防抱死系统、电磁刹车、缓降系统</li>
        <li><strong>更舒适：</strong>独立悬挂系统、人体工学座椅、静音设计</li>
      </ul>
      
      <h3>智能化配置</h3>
      <p>新车标配智能车载系统，支持：</p>
      <ul>
        <li>GPS 实时定位</li>
        <li>电量监控与预警</li>
        <li>行驶数据记录</li>
        <li>远程故障诊断</li>
      </ul>
      
      <h3>上市信息</h3>
      <p>新款 23 座电动观光车即日起接受预订，首批车辆将于 4 月中旬交付。预售价保持不变，详情请联系当地经销商或拨打 400 热线咨询。</p>
    `,
    tags: ['新品发布', '23 座', '续航升级', '电动观光车'],
  },
};

const relatedNews = [
  { id: 2, title: '新款 23 座电动观光车正式上市', category: '产品发布', date: '2026-03-05' },
  { id: 3, title: '张家界国家森林公园项目圆满交付', category: '项目动态', date: '2026-02-28' },
  { id: 4, title: '电动观光车行业白皮书发布', category: '行业资讯', date: '2026-02-20' },
];

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;
  const newsItem = newsData[newsId] || newsData['1'];

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">新闻不存在</h1>
          <Link href="/news" className="text-blue-600 hover:underline">
            返回新闻列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 text-sm mb-4 opacity-80">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {newsItem.category}
              </span>
              <span>{newsItem.date}</span>
              <span>•</span>
              <span>{newsItem.author}</span>
              <span>•</span>
              <span>{newsItem.views} 次阅读</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">{newsItem.title}</h1>
          </div>
        </div>
      </section>

      {/* 主要内容 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* 左侧：文章内容 */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* 封面图 */}
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>

                {/* 文章正文 */}
                <div className="p-8">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: newsItem.content }}
                  />

                  {/* 标签 */}
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {newsItem.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 分享 */}
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">分享到：</span>
                      <div className="flex space-x-4">
                        <button className="text-gray-400 hover:text-green-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.691 2.188C3.891 2.188 0 5.681 0 9.98c0 2.416 1.211 4.58 3.154 6.092-.126.955-.59 2.906-1.102 4.028-.066.143-.049.302.046.416.096.115.248.166.393.126 1.223-.34 3.285-1.305 4.484-1.878 1.815.842 3.846 1.298 5.982 1.224 4.8.014 8.69-3.479 8.69-7.778s-3.89-7.78-8.69-7.78l-4.266-.242zM7.5 15.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm4.5-1.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zm4.5 1.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"/>
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.942 5.556c.012.166.012.332.012.498 0 5.076-3.863 10.938-10.938 10.938-2.172 0-4.191-.633-5.893-1.722.306.035.605.052.918.052 1.799 0 3.453-.612 4.77-1.643-1.68-.033-3.095-1.14-3.583-2.662.236.035.475.055.72.055.348 0 .692-.047 1.021-.135-1.756-.354-3.078-1.904-3.078-3.766v-.048c.516.286 1.106.46 1.734.48-1.032-.688-1.712-1.86-1.712-3.188 0-.703.19-1.36.518-1.93 1.894 2.323 4.728 3.851 7.925 4.013-.066-.283-.101-.578-.101-.88 0-2.128 1.725-3.853 3.853-3.853 1.11 0 2.115.468 2.828 1.218.883-.174 1.715-.496 2.467-.938-.29.906-.906 1.668-1.712 2.15.785-.094 1.533-.302 2.23-.606-.523.783-1.185 1.47-1.946 2.04z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* 右侧：相关新闻 */}
            <div className="space-y-8">
              {/* 搜索框 */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">搜索新闻</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="输入关键词..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 相关新闻 */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">相关新闻</h3>
                <div className="space-y-4">
                  {relatedNews.map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.id}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-20 h-14 bg-gray-200 rounded flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {news.title}
                          </div>
                          <div className="text-sm text-gray-500">{news.date}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 分类目录 */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">新闻分类</h3>
                <ul className="space-y-2">
                  {['公司动态', '产品发布', '项目动态', '行业资讯', '媒体报道'].map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/news?category=${encodeURIComponent(cat)}`}
                        className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <span>{cat}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-2">订阅我们的新闻</h3>
                <p className="text-sm opacity-90 mb-4">获取最新产品发布和行业资讯</p>
                <input
                  type="email"
                  placeholder="您的邮箱"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3 focus:outline-none"
                />
                <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  订阅
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
