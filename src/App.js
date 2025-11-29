import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Music from "./components/Music";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-darkBg text-white font-sans scroll-smooth">
      <Header />
      <main>
        <Hero />
        <About />
        <Music />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
