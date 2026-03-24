import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Blog from './components/Blog'
import Contact from './components/Contact'

function App() {
  return (
    <main className="bg-[#282828] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <Blog />
      <Contact />
    </main>
  )
}

export default App
