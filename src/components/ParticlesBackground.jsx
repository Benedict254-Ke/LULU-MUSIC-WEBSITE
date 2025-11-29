import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = {
    background: {
      color: "transparent",
    },
    particles: {
      number: { value: 30 },
      size: { value: 2 },
      opacity: { value: 0.4 },
      move: { enable: true, speed: 0.6 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
      },
    },
  };

  return ready ? <Particles id="tsparticles" options={options} /> : null;
}
