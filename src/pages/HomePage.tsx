import Hero from '../components/home/Hero'
import SosGroupOriginSection from '../components/home/SosGroupOriginSection'
import CommunityManagerSection from '../components/home/CommunityManagerSection'
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
      <StatsSection />
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
