import Header from './components/header'
import Hero from './components/Hero'
import Nichos from './components/Nichos'
import ComoFunciona from './components/ComoFunciona'
import Depoimentos from './components/Depoimentos'
import Footer from './components/footer'
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function Home() {
  return (
    <>
     
      <main>
        <Header />
        <Hero />
        <Nichos />
        <ComoFunciona />
        <Depoimentos />
        <Footer />
        <SpeedInsights />
      </main>
    </>
  )
}
