import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

function App() {
  return (
    <main className="bg-[#282828]">
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <Contact />
    </main>
  )
}

export default App