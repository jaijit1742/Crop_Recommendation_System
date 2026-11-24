import HeroSection from '../components/HeroSection'
import LogoMarquee from '../components/LogoMarquee'
import InnovationSection from '../components/InnovationSection'
import TechnologySection from '../components/TechnologySection'
import StoryGrid from '../components/StoryGrid'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="bg-[#062D17]">
      <HeroSection />
      <LogoMarquee />
      <InnovationSection />
      <TechnologySection />
      <StoryGrid />
      <FAQSection />
      <Footer />
    </div>
  )
}
