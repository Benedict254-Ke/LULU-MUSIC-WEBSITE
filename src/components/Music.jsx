import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// Replace these with your actual Vercel Blob URLs
const songsData = [
  { 
    id: 1,
    title: "Nishakubali",
    genre: "Love",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/Kubali_by_Lulu_B_ft_Starkid_Boy%2848k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 180 // Add estimated duration as fallback
  },
  { 
    id: 2, 
    title: "Tamu", 
    genre: "Romantic",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/TAMU_BY_CHARLIGRAM_FT_LULU_B_254%28128k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 210
  },
  { 
    id: 3, 
    title: "Lini", 
    genre: "Chill",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/LINI____BON_STARKID___OFFICIAL_4K_VIDEO____sms_SKIZA_6987311_to_811_for_SKIZA%2848k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 195
  },
  { 
    id: 4, 
    title: "Winner", 
    genre: "Love",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/BON_STARKID_-_WINNER__VISUALIZER__%5BTill_No._6337622_for_support%5D%2848k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 220
  },
  { 
    id: 5, 
    title: "Ndienda", 
    genre: "Love",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/BON_STARKID_-_NDIENDA__OFFICIAL_MUSIC_VIDEO__sms_skiza_69811166_to_811_for_skiza%2848k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 190
  },
  { 
    id: 6, 
    title: "Ngethe-sya-ukamba", 
    genre: "Romantic",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/BON_STARKID_-_NGETHE_SYA_UKAMBA__OFFICIAL_4K_VIDEO__sms_SKIZA_6987316_to_811_for_SKIZA%2848k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 240
  },
  { 
    id: 7, 
    title: "Mwienda-ata", 
    genre: "Chill",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/BON_STARKID_-_MWIENDA_ATA__OFFICIAL_MUSIC_VIDEO__sms_skiza_6988662_to_811_for_skiza%2848k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 200
  },
  { 
    id: 8, 
    title: "Mama", 
    genre: "Love",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/BON_STARKID_-_MAMA__OFFICIAL_AUDIO__%5BTill_No._6337622_for_support%5D%2848k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 185
  },
  { 
    id: 9, 
    title: "Lana", 
    genre: "Love",
    src: "https://filgrahgu8utdfxa.public.blob.vercel-storage.com/BON_STARKID_-_LANA__OFFICIAL_MUSIC_VIDEO__sms_skiza_69811565_to_811_for_skiza%2848k%29.mp3",
    format: "audio/mpeg",
    estimatedDuration: 210
  },
];

