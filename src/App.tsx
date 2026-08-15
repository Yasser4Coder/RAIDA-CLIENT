import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/seo/ScrollToTop'
import HomePage from './pages/HomePage'
import MembersPage from './pages/MembersPage'
import MemberProfilePage from './pages/MemberProfilePage'
import BrandsPage from './pages/BrandsPage'
import BrandPage from './pages/BrandPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import PartnershipsPage from './pages/PartnershipsPage'
import MembershipPage from './pages/MembershipPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="members/:id" element={<MemberProfilePage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:id" element={<BrandPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="partnerships" element={<PartnershipsPage />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
