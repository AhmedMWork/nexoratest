// ============================================================
// NEXORA — Home Page
// ============================================================

import { Helmet } from 'react-helmet-async';
import HeroSection from '@/sections/home/HeroSection';
import NewArrivalsSection from '@/sections/home/NewArrivalsSection';
import FeaturedCollectionSection from '@/sections/home/FeaturedCollectionSection';
import BestSellersSection from '@/sections/home/BestSellersSection';
import LimitedDropsSection from '@/sections/home/LimitedDropsSection';
import WhyNexoraSection from '@/sections/home/WhyNexoraSection';
import ReviewsSection from '@/sections/home/ReviewsSection';
import Marquee from '@/components/ui/Marquee';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>NEXORA | Premium Summer Essentials — Built Different</title>
        <meta name="description" content="NEXORA crafts premium summer t-shirts for men and women. Elevated essentials with Egyptian cotton, precision fits, and obsessive attention to detail." />
        <meta property="og:title" content="NEXORA | Premium Summer Essentials" />
        <meta property="og:description" content="Elevated essentials crafted with precision. Premium organic cotton, architectural fits." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/nexora-logo-bg.jpg" />
        <link rel="canonical" href="/" />
      </Helmet>

      <HeroSection />
      <NewArrivalsSection />
      <Marquee />
      <FeaturedCollectionSection />
      <BestSellersSection />
      <LimitedDropsSection />
      <WhyNexoraSection />
      <ReviewsSection />
    </>
  );
}
