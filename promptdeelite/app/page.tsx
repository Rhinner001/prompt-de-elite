import Header from './components/header'
import Hero from './components/Hero'
import Nichos from './components/Nichos'
import ComoFunciona from './components/ComoFunciona'
import Depoimentos from './components/Depoimentos'
import Footer from './components/footer'

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
      </main>
    </>
  )
}
