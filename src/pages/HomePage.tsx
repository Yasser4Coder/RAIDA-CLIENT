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

export default function HomePage() {
  return (
    <>
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
