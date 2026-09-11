import { HeroSection } from "@/components/sections/hero";
import { PhilosophySection } from "@/components/sections/philosophy";
import { NatureStory } from "@/components/sections/nature";
import { LuxuryStory } from "@/components/sections/luxury";
import { AmenitiesSection } from "@/components/sections/amenities";
import { ClubLifestyle } from "@/components/sections/lifestyle";
import { ModernAmenities } from "@/components/sections/modern-amenities";
import { RefreshSection } from "@/components/sections/refresh";
import { SportsStory } from "@/components/sections/sports";
import { EventsStory } from "@/components/sections/events";
import { GallerySection } from "@/components/sections/gallery";
import { LocationSection } from "@/components/sections/location";
import { ContactClosing } from "@/components/sections/contact";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <HeroSection />
      <PhilosophySection />
      <NatureStory />
      <LuxuryStory />
      <AmenitiesSection />
      <ClubLifestyle />
      <ModernAmenities />
      <RefreshSection />
      <SportsStory />
      <EventsStory />
      <GallerySection />
      <LocationSection />
      <ContactClosing />
    </main>
  );
}
