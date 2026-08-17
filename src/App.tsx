import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/seo/ScrollToTop'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import CommunityPage from './pages/CommunityPage'
import MembersPage from './pages/MembersPage'
import MemberProfilePage from './pages/MemberProfilePage'
import ExpertsPage from './pages/ExpertsPage'
import ProgramsPage from './pages/ProgramsPage'
import ServicesDirectoryPage from './pages/ServicesDirectoryPage'
import AcademiesPage from './pages/AcademiesPage'
import BrandsPage from './pages/BrandsPage'
import BrandPage from './pages/BrandPage'
import SosStorePage from './pages/SosStorePage'
import OpportunitiesPage from './pages/OpportunitiesPage'
import ConsultationsPage from './pages/ConsultationsPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import PartnershipsPage from './pages/PartnershipsPage'
import MembershipPage from './pages/MembershipPage'
import BenefitsPage from './pages/BenefitsPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import VerifyEmailPage, { ForgotPasswordPage, ResetPasswordPage } from './pages/AuthMailPages'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="members/:id" element={<MemberProfilePage />} />
          <Route path="experts" element={<ExpertsPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="services" element={<ServicesDirectoryPage />} />
          <Route path="academies" element={<AcademiesPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:id" element={<BrandPage />} />
          <Route path="sos-store" element={<SosStorePage />} />
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="consultations" element={<ConsultationsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="partnerships" element={<PartnershipsPage />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="benefits" element={<BenefitsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
