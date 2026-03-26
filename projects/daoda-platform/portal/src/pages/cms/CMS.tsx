/**
 * CMS 内容管理路由
 */
import { Routes, Route } from 'react-router-dom'
import CMSDashboard from './CMSDashboard'
import NewsList from './NewsList'
import CaseList from './CaseList'
import VideoList from './VideoList'

export default function CMS() {
  return (
    <Routes>
      <Route index element={<CMSDashboard />} />
      <Route path="news" element={<NewsList />} />
      <Route path="cases" element={<CaseList />} />
      <Route path="videos" element={<VideoList />} />
    </Routes>
  )
}
