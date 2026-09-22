import Hero from '../components/home/Hero'
import SosGroupOriginSection from '../components/home/SosGroupOriginSection'
import LandingQuickPaths from '../components/home/LandingQuickPaths'
import CommunityManagerSection from '../components/home/CommunityManagerSection'
import AnnouncementsSection from '../components/home/AnnouncementsSection'
import {
  StatsSection,
  CommunitySection,
  FeaturedMembers,
  FeaturedBrands,
  ServicesSection,
  EventsSection,
  SuccessStories,
  PartnersSection,
  PricingSection,
  FinalCTA,
} from '../components/home/Sections'
import SeoHead from '../components/seo/SeoHead'
import { organizationJsonLd, routeSeo, websiteJsonLd } from '../lib/seo'

export default function HomePage() {
  const seo = routeSeo.home
  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={[...seo.keywords]}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />
      <Hero />
      <SosGroupOriginSection />
      <AnnouncementsSection />
      <StatsSection />
      <LandingQuickPaths />
      <CommunitySection />
      <CommunityManagerSection />
      <FeaturedMembers />
      <FeaturedBrands />
      <ServicesSection />
      <EventsSection />
      <SuccessStories />
      <PartnersSection />
      <PricingSection />
      <FinalCTA />
    </>
  )
}