export default function Music() {
  const [filter, setFilter] = useState("All");
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDurations, setAudioDurations] = useState({});
  const [audioLoaded, setAudioLoaded] = useState({});
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackError, setPlaybackError] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const genres = ["All", ...new Set(songsData.map(s => s.genre))];
  const filteredSongs = filter === "All"
    ? songsData
    : songsData.filter(s => s.genre === filter);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isNaN(audio.duration)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setIsPlaying(false);
      setPlaybackError("Audio playback error. The file may be corrupted or inaccessible.");
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const handlePlay = useCallback(async (song) => {
    setPlaybackError(null);
    
    if (currentSong === song.id && audioRef.current) {
      // Toggle play/pause for current song
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Play failed:", error);
          setPlaybackError("Failed to play audio. Please try again.");
        }
      }
    } else {
      // Play new song
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      setIsLoadingAudio(true);
      setCurrentSong(song.id);
      
      try {
        // Set the audio source
        audioRef.current.src = song.src;
        audioRef.current.load();
        
        // Try to play
        await audioRef.current.play();
        setIsPlaying(true);
        
        // If play succeeds, try to get duration
        if (audioRef.current.duration && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
          setAudioDurations(prev => ({
            ...prev,
            [song.id]: audioRef.current.duration
          }));
        } else {
          // Use estimated duration if real duration not available
          setAudioDurations(prev => ({
            ...prev,
            [song.id]: song.estimatedDuration
          }));
        }
        
        setAudioLoaded(prev => ({
          ...prev,
          [song.id]: true
        }));
      } catch (error) {
        console.error("Play failed:", error);
        setPlaybackError("Failed to play audio. The file may be inaccessible.");
        
        // Still mark as loaded with estimated duration
        setAudioDurations(prev => ({
          ...prev,
          [song.id]: song.estimatedDuration
        }));
        
        setAudioLoaded(prev => ({
          ...prev,
          [song.id]: true
        }));
      } finally {
        setIsLoadingAudio(false);
      }
    }
  }, [currentSong, isPlaying]);

  const handleSeek = useCallback((e, duration) => {
    if (audioRef.current && currentSong && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const seekTime = (x / width) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  }, [currentSong]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-mark all songs as loaded after a delay (fallback for CORS issues)
  useEffect(() => {
    const timer = setTimeout(() => {
      const loaded = {};
      const durations = {};
      
      songsData.forEach(song => {
        loaded[song.id] = true;
        durations[song.id] = song.estimatedDuration;
      });
      
      setAudioLoaded(loaded);
      setAudioDurations(durations);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="music"
      className="min-h-screen flex flex-col items-center px-4 py-12 text-center bg-gradient-to-b from-gray-900 to-black"
    >
      <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-purple-500">
        Lulu B - Music
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        {genres.map(g => (
          <motion.button
            key={g}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(g)}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
              filter === g
                ? "bg-gradient-to-r from-neonBlue to-cyan-500 text-white shadow-lg shadow-neonBlue/30"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {g}
          </motion.button>
        ))}
      </div>

      {/* Error Message */}
      {playbackError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 max-w-2xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{playbackError}</span>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoadingAudio && (
        <div className="mb-6 p-4 bg-neonBlue/20 border border-neonBlue/50 rounded-lg text-neonBlue max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Loading audio...</span>
          </div>
        </div>
      )}

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {filteredSongs.map(song => {
          const isCurrent = currentSong === song.id;
          const duration = audioDurations[song.id] || song.estimatedDuration || 0;
          const isLoaded = audioLoaded[song.id];
          
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm 
                p-6 rounded-2xl shadow-xl border-2 ${
                isCurrent && isPlaying
                  ? "border-neonBlue shadow-neonBlue/30"
                  : "border-gray-700/50"
              }`}
            >
              {/* Song Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">{song.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-gradient-to-r from-neonBlue/20 to-purple-500/20 text-neonBlue">
                      {song.genre}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      MP3
                    </span>
                  </div>
                </div>
                
                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlay(song)}
                  disabled={!isLoaded || isLoadingAudio}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isCurrent && isPlaying
                      ? "bg-gradient-to-r from-red-500 to-pink-600"
                      : isLoadingAudio
                      ? "bg-gradient-to-r from-gray-700 to-gray-600 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-neonBlue to-cyan-500"
                  }`}
                >
                  {isLoadingAudio && currentSong === song.id ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isCurrent && isPlaying ? (
                    <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </motion.button>
              </div>

              {/* Progress Bar (only for current playing song) */}
              {isCurrent && duration > 0 && (
                <div className="mb-4">
                  <div 
                    className="h-1.5 bg-gray-700 rounded-full overflow-hidden cursor-pointer mb-2"
                    onClick={(e) => handleSeek(e, duration)}
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-neonBlue to-cyan-500 transition-all duration-300"
                      style={{ 
                        width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* Duration Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span>
                      {formatTime(duration)}
                      {duration === song.estimatedDuration && " (estimated)"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                    <span>MPEG</span>
                  </div>
                </div>
              </div>

              {/* Audio Visualization - Only show when playing */}
              {isCurrent && isPlaying && duration > 0 && (
                <div className="mb-6">
                  <div className="flex items-end justify-between h-8">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [
                            `${20 + Math.random() * 80}%`,
                            `${20 + Math.random() * 80}%`,
                            `${20 + Math.random() * 80}%`
                          ],
                        }}
                        transition={{ 
                          duration: 0.5, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="w-1.5 bg-gradient-to-t from-neonBlue to-cyan-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <a
                  href={song.src}
                  download={`${song.title}.mp3`}
                  className="flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download MP3
                </a>
                
                {isCurrent && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 accent-neonBlue"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Now Playing Bar */}
      {currentSong && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/95 to-black/95 border-t border-gray-800/50 backdrop-blur-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-neonBlue to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                {isPlaying && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">
                  {songsData.find(s => s.id === currentSong)?.title}
                </h4>
                <p className="text-neonBlue text-sm">
                  {songsData.find(s => s.id === currentSong)?.genre}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2 flex-1 max-w-2xl mx-8">
              {/* Progress Bar */}
              {audioDurations[currentSong] > 0 && (
                <>
                  <div 
                    className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => handleSeek(e, audioDurations[currentSong])}
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-neonBlue to-cyan-500 transition-all duration-300"
                      style={{ 
                        width: audioDurations[currentSong] > 0 
                          ? `${(currentTime / audioDurations[currentSong]) * 100}%` 
                          : "0%" 
                      }}
                    />
                  </div>
                  <div className="flex justify-between w-full text-sm text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(audioDurations[currentSong])}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handlePlay(songsData.find(s => s.id === currentSong))}
                className="p-3 rounded-full bg-gradient-to-r from-neonBlue to-cyan-500 hover:opacity-90 transition-opacity duration-300"
                disabled={isLoadingAudio}
              >
                {isPlaying ? (
                  <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* CORS Warning 
      <div className="mt-12 text-yellow-400 text-sm max-w-3xl">
        <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <div className="text-left">
              <h3 className="font-semibold text-white mb-1">CORS Notice</h3>
              <p className="mb-2">Your audio files have CORS restrictions. Estimated durations are shown.</p>
              <p className="text-xs opacity-80">To fix this, configure CORS headers on your Vercel Blob storage or use a CORS proxy.</p>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
}