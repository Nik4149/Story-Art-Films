import Hero          from '../components/Hero'
import Intro         from '../components/Intro'
import Portfolio     from '../components/Portfolio'
import FeaturedProject from '../components/FeaturedProject'
import Services      from '../components/Services'
import About         from '../components/About'
import Process       from '../components/Process'
import Testimonials  from '../components/Testimonials'
import SocialGallery from '../components/SocialGallery'
import Pricing       from '../components/Pricing'
import BookingForm   from '../components/BookingForm'
import Contact       from '../components/Contact'
import Footer        from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Portfolio />
      <FeaturedProject />
      <Services />
      <About />
      <Process />
      <Testimonials />
      <SocialGallery />
      <Pricing />
      <BookingForm />
      <Contact />
      <Footer />
    </>
  )
}
