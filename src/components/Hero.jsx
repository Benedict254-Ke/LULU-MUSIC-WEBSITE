import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function Hero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = {
    fullScreen: { enable: false },
    background: { color: "#0b0b0f" },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: "#00ffff" },
      links: {
        enable: true,
        color: "#00ffff",
        distance: 150,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        outModes: "bounce",
      },
      number: {
        value: 50,
        density: { enable: true, area: 800 },
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 4 } },
    },
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-darkBg relative overflow-hidden"
    >
      {ready && (
        <Particles
          id="tsparticles"
          options={options}
          className="absolute inset-0 -z-10"
        />
      )}

      {/* DP */}
      <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 shadow-lg border-4 border-neonBlue neon-button animate-bounce">
        <img
          src="https://i.ibb.co/Z12nhC39/1752644725035.jpg"
          alt="Lulu B"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Quote */}
      <h1 className="text-3xl md:text-5xl font-bold mb-4 neon-text px-4">
        "Music is more than sound—it's the heartbeat of emotion. I’m Lulu B, and through my songs, I tell stories of love, life, and the journey we all share. Every note is a piece of my soul, crafted to move, inspire, and connect us beyond words."
      </h1>

      <a
        href="#music"
        className="mt-6 px-6 py-3 bg-neonBlue text-darkBg font-semibold rounded-lg hover:shadow-lg neon-button"
      >
        Listen Now
      </a>
    </section>
  );
}
