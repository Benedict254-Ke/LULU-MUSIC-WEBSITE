import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const links = ["Hero", "About", "Music", "Gallery", "Contact"];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // fixed header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-darkBg/70 backdrop-blur-md z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold neon-text cursor-pointer" onClick={() => scrollToSection("hero")}>Lulu B</div>
        <nav className="hidden md:flex space-x-6">
          {links.map(link => (
            <button key={link} onClick={() => scrollToSection(link.toLowerCase())} className="hover:text-neonBlue transition font-semibold">{link}</button>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-darkBg py-4 space-y-4">
          {links.map(link => (
            <button key={link} onClick={() => {scrollToSection(link.toLowerCase()); setIsOpen(false)}} className="hover:text-neonBlue font-semibold">{link}</button>
          ))}
        </div>
      )}
    </header>
  );
}
