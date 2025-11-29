import { useState } from "react";
import { motion } from "framer-motion";

const songsData = [
  { id: 1, title: "Nishakubali", genre: "Love", src: "https://drive.google.com/file/d/1Ax5EWDMqoIQzvVd9iQZ7n5dOEz7ZIgD0/view?usp=drivesdk" },
  { id: 2, title: "Tamu", genre: "Romantic", src: "https://drive.google.com/file/d/1ArezBHijed1knolsO511Jzn9pzEzXlXS/view?usp=drivesdk" },
  { id: 3, title: "Lini", genre: "Chill", src: "https://drive.google.com/file/d/18dZqmC3yg0KfulDFEKE0ByEzXP7w8YFl/view?usp=drivesdk" },
  { id: 4, title: "Winner", genre: "Love", src:"https://drive.google.com/file/d/1U7AllogZPETy8KbvSGEIF7AtaEOI8rac/view?usp=drivesdk" },
  { id: 5, title: "Ndienda", genre: "Love", src: 
    "https://drive.google.com/file/d/1HZ-UKPAg1sHB0aQywyaYz3ADDpgsSE82/view?usp=drivesdk" },
  { id: 6, title: "Ngethe-sya-ukamba", genre: "Romantic", src: "https://drive.google.com/file/d/1IpHVVdaNM6zggGxWYNRe39-NlnBIvg-L/view?usp=drivesdk" },
  { id: 7, title: "Mwienda-ata", genre: "Chill", src: "https://drive.google.com/file/d/1lbCB1YDrN7N_qgRcMLE7GivLWTZx6S-4/view?usp=drivesdk" },
  { id: 8, title: "Mama", genre: "Love", src: "https://drive.google.com/file/d/1lbCB1YDrN7N_qgRcMLE7GivLWTZx6S-4/view?usp=drivesdk" },
  { id: 9, title: "lana", genre: "Love", src: "https://drive.google.com/file/d/1V7vj0vgx42shEE6_7b_QqDGJEB9oNirk/view?usp=drivesdk" },
];

export default function Music() {
  const [filter, setFilter] = useState("All");
  const [currentSong, setCurrentSong] = useState(null);
  const genres = ["All", ...new Set(songsData.map(s => s.genre))];
  const filteredSongs = filter === "All" ? songsData : songsData.filter(s => s.genre === filter);

  const handlePlay = (song) => setCurrentSong(song.id);

  return (
    <section id="music" className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
      <h2 className="text-4xl font-bold mb-6 neon-text">Music</h2>
      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6 flex-wrap justify-center">
        {genres.map(g => (
          <button key={g} onClick={() => setFilter(g)} className={`px-4 py-2 rounded-lg font-semibold neon-button ${filter===g?"bg-neonBlue text-darkBg":"bg-gray-800 text-gray-400 hover:bg-neonBlue hover:text-darkBg transition"}`}>{g}</button>
        ))}
      </div>
      {/* Songs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSongs.map(song => (
          <motion.div key={song.id} whileHover={{ scale: 1.05 }} className={`bg-gray-800 p-4 rounded-lg shadow neon-button ${currentSong===song.id?"border-2 border-neonBlue":""}`}>
            <h3 className="font-semibold text-lg mb-2">{song.title}</h3>
            <p className="text-gray-400">{song.genre}</p>
            <audio controls onPlay={() => handlePlay(song)} className="w-full mt-2">
              <source src={song.src} type="audio/mpeg"/>
            </audio>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
