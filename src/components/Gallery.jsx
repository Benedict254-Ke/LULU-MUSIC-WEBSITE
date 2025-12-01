import { useState, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

// Optimized image data with thumbnails and placeholders
const images = [
  { 
    id: 1, 
    src: "https://i.ibb.co/xqjtjcX1/1752644717404.jpg", 
    thumbnail: "https://i.ibb.co/xqjtjcX1/1752644717404.jpg?w=300&q=70", // Add ?w=300 parameter if supported
    category: "Photoshoot",
    aspectRatio: "3:4"
  },
  { 
    id: 2, 
    src: "https://i.ibb.co/tPmmCqbq/Screenshot-20250715-202818.png", 
    thumbnail: "https://i.ibb.co/tPmmCqbq/Screenshot-20250715-202818.png?w=300&q=70",
    category: "Live",
    aspectRatio: "16:9"
  },
  { 
    id: 3, 
    src: "https://i.ibb.co/WW08ThtL/IMG-20250702-WA0023.jpg", 
    thumbnail: "https://i.ibb.co/WW08ThtL/IMG-20250702-WA0023.jpg?w=300&q=70",
    category: "Album Art",
    aspectRatio: "1:1"
  },
  { 
    id: 4, 
    src: "https://i.ibb.co/vCVHJkm0/1752644721396.jpg", 
    thumbnail: "https://i.ibb.co/vCVHJkm0/1752644721396.jpg?w=300&q=70",
    category: "Photoshoot",
    aspectRatio: "3:4"
  },
  { 
    id: 5, 
    src: "https://i.ibb.co/ZzxrVmsn/1752644783374.jpg", 
    thumbnail: "https://i.ibb.co/ZzxrVmsn/1752644783374.jpg?w=300&q=70",
    category: "Live",
    aspectRatio: "16:9"
  },
  { 
    id: 6, 
    src: "https://i.ibb.co/Z12nhC39/1752644725035.jpg", 
    thumbnail: "https://i.ibb.co/Z12nhC39/1752644725035.jpg?w=300&q=70",
    category: "Album Art",
    aspectRatio: "1:1"
  },
  { 
    id: 7, 
    src: "https://i.ibb.co/LzCfptnb/1752644730915.jpg", 
    thumbnail: "https://i.ibb.co/LzCfptnb/1752644730915.jpg?w=300&q=70",
    category: "Photoshoot",
    aspectRatio: "3:4"
  },
  { 
    id: 8, 
    src: "https://i.ibb.co/N6PHyXp4/1752644778148.jpg", 
    thumbnail: "https://i.ibb.co/N6PHyXp4/1752644778148.jpg?w=300&q=70",
    category: "Live",
    aspectRatio: "16:9"
  },
  { 
    id: 9, 
    src: "https://i.ibb.co/jPcmZdqt/IMG-20250702-WA0025.jpg", 
    thumbnail: "https://i.ibb.co/jPcmZdqt/IMG-20250702-WA0025.jpg?w=300&q=70",
    category: "Album Art",
    aspectRatio: "1:1"
  },
];

// Calculate aspect ratio class
const getAspectRatioClass = (ratio) => {
  switch(ratio) {
    case '1:1': return 'aspect-square';
    case '3:4': return 'aspect-[3/4]';
    case '16:9': return 'aspect-video';
    default: return 'aspect-square';
  }
};

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [isLightboxLoading, setIsLightboxLoading] = useState(false);

  // Memoized categories and filtered images for performance
  const categories = useMemo(() => 
    ["All", ...new Set(images.map(img => img.category))], 
  []);

  const filteredImages = useMemo(() => 
    filter === "All" ? images : images.filter(img => img.category === filter),
  [filter]);

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const handleLightboxOpen = (src) => {
    setLightbox(src);
    setIsLightboxLoading(true);
  };

  const handleLightboxLoad = () => {
    setIsLightboxLoading(false);
  };

  return (
    <section id="gallery" className="min-h-screen flex flex-col justify-center items-center px-4 py-12 text-center relative">
      <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-purple-500">
        Gallery
      </h2>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
              filter === cat
                ? "bg-gradient-to-r from-neonBlue to-cyan-500 text-white shadow-lg shadow-neonBlue/30"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid with optimized loading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {filteredImages.map(img => (
          <div 
            key={img.id} 
            className={`group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer relative ${
              loadedImages[img.id] ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => handleLightboxOpen(img.src)}
          >
            {/* Loading Skeleton */}
            {!loadedImages[img.id] && (
              <div className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse ${getAspectRatioClass(img.aspectRatio)}`}>
                <div className="flex items-center justify-center h-full">
                  <div className="w-10 h-10 border-2 border-neonBlue border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}

            {/* Lazy Loaded Image */}
            <LazyLoadImage
              effect="blur"
              src={img.thumbnail || img.src}
              alt={`Gallery - ${img.category}`}
              className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                getAspectRatioClass(img.aspectRatio)
              } ${loadedImages[img.id] ? 'opacity-100' : 'opacity-0'}`}
              threshold={100} // Load when within 100px of viewport
              afterLoad={() => handleImageLoad(img.id)}
              placeholder={
                <div className={`bg-gradient-to-br from-gray-800 to-gray-900 ${getAspectRatioClass(img.aspectRatio)}`} />
              }
            />

            {/* Category Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-semibold text-sm bg-neonBlue/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {img.category}
              </span>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-neonBlue/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-lg flex flex-col justify-center items-center z-50 transition-all duration-300"
          onClick={() => setLightbox(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-3 transition-all duration-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Loading Indicator */}
          {isLightboxLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-neonBlue border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Full-size Image */}
          <div className="relative max-h-[85vh] max-w-[90vw] mx-4">
            <img 
              src={lightbox}
              alt="Enlarged view"
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              onLoad={handleLightboxLoad}
              loading="eager"
            />
            
            {/* Download Button */}
            <a
              href={lightbox}
              download
              className="absolute bottom-4 right-4 bg-neonBlue hover:bg-cyan-500 text-white rounded-full p-3 transition-all duration-300 flex items-center gap-2 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
            </a>
          </div>

          {/* Navigation Hint */}
          <div className="absolute bottom-6 text-gray-400 text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>Click anywhere to close</span>
          </div>
        </div>
      )}

      {/* Loading Progress (optional) */}
      {Object.keys(loadedImages).length < filteredImages.length && (
        <div className="mt-8 text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-neonBlue border-t-transparent rounded-full animate-spin" />
            <span>
              Loading images... ({Object.keys(loadedImages).length}/{filteredImages.length})
            </span>
          </div>
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-gradient-to-r from-neonBlue to-cyan-500 transition-all duration-300"
              style={{ 
                width: `${(Object.keys(loadedImages).length / filteredImages.length) * 100}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Performance Tips 
      <div className="mt-12 text-gray-400 text-sm max-w-2xl">
        <div className="bg-gray-800/30 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Gallery Optimization Tips:</h3>
          <ul className="text-left list-disc pl-5 space-y-1">
            <li>Images are lazy-loaded (load as you scroll)</li>
            <li>Blur effect during loading for better UX</li>
            <li>Thumbnails for faster initial display</li>
            <li>Click to view full resolution images</li>
          </ul>
        </div>
      </div> */}
    </section>
  );
}