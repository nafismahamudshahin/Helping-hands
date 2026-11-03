import StatusSection from "@/components/home/StatusSection"
import HeroBanner from "@/components/home/HeroBanner"
import NearUpcomingEvents from "@/components/home/NearUpcomingEvents"
import EventGallery from "@/components/home/EventGallery"
import NewsletterSection from "@/components/home/NewsletterSection"


export default async function HomePage() {

  return (
    <>
      <HeroBanner></HeroBanner>
      <StatusSection></StatusSection>
      <NearUpcomingEvents></NearUpcomingEvents>
      <EventGallery></EventGallery>
      <NewsletterSection />
    </>
  )
}
