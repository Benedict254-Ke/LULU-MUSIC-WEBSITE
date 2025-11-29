import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const images = [
  { id: 1, src:"https://i.ibb.co/xqjtjcX1/1752644717404.jpg", category: "Photoshoot" },
  { id: 2, src: "https://i.ibb.co/tPmmCqbq/Screenshot-20250715-202818.png", category: "Live" },
  { id: 3, src: "https://i.ibb.co/WW08ThtL/IMG-20250702-WA0023.jpg", category: "Album Art" },
  { id: 4, src: "https://i.ibb.co/vCVHJkm0/1752644721396.jpg", category: "Photoshoot" },
  { id: 5, src: "https://i.ibb.co/ZzxrVmsn/1752644783374.jpg" , category: "Live" },
  { id: 6, src: "https://i.ibb.co/Z12nhC39/1752644725035.jpg", category: "Album Art" },
  { id: 7, src: "https://i.ibb.co/LzCfptnb/1752644730915.jpg", category: "Photoshoot" },
  { id: 8, src: "https://i.ibb.co/N6PHyXp4/1752644778148.jpg", category: "Live" },
  { id: 9, src: "https://i.ibb.co/jPcmZdqt/IMG-20250702-WA0025.jpg", category: "Album Art" },
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const categories = ["All", ...new Set(images.map(img=>img.category))];
  const filteredImages = filter==="All"?images:images.filter(img=>img.category===filter);

  return (
    <section id="gallery" className="min-h-screen flex flex-col justify-center items-center px-4 text-center relative">
      <h2 className="text-4xl font-bold mb-6 neon-text">Gallery</h2>
      <div className="flex space-x-4 mb-6 flex-wrap justify-center">
        {categories.map(cat => (
          <button key={cat} onClick={()=>setFilter(cat)} className={`px-4 py-2 rounded-lg font-semibold neon-button ${filter===cat?"bg-neonBlue text-darkBg":"bg-gray-800 text-gray-400 hover:bg-neonBlue hover:text-darkBg transition"}`}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredImages.map(img => (
          <div key={img.id} className="overflow-hidden rounded-lg shadow hover:scale-105 transform transition neon-button cursor-pointer" onClick={()=>setLightbox(img.src)}>
            <LazyLoadImage effect="blur" src={img.src} alt={img.category} className="w-full h-48 object-cover"/>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 cursor-pointer" onClick={()=>setLightbox(null)}>
          <img src={lightbox} alt="Enlarged" className="max-h-[90%] max-w-[90%]"/>
        </div>
      )}
    </section>
  );
}
