import Hero from '../components/home/Hero'
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
      <StatsSection />
      <CommunitySection />
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
