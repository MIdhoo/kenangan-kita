import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, Music, Calendar, Camera, Clock, Play, Pause, SkipBack, SkipForward,
  Star, MessageCircle, VolumeX, Settings, X, Save, Plus, Trash2, Upload,
  Image as ImageIcon, ArrowDown, RefreshCw, Sparkles, Gift, Flower, Lock, Download, UploadCloud, ShieldCheck, Loader2
} from 'lucide-react';
import { get, set, del } from 'idb-keyval';

// --- DATA BAWAAN (DEFAULT) ---
const DEFAULT_DATA = {
  containerId: "kenangan-v1", // Unique ID for validation
  passcode: "", // 4-digit PIN
  name1: "Aku",
  name2: "Kamu",
  dateLabel: "Together", // Default time label
  startDate: "2023-02-14",
  // Video Latar Belakang (Ethereal Night Sky)
  backgroundVideo: "https://assets.mixkit.co/videos/preview/mixkit-night-sky-with-stars-time-lapse-1613-large.mp4",
  storyVideo: "https://static.videezy.com/system/resources/previews/000/038/761/original/abstract_bokeh_light_leaks_overlay.mp4",
  heroImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1080&auto=format&fit=crop", // Romantic Silhouette in Light
  music: {
    title: "Forever with You",
    artist: "Romantic Piano",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop", // Music Note/Piano
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Chapter_One_-_Cold/Kai_Engel_-_05_-_Daemmerung.mp3"
  },
  timeline: [
    {
      date: "10 Februari 2023",
      title: "Pertama Bertemu",
      description: "Di kedai kopi kecil itu, aku melihat senyummu untuk pertama kalinya.",
      image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=500&auto=format&fit=crop",
      iconType: "Calendar"
    },
    {
      date: "14 Februari 2023",
      title: "Jadian",
      description: "Hari terbaik dalam hidupku.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=500&auto=format&fit=crop",
      iconType: "Heart"
    }
  ],
  stories: [
    {
      id: 1,
      title: "Awal Pertemuan",
      text: "Semua bermula dari sapaan sederhana yang tak terduga. Siapa sangka, detik itu menjadi awal dari selamanya.",
      image: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=1920&auto=format&fit=crop",
      color: "from-blue-400 to-purple-500"
    },
    {
      id: 2,
      title: "Tawamu",
      text: "Suara tawamu adalah musik favoritku. Di saat itulah aku sadar, aku ingin mendengarnya setiap hari.",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1920&auto=format&fit=crop",
      color: "from-pink-400 to-rose-500"
    },
    {
      id: 3,
      title: "Janji Kita",
      text: "Di bawah langit yang sama kita berjanji, untuk saling menjaga, mengisi, dan mencintai. Selamanya.",
      image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1920&auto=format&fit=crop",
      color: "from-amber-200 to-yellow-500"
    }
  ],
  reasons: [
    { title: "Senyummu", desc: "Seindah bunga yang mekar di musim semi." },
    { title: "Sabar", desc: "Hatimua selembut kelopak sakura." },
    { title: "Suaramu", desc: "Musik favoritku sebelum tidur." },
    { title: "Dukungan", desc: "Akar kuat yang menopangku tumbuh." },
    { title: "Hangat", desc: "Pelukanmu seperti matahari pagi." },
    { title: "Tawamu", desc: "Dunia rasanya lebih cerah saat kamu tertawa." }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621112904887-41337075f582?q=80&w=500&auto=format&fit=crop"
  ],
  letter: {
    title: "Untuk Bunga Terindah",
    content: "Hai sayang, layaknya sakura yang mekar setahun sekali, cintaku padamu selalu bersemi setiap hari. Terima kasih sudah mewarnai hidupku dengan warna-warna indah. I Love You, Forever."
  }
};

// --- KOMPONEN ANIMASI 3D SCROLL ---
const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${isVisible
        ? 'opacity-100 translate-y-0 scale-100 blur-0'
        : 'opacity-0 translate-y-12 scale-95 blur-sm'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};


// --- KOMPONEN CINEMATIC REVEAL (UNTUK STORY) ---
const CinematicReveal = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1500ms] ease-out transform ${isVisible
        ? 'opacity-100 translate-y-0 scale-100 blur-0'
        : 'opacity-0 translate-y-20 scale-90 blur-xl' // Efek keluar lebih dramatis
        }`}
    >
      {children}
    </div>
  );
};

// --- KOMPONEN LOCK SCREEN ---
const LockScreen = ({ passcode, onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleInput = (char) => {
    if (input.length < 4) {
      const newInput = input + char;
      setInput(newInput);
      setError(false);
      if (newInput.length === 4) {
        if (newInput === passcode) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => setInput(''), 400);
        }
      }
    }
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#2a1b2e] flex flex-col items-center justify-center text-white">
      <div className="mb-8 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-pink-600/20 rounded-full flex items-center justify-center mb-4 text-pink-400">
          <Lock size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2 font-serif">Akses Terkunci</h2>
        <p className="text-pink-200/60 text-sm">Masukkan PIN untuk membuka kenangan.</p>
      </div>

      {/* PIN Dots */}
      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border border-pink-500/50 transition-all duration-200 ${i < input.length ? 'bg-pink-500 scale-110' : 'bg-transparent'} ${error ? 'animate-shake border-red-500 bg-red-500' : ''}`}></div>
        ))}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} onClick={() => handleInput(num.toString())} className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-2xl font-medium transition-all active:scale-95">{num}</button>
        ))}
        <div className="w-16 h-16"></div>
        <button onClick={() => handleInput('0')} className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-2xl font-medium transition-all active:scale-95">0</button>
        <button onClick={handleBackspace} className="w-16 h-16 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"><SkipBack size={24} /></button>
      </div>

      <style>{`
         @keyframes shake {
           0%, 100% { transform: translateX(0); }
           25% { transform: translateX(-5px); }
           75% { transform: translateX(5px); }
         }
         .animate-shake { animation: shake 0.3s ease-in-out; }
       `}</style>
    </div>
  );
};

// --- KOMPONEN LATAR BELAKANG DINAMIS (SAKURA EDITION) ---
// --- KOMPONEN LATAR BELAKANG DINAMIS (SAKURA EDITION) ---
const DynamicBackground = ({ videoUrl, storyVideoUrl, showStoryVideo }) => {
  return (
    <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden bg-[#2a1b2e]">
      {/* 1. Video Layer (Hero) - Selalu ada, tapi opacity berubah */}
      <video
        key={videoUrl}
        autoPlay loop muted playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${showStoryVideo ? 'opacity-0' : 'opacity-80'}`}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* 1.5. Video Layer (Story) - Muncul saat masuk story */}
      {storyVideoUrl && (
        <video
          key={storyVideoUrl}
          autoPlay loop muted playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${showStoryVideo ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={storyVideoUrl} type="video/mp4" />
        </video>
      )}

      {/* 2. Gradient Overlay (Sakura Night Theme: Deep Purple/Black) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-900/20 to-black/80"></div>

      {/* 3. Texture Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* 4. Falling Petals (Kelopak Sakura Jatuh) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute top-[-10%] animate-falling-petal text-pink-300/70"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              fontSize: `${12 + Math.random() * 15}px`,
              filter: 'blur(0.5px)'
            }}
          >
            {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '💮' : '🌺'}
          </div>
        ))}
      </div>

      {/* 5. Vignette untuk Fokus Tengah */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
    </div>
  );
};

// --- KOMPONEN KECIL ---

const TimeCounter = ({ startDate, label, compact = false }) => {
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const start = new Date(startDate).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - start;
      if (distance < 0) return;
      setTimeElapsed({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        {Object.entries(timeElapsed).map(([lbl, value]) => (
          <div key={lbl} className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-pink-200 font-mono leading-none drop-shadow-sm">{value}</span>
            <span className="text-[9px] sm:text-[10px] text-pink-300 uppercase tracking-widest">{lbl}</span>
          </div>
        ))}
        <div className="h-8 w-[1px] bg-white/20 mx-2 hidden sm:block"></div>
        <div className="flex items-center gap-2 text-pink-200 text-xs font-medium bg-white/5 px-3 py-1 rounded-full border border-pink-500/20 backdrop-blur-sm">
          <Heart size={14} className="fill-pink-500 text-pink-500 animate-pulse" />
          <span className="tracking-wide uppercase text-[10px]">{label || "Together"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 py-8">
      {Object.entries(timeElapsed).map(([lbl, value], i) => (
        <RevealOnScroll delay={i * 100} key={lbl}>
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-xl rounded-2xl p-4 w-20 sm:w-24 border border-pink-200/20 shadow-[0_8px_32px_0_rgba(255,192,203,0.15)] hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 group">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono drop-shadow-md group-hover:text-pink-200">{value}</span>
            <span className="text-[10px] sm:text-xs text-pink-200 uppercase tracking-widest mt-2">{lbl}</span>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
};

const MusicPlayer = ({ music, compact = false, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Autoplay failed", e);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, music.url]);

  // Reset progress when music changes
  useEffect(() => {
    setProgress(0);
    if (music.url && !isPlaying) {
      setIsPlaying(true); // Auto-play new track if uploaded
    }
  }, [music.url]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 pr-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:bg-black/50 transition-all duration-500 hover:border-pink-500/30 group">
        <audio
          ref={audioRef}
          src={music.url}
          loop
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
        {/* Vinyl Cover Art */}
        <div className={`relative w-12 h-12 flex-shrink-0 rounded-full border-2 border-white/10 overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }}>
          <img
            src={music.cover}
            alt="Album Art"
            className="w-full h-full object-cover"
          />
          {/* Vinyl Center Hole */}
          <div className="absolute inset-0 m-auto w-3 h-3 bg-black/80 rounded-full border border-white/20"></div>

          {/* Play/Pause Overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
        </div>

        {/* Info & Visualizer */}
        <div className="flex flex-col min-w-[100px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-white text-xs font-bold tracking-wide truncate max-w-[120px]">{music.title}</span>
            {/* Animated Music Bars (Visualizer) */}
            {isPlaying && (
              <div className="flex items-end gap-[2px] h-3">
                <div className="w-1 bg-pink-500 rounded-t-sm animate-music-bar-1"></div>
                <div className="w-1 bg-pink-400 rounded-t-sm animate-music-bar-2"></div>
                <div className="w-1 bg-pink-300 rounded-t-sm animate-music-bar-3"></div>
              </div>
            )}
          </div>
          <span className="text-white/50 text-[10px] uppercase tracking-wider truncate">{music.artist}</span>

          {/* Sleek Progress Line */}
          <div className="w-full bg-white/10 rounded-full h-[2px] mt-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RevealOnScroll delay={500}>
      <div className="bg-white/5 backdrop-blur-xl rounded-full border border-pink-200/20 pr-2 pl-2 py-2 flex items-center gap-4 max-w-sm mx-auto shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 hover:scale-105">

        <audio
          ref={audioRef}
          src={music.url}
          loop
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="relative shrink-0">
          <img
            src={music.cover}
            alt="Album Art"
            className={`w-14 h-14 rounded-full object-cover border-2 border-white/20 ${isPlaying ? 'animate-spin-slow' : ''}`}
            style={{ animationDuration: '8s' }}
          />
          {isPlaying && <div className="absolute inset-0 rounded-full border-2 border-pink-400 animate-ping opacity-40"></div>}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center pr-2">
          <h3 className="text-white font-bold truncate text-sm">{music.title}</h3>
          <p className="text-pink-200/70 text-xs truncate mb-2">{music.artist}</p>
          {/* Progress Bar Mini */}
          <div className="w-full bg-white/10 rounded-full h-1 cursor-pointer overflow-hidden">
            <div className="bg-pink-400 h-full rounded-full relative transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-white text-rose-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform shrink-0"
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
        </button>
      </div>
    </RevealOnScroll>
  );
};

// --- KOMPONEN SETTINGS MODAL ---
const SettingsModal = ({ isOpen, onClose, data, onUpdate }) => {
  const [formData, setFormData] = useState(data);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { setFormData(data); }, [data]);

  if (!isOpen) return null;

  const handleChange = (e, section, field) => {
    if (section) {
      setFormData({ ...formData, [section]: { ...formData[section], [field]: e.target.value } });
    } else {
      const key = field || e.target.name;
      setFormData({ ...formData, [key]: e.target.value });
    }
  };

  const handleArrayChange = (index, value, arrayName, field = null) => {
    const newArray = [...formData[arrayName]];
    if (field) {
      newArray[index] = { ...newArray[index], [field]: value };
    } else {
      newArray[index] = value;
    }
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName, initialValue) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], initialValue] });
  };

  const removeArrayItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleFileUpload = (e, callback, maxSizeOverride = null) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate Image Format (No HEIC)
    if (file.type && file.type.startsWith('image/')) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert("Format file tidak didukung browser (seperti HEIC/HEIF). Mohon gunakan JPG, PNG, atau WEBP.");
        return;
      }
    }

    // Default limit 25MB for all images (Timeline, Gallery, etc.), override for specific needs
    const limit = maxSizeOverride || 25 * 1024 * 1024;

    if (file.size > limit) {
      const mb = limit / (1024 * 1024);
      alert(`Ukuran file terlalu besar! Maksimal ${mb.toFixed(1)}MB agar penyimpanan tidak penuh.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // --- BACKUP & RESTORE ---
  const handleExport = () => {
    const dataStr = JSON.stringify(formData);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `kenangan_kita_backup_${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.containerId === DEFAULT_DATA.containerId || importedData.name1) {
          setFormData(importedData);
          alert("Data berhasil dipulihkan! Jangan lupa klik Simpan.");
        } else {
          alert("Format file tidak valid.");
        }
      } catch (error) {
        alert("Gagal membaca file backup.");
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  const tabs = [
    { id: 'general', icon: Heart, label: 'Umum' },
    { id: 'media', icon: ImageIcon, label: 'Media' },
    { id: 'music', icon: Music, label: 'Musik' },
    { id: 'timeline', icon: Calendar, label: 'Jejak' },
    { id: 'gallery', icon: Camera, label: 'Galeri' },
    { id: 'reasons', icon: Star, label: 'Reasons' },
    { id: 'letter', icon: MessageCircle, label: 'Surat' },
    { id: 'security', icon: ShieldCheck, label: 'Keamanan' }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#2a1b2e] w-full max-w-4xl h-[85vh] rounded-2xl border border-pink-500/20 shadow-2xl flex overflow-hidden flex-col md:flex-row text-gray-100">

        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-black/20 border-b md:border-b-0 md:border-r border-white/10 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0">
          <div className="hidden md:flex items-center gap-2 mb-6 px-4 text-pink-400 font-bold text-xl">
            <Settings className="animate-spin-slow" /> Pengaturan
          </div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#2a1b2e]">
          <div className="flex justify-between items-center p-6 border-b border-white/10 md:hidden">
            <h2 className="text-xl font-bold text-pink-400">Pengaturan</h2>
            <button onClick={onClose}><X className="text-gray-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

            {/* --- TAB: GENERAL --- */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Heart size={20} className="text-pink-500" /> Informasi Dasar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nama Kamu (Pria)</label>
                    <input type="text" value={formData.name1} onChange={(e) => handleChange(e, null, 'name1')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nama Pasangan (Wanita)</label>
                    <input type="text" value={formData.name2} onChange={(e) => handleChange(e, null, 'name2')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Tanggal Jadian</label>
                    <input type="date" value={formData.startDate} onChange={(e) => handleChange(e, null, 'startDate')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none transition-colors text-white scheme-dark" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Label Waktu (Contoh: Together / Loving You)</label>
                    <input type="text" value={formData.dateLabel || ''} onChange={(e) => handleChange(e, null, 'dateLabel')} placeholder="Together" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB: MEDIA --- */}
            {activeTab === 'media' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><ImageIcon size={20} className="text-green-400" /> Media Latar</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">URL Video Background</label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.backgroundVideo} onChange={(e) => handleChange(e, null, 'backgroundVideo')} className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none transition-colors" placeholder="URL Video..." />
                    <label className="cursor-pointer bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white p-3 rounded-lg transition-all border border-pink-500/20 flex items-center justify-center" title="Upload Video (Max 50MB)">
                      <Upload size={20} />
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setFormData({ ...formData, backgroundVideo: base64 }), 50 * 1024 * 1024)} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Dukung URL atau Upload File .mp4 (Maks 50MB untuk performa lancar).</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Hero Image (Foto Utama)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={formData.heroImage?.startsWith('data:') ? "(Gambar Terupload)" : formData.heroImage}
                        onChange={(e) => !formData.heroImage?.startsWith('data:') && handleChange(e, null, 'heroImage')}
                        className={`w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none transition-colors ${formData.heroImage?.startsWith('data:') ? 'text-green-400 italic cursor-not-allowed opacity-80' : ''}`}
                        placeholder="URL Gambar..."
                        disabled={formData.heroImage?.startsWith('data:')}
                      />
                      {formData.heroImage?.startsWith('data:') && (
                        <button onClick={() => handleChange({ target: { value: '' } }, null, 'heroImage')} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 bg-black/50 rounded-full p-1" title="Hapus Gambar"><X size={14} /></button>
                      )}
                    </div>
                    <label className="cursor-pointer bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white p-3 rounded-lg transition-all border border-pink-500/20 flex items-center justify-center">
                      <Upload size={20} />
                      <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setFormData({ ...formData, heroImage: base64 }))} />
                    </label>
                  </div>
                  {formData.heroImage && <img src={formData.heroImage} alt="Preview" className="h-32 w-full object-cover rounded-lg border border-white/10 mt-3" />}
                </div>
              </div>
            )}

            {/* --- TAB: MUSIC --- */}
            {activeTab === 'music' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Music size={20} className="text-blue-400" /> Musik Latar</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Judul Lagu</label>
                    <input type="text" value={formData.music.title} onChange={(e) => handleChange(e, 'music', 'title')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nama Artis</label>
                    <input type="text" value={formData.music.artist} onChange={(e) => handleChange(e, 'music', 'artist')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none" />
                  </div>

                  {/* Audio URL / Upload */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">File Lagu / URL</label>
                    <div className="flex gap-2">
                      <input type="text" value={formData.music.url || ''} onChange={(e) => handleChange(e, 'music', 'url')} className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none" placeholder="URL Audio..." />
                      <label className="cursor-pointer bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white p-3 rounded-lg transition-all border border-pink-500/20 flex items-center justify-center pointer-events-auto" title="Upload MP3 (Max 20MB)">
                        <Upload size={20} />
                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setFormData({ ...formData, music: { ...formData.music, url: base64 } }), 20 * 1024 * 1024)} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Dukung format .mp3. Upload maks 20MB untuk performa terbaik.</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Cover Album</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={formData.music.cover?.startsWith('data:') ? "(Gambar Terupload)" : formData.music.cover}
                          onChange={(e) => !formData.music.cover?.startsWith('data:') && handleChange(e, 'music', 'cover')}
                          className={`w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none ${formData.music.cover?.startsWith('data:') ? 'text-green-400 italic cursor-not-allowed opacity-80' : ''}`}
                          placeholder="URL Cover..."
                          disabled={formData.music.cover?.startsWith('data:')}
                        />
                        {formData.music.cover?.startsWith('data:') && (
                          <button onClick={() => handleChange({ target: { value: '' } }, 'music', 'cover')} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 bg-black/50 rounded-full p-1" title="Hapus Gambar"><X size={14} /></button>
                        )}
                      </div>
                      <label className="cursor-pointer bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white p-3 rounded-lg transition-all border border-pink-500/20 flex items-center justify-center">
                        <Upload size={20} />
                        <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setFormData({ ...formData, music: { ...formData.music, cover: base64 } }))} />
                      </label>
                    </div>
                    {formData.music.cover && <img src={formData.music.cover} alt="Cover" className="w-16 h-16 rounded mt-4 object-cover border border-white/10" />}
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB: GALLERY --- */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Camera size={20} className="text-purple-400" /> Galeri Foto</h3>
                  <button onClick={() => addArrayItem('gallery', '')} className="flex items-center gap-1 bg-pink-600/20 text-pink-400 px-3 py-1.5 rounded-full text-sm hover:bg-pink-600 hover:text-white transition-all"><Plus size={14} /> Tambah Foto</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {formData.gallery.map((url, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-black/20 p-3 rounded-lg border border-white/5 group">
                      <span className="text-gray-500 font-mono text-sm w-6 text-center">{idx + 1}</span>
                      <img src={url || 'https://via.placeholder.com/150'} alt="Preview" className="w-12 h-12 rounded object-cover bg-white/5 shrink-0" />
                      <div className="flex-1 flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={url?.startsWith('data:') ? "(Gambar Terupload)" : url}
                            onChange={(e) => !url?.startsWith('data:') && handleArrayChange(idx, e.target.value, 'gallery')}
                            placeholder="https://..."
                            className={`w-full bg-transparent border-none outline-none text-sm placeholder-gray-600 ${url?.startsWith('data:') ? 'text-green-400 italic cursor-not-allowed' : 'text-gray-300'}`}
                            disabled={url?.startsWith('data:')}
                          />
                          {url?.startsWith('data:') && (
                            <button onClick={() => handleArrayChange(idx, '', 'gallery')} className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 p-1"><X size={14} /></button>
                          )}
                        </div>
                        <label className="cursor-pointer text-gray-400 hover:text-pink-400 p-1">
                          <Upload size={16} />
                          <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => handleArrayChange(idx, base64, 'gallery'))} />
                        </label>
                      </div>
                      <button onClick={() => removeArrayItem(idx, 'gallery')} className="p-2 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB: TIMELINE --- */}
            {activeTab === 'timeline' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Calendar size={20} className="text-orange-400" /> Jejak Cinta (Timeline)</h3>
                  <button onClick={() => addArrayItem('timeline', { date: '2023-01-01', title: 'Kenangan Baru', description: 'Deskripsi...', image: '' })} className="flex items-center gap-1 bg-pink-600/20 text-pink-400 px-3 py-1.5 rounded-full text-sm hover:bg-pink-600 hover:text-white transition-all"><Plus size={14} /> Tambah</button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {formData.timeline.map((item, idx) => (
                    <div key={idx} className="bg-black/20 p-5 rounded-xl border border-white/5 relative group hover:border-pink-500/30 transition-colors">
                      <button onClick={() => removeArrayItem(idx, 'timeline')} className="absolute top-3 right-3 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"><Trash2 size={16} /></button>

                      <div className="flex gap-4 flex-col md:flex-row">
                        {/* Image Upload */}
                        <div className="shrink-0">
                          <div className="w-full md:w-32 h-32 bg-white/5 rounded-lg border border-white/10 overflow-hidden relative group/img">
                            {item.image ? (
                              <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-600"><ImageIcon size={24} /></div>
                            )}
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                              <Upload size={20} className="text-white" />
                              <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => handleArrayChange(idx, base64, 'timeline', 'image'))} />
                            </label>
                          </div>
                        </div>

                        {/* Text Inputs */}
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500">Tanggal</label>
                              <input type="text" value={item.date} onChange={(e) => handleArrayChange(idx, e.target.value, 'timeline', 'date')} className="w-full bg-transparent border-b border-white/10 focus:border-pink-500 outline-none pb-1 text-sm text-gray-200" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Judul</label>
                              <input type="text" value={item.title} onChange={(e) => handleArrayChange(idx, e.target.value, 'timeline', 'title')} className="w-full bg-transparent border-b border-white/10 focus:border-pink-500 outline-none pb-1 font-bold text-gray-200" />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Deskripsi</label>
                            <textarea value={item.description} onChange={(e) => handleArrayChange(idx, e.target.value, 'timeline', 'description')} className="w-full bg-transparent border-b border-white/10 focus:border-pink-500 outline-none pb-1 text-sm text-gray-400 min-h-[50px] resize-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB: REASONS --- */}
            {activeTab === 'reasons' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Star size={20} className="text-yellow-400" /> Alasan (Why You)</h3>
                  <button onClick={() => addArrayItem('reasons', { title: 'Hal Baru', desc: 'Deskripsi singkat...' })} className="flex items-center gap-1 bg-pink-600/20 text-pink-400 px-3 py-1.5 rounded-full text-sm hover:bg-pink-600 hover:text-white transition-all"><Plus size={14} /> Tambah</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.reasons.map((reason, idx) => (
                    <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 relative group hover:border-pink-500/30 transition-colors">
                      <button onClick={() => removeArrayItem(idx, 'reasons')} className="absolute top-2 right-2 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500">Judul</label>
                          <input
                            type="text"
                            value={reason.title}
                            onChange={(e) => handleArrayChange(idx, e.target.value, 'reasons', 'title')}
                            className="w-full bg-transparent border-b border-white/10 focus:border-pink-500 outline-none pb-1 font-bold text-gray-200"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Deskripsi</label>
                          <textarea
                            value={reason.desc}
                            onChange={(e) => handleArrayChange(idx, e.target.value, 'reasons', 'desc')}
                            className="w-full bg-transparent border-b border-white/10 focus:border-pink-500 outline-none pb-1 text-sm text-gray-400 min-h-[40px] resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB: LETTER --- */}
            {activeTab === 'letter' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><MessageCircle size={20} className="text-indigo-400" /> Surat Cinta</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Judul Surat</label>
                    <input type="text" value={formData.letter.title} onChange={(e) => handleChange(e, 'letter', 'title')} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-pink-500 outline-none font-serif text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Isi Surat</label>
                    <textarea
                      value={formData.letter.content}
                      onChange={(e) => handleChange(e, 'letter', 'content')}
                      className="w-full h-64 bg-black/20 border border-white/10 rounded-lg p-4 focus:border-pink-500 outline-none font-serif leading-relaxed text-gray-300 resize-none selection:bg-pink-500/30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB: SECURITY --- */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-teal-400" /> Keamanan & Data</h3>

                {/* Passcode Config */}
                <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Lock size={16} /> PIN Keamanan</h4>
                  <p className="text-gray-400 text-sm mb-4">Atur 4 digit PIN agar halaman ini tidak bisa dibuka sembarangan.</p>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder={formData.passcode ? "**** (Tersimpan)" : "Belum diatur (contoh: 1234)"}
                    value={formData.passcode || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, passcode: val });
                    }}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-48 text-center text-xl tracking-widest focus:border-pink-500 outline-none transition-all"
                  />
                </div>

                {/* Backup & Restore */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col items-center text-center hover:bg-white/5 transition-all">
                    <div className="p-4 bg-blue-500/10 text-blue-400 rounded-full mb-3"><Download size={24} /></div>
                    <h4 className="font-bold text-white mb-1">Backup Data</h4>
                    <p className="text-gray-400 text-xs mb-4">Unduh semua pengaturan (termasuk foto) sebagai file backup.</p>
                    <button onClick={handleExport} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold transition-colors">Download JSON</button>
                  </div>

                  <div className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col items-center text-center hover:bg-white/5 transition-all">
                    <div className="p-4 bg-green-500/10 text-green-400 rounded-full mb-3"><UploadCloud size={24} /></div>
                    <h4 className="font-bold text-white mb-1">Restore Data</h4>
                    <p className="text-gray-400 text-xs mb-4">Pulihkan data dari file backup yang pernah kamu unduh.</p>
                    <label className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold transition-colors cursor-pointer mb-2 block">
                      Upload JSON
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>
                  </div>

                  <div className="md:col-span-2 bg-red-500/10 p-6 rounded-xl border border-red-500/20 flex flex-col items-center text-center hover:bg-red-500/20 transition-all">
                    <h4 className="font-bold text-red-400 mb-1">Reset ke Awal (Mode Pengunjung)</h4>
                    <p className="text-gray-400 text-xs mb-4">Hapus semua data edit-an di browser ini dan kembali ke tampilan awal (sesuai initial-data.json). Gunakan ini untuk melihat tampilan web "sebagai orang lain".</p>
                    <button
                      onClick={async () => {
                        if (confirm("Yakin ingin menghapus semua edit-an di browser ini? Data akan kembali ke default/awal.")) {
                          await del('kenangan_kita_data_v7');
                          window.location.reload();
                        }
                      }}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                    >
                      <RefreshCw size={16} /> Reset Data Browser
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between items-center md:justify-end gap-4">
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white font-medium transition-colors">Batal</button>
            <button onClick={handleSave} className="bg-gradient-to-r from-pink-600 to-rose-600 px-8 py-2.5 rounded-lg text-white font-bold hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-105 transition-all flex items-center gap-2">
              <Save size={18} /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeOverlay = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-1000">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>

      <div className="relative z-10 text-center px-4 animate-in fade-in zoom-in duration-1000">
        <div className="mb-6 animate-bounce">
          <Heart className="w-16 h-16 text-pink-500 fill-pink-500 mx-auto drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-wider drop-shadow-2xl">
          Sebuah Kenangan
        </h1>
        <p className="text-pink-200/80 text-lg mb-8 font-light italic">
          "Setiap detik bersamamu adalah abadi."
        </p>

        <button
          onClick={onEnter}
          className="group relative px-8 py-3 bg-white/10 backdrop-blur-md border border-pink-500/50 text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-pink-600 hover:border-pink-600 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <MessageCircle size={18} /> Buka Undangan
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <p className="mt-8 text-xs text-white/30 animate-pulse">
          Ketuk untuk membuka & memutar musik
        </p>
      </div>
    </div>
  );
};

// --- APP COMPONENT UTAMA ---

export default function App() {
  const [showLetter, setShowLetter] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLocked, setIsLocked] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for IndexedDB

  // Initialize with DEFAULT_DATA first, then load from IndexedDB
  const [data, setData] = useState(DEFAULT_DATA);

  // Load data from IndexedDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Cek Local Storage (Data pengguna yang sedang mengedit)
        const savedData = await get('kenangan_kita_data_v7');

        if (savedData) {
          if (!savedData.stories) savedData.stories = DEFAULT_DATA.stories;
          setData(savedData);
        } else {
          // 2. Jika Local Storage kosong (Pengunjung Baru/GitHub Pages), Cek initial-data.json di folder public
          try {
            const response = await fetch('./initial-data.json');
            if (response.ok) {
              const jsonData = await response.json();
              setData(jsonData);
              console.log("Loaded from initial-data.json");
            }
          } catch (jsonErr) {
            console.log("No initial-data.json found, using defaults.");
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Check lock status after data is loaded
  useEffect(() => {
    if (!loading && data.passcode && data.passcode.length === 4) {
      setIsLocked(true);
    }
  }, [loading, data.passcode]);

  const handleUpdateData = (newData) => {
    setData(newData);
    // Save to IndexedDB (Async)
    set('kenangan_kita_data_v7', newData).catch(err => console.error("Save failed:", err));
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'story', 'timeline', 'reasons', 'gallery', 'letter'];
      const scrollPosition = window.scrollY + 300;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500 mb-4" />
        <p className="font-serif animate-pulse">Memuat Kenangan...</p>
      </div>
    );
  }

  if (isLocked) {
    return <LockScreen passcode={data.passcode} onUnlock={() => setIsLocked(false)} />;
  }

  if (!hasInteracted) {
    return <WelcomeOverlay onEnter={() => setHasInteracted(true)} />;
  }

  return (
    <div className="font-sans text-gray-100 selection:bg-pink-500/30 relative min-h-screen overflow-x-hidden">

      {/* --- DYNAMIC BACKGROUND (SAKURA) --- */}
      <DynamicBackground
        videoUrl={data.backgroundVideo}
        storyVideoUrl={data.storyVideo}
        showStoryVideo={activeSection === 'story'}
      />

      {/* Tombol Pengaturan */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-6 right-6 z-40 p-3 bg-white/5 backdrop-blur-md rounded-full border border-pink-200/20 hover:bg-pink-600/80 transition-all text-pink-100/70 hover:text-white"
      >
        <Settings size={20} />
      </button>

      {/* Navigation Bottom */}
      <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-1.5 z-50 border border-white/10 flex gap-2 ring-1 ring-white/5">
        {[
          { id: 'home', icon: Heart },
          { id: 'timeline', icon: Clock },
          { id: 'reasons', icon: Star },
          { id: 'gallery', icon: Camera },
          { id: 'letter', icon: MessageCircle }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`p-3 rounded-full transition-all duration-300 relative group ${activeSection === item.id ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <item.icon size={18} fill={activeSection === item.id && item.id === 'home' ? "currentColor" : "none"} className="relative z-10" />
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 w-full pb-40">

        {/* SECTION 1: HERO (HOME) - MASTERPIECE ETHEREAL LUXURY */}
        <div id="home" className="min-h-screen relative flex flex-col items-center justify-between overflow-hidden py-10">

          {/* Floating Music Player */}
          <div className="fixed z-50 animate-in fade-in slide-in-from-top-4 duration-1000 bottom-10 right-4 md:bottom-10 md:right-10 transition-all">
            <MusicPlayer music={data.music} compact={true} autoPlay={true} />
          </div>

          {/* 1. Top Spacer (Empty to balance flex) */}
          <div className="flex-none h-20"></div>

          {/* 2. Main Title (The Names) - Centered & Grand */}
          <div className="relative z-20 flex-grow flex flex-col items-center justify-center pointer-events-none w-full">
            <div className="animate-gentle-float pointer-events-auto">
              <h1 className="font-playfair font-normal italic leading-[0.8] flex flex-col items-center text-center">
                {/* Name 1 */}
                <span className="block text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] xl:text-[13rem] text-ethereal-glass tracking-wide" data-text={data.name1}>
                  {data.name1}
                </span>

                {/* Ampersand: Magical Spark */}
                <span className="font-great-vibes text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 my-4 animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,1)]">
                  &
                </span>

                {/* Name 2 */}
                <span className="block text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] xl:text-[13rem] text-ethereal-glass tracking-wide" data-text={data.name2}>
                  {data.name2}
                </span>
              </h1>

              {/* Subtitle: Dreamy Tagline */}
              <div className="mt-8 text-center opacity-80 tracking-[0.6em] text-xs md:text-sm lg:text-base text-blue-50 uppercase font-geist font-light drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                The Eternal Memory
              </div>
            </div>
          </div>

          {/* 3. Central Image (Arch Window) - Absolute Background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 sm:w-80 sm:h-96 md:w-[500px] md:h-[650px] -z-10 opacity-60 pointer-events-none">
            <RevealOnScroll delay={400}>
              <div className="w-full h-full relative group">
                {/* Arch Shape Mask */}
                <div className="absolute inset-0 rounded-t-[10rem] rounded-b-[2rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(236,72,153,0.3)]">
                  <img
                    src={data.heroImage || "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1000&auto=format&fit=crop"}
                    alt="Us"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms]"
                  />
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a1b2e] via-transparent to-[#2a1b2e]/50"></div>
                </div>

                {/* Decorative Orbit */}
                <div className="absolute inset-[-20px] rounded-t-[11rem] rounded-b-[3rem] border border-white/5 animate-spin-slow-reverse opacity-40 pointer-events-none"></div>
              </div>
            </RevealOnScroll>
          </div>

          {/* 4. Bottom Content (Quote & Timer) - Pushed to Bottom */}
          <div className="flex-none flex flex-col items-center relative z-20 w-full max-w-lg px-4 pb-20">
            <RevealOnScroll delay={600}>
              <div className="mb-8 text-center">
                <p className="font-playfair text-lg sm:text-xl text-pink-100/90 italic leading-relaxed drop-shadow-md">
                  "Di bawah langit yang sama,<br />cinta kita bersinar selamanya."
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={800}>
              <div className="flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-6 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/5 shadow-lg scale-90 sm:scale-100">
                  <TimeCounter startDate={data.startDate} label={data.dateLabel} compact={true} />
                </div>

                <div className="animate-bounce text-pink-200/50 mt-4">
                  <ArrowDown size={24} />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* SECTION 1.5: CINEMATIC STORY (THE LOVE REEL) */}
        <div id="story" className="relative">
          {data.stories?.map((story, index) => (
            <div key={story.id} className="sticky top-0 h-screen flex items-center justify-center overflow-hidden transition-opacity duration-1000 backdrop-blur-md bg-black/30">

              {/* Content Card (Glass) */}
              <div className="relative z-10 p-8 md:p-12 max-w-4xl w-full text-center mx-4">
                <CinematicReveal>
                  <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-10 md:p-16 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
                    <h2 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-2xl tracking-wide">
                      {story.title}
                    </h2>
                    <div className={`h-1 w-32 mx-auto mb-8 rounded-full bg-gradient-to-r ${story.color}`}></div>
                    <p className="font-serif text-2xl md:text-3xl text-white/90 leading-relaxed italic">
                      "{story.text}"
                    </p>
                  </div>
                </CinematicReveal>
              </div>
            </div>
          ))}
          {/* <CloudTransition /> */}
        </div>

        {/* SECTION 2: TIMELINE (MUSIM CINTA) - ETERNAL THREAD EDITION */}
        <div id="timeline" className="min-h-screen flex flex-col items-center justify-center py-32 px-4 md:px-20 relative bg-[#2a1b2e]/60">

          <RevealOnScroll>
            <div className="relative mb-32 text-center">
              <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-400 to-rose-200 font-great-vibes tracking-wider filter drop-shadow-lg z-10 relative">
                Jejak Cinta Kita
              </h2>
              <div className="absolute -inset-10 bg-pink-500/20 blur-[100px] rounded-full -z-10"></div>
            </div>
          </RevealOnScroll>

          <div className="w-full max-w-5xl relative">
            {/* The Eternal Thread (Central Line) */}
            {/* The Eternal Thread (Central Line) - REMOVED */}
            {/* <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-pink-500/50 to-transparent -translate-x-1/2"></div> */}

            <div className="space-y-32">
              {data.timeline.map((item, index) => (
                <RevealOnScroll key={index} delay={index * 150}>
                  <div className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-24 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                    {/* Central Node (Dot) - REMOVED */}
                    {/* <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-pink-500 rounded-full border-4 border-[#2a1b2e] shadow-[0_0_20px_rgba(236,72,153,0.8)] z-20 transform -translate-x-1/2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div> */}

                    {/* Image Side (Polaroid Style) */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                      <div className={`relative group inline-block transform transition-transform duration-700 hover:scale-105 hover:z-10 hover:rotate-0 ${index % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}>
                        <div className="bg-white p-3 pb-12 shadow-2xl rounded-sm transform transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                          <div className="relative overflow-hidden aspect-[4/5] w-full md:w-80 filter sepia-[0.2] group-hover:sepia-0 transition-all duration-700">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>
                        {/* Tape Effect */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/30 backdrop-blur-sm -rotate-1 shadow-sm border border-white/20"></div>
                      </div>
                    </div>

                    {/* Text Side (Glass Note) */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 !== 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                      <div className="relative bg-white/5 backdrop-blur-sm border border-pink-200/10 p-8 rounded-2xl shadow-xl hover:bg-white/10 transition-colors duration-500 group">
                        {/* Date Badge */}
                        <div className={`absolute -top-5 ${index % 2 !== 0 ? 'right-8' : 'left-8'} bg-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg border border-pink-400/50`}>
                          {item.date}
                        </div>

                        <h3 className="text-3xl md:text-4xl font-bold text-rose-100 mb-4 font-playfair leading-tight group-hover:text-pink-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-pink-100/70 text-lg leading-relaxed font-light font-serif">
                          {item.description}
                        </p>
                      </div>
                    </div>

                  </div>
                </RevealOnScroll>
              ))}
            </div>
            {/* <CloudTransition /> */}
          </div>
        </div>

        {/* SECTION 3: REASONS */}
        <div id="reasons" className="min-h-screen py-32 px-4 flex flex-col items-center justify-center">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-20 font-serif tracking-widest uppercase drop-shadow-lg">
              Why You?
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full px-4">
            {data.reasons?.map((reason, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm border border-pink-200/10 p-8 rounded-2xl hover:-translate-y-2 transition-all duration-500 group h-full flex flex-col justify-center items-center text-center hover:border-pink-400/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                  <div className="mb-4 text-4xl group-hover:scale-125 transition-transform duration-300 drop-shadow-md">
                    {idx % 3 === 0 ? '🌺' : idx % 3 === 1 ? '✨' : '🦋'}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-pink-300 transition-colors">{reason.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{reason.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* SECTION 4: GALLERY */}
        <div id="gallery" className="min-h-screen py-32 px-4 flex flex-col items-center">
          <RevealOnScroll>
            <h2 className="text-4xl font-bold text-center text-white mb-6 font-serif drop-shadow-lg">Galeri Kenangan</h2>
            <p className="text-center text-pink-200/60 mb-20 font-light text-lg">Merekam jejak waktu bersamamu.</p>
          </RevealOnScroll>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl w-full mx-auto space-y-6">
            {data.gallery.map((src, idx) => (
              <RevealOnScroll key={idx} delay={idx * 150}>
                <div className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer border-2 border-white/5 bg-[#2a1b2e] shadow-2xl">
                  <img
                    src={src}
                    alt={`Memory ${idx}`}
                    className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-white font-serif text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Kenangan #{idx + 1}</span>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* SECTION 5: LETTER */}
        <div id="letter" className="min-h-screen py-32 px-4 flex flex-col items-center justify-center">
          {!showLetter ? (
            <RevealOnScroll>
              <div
                onClick={() => setShowLetter(true)}
                className="cursor-pointer group relative bg-white/5 backdrop-blur-md p-12 rounded-[2rem] border border-pink-200/20 hover:border-pink-500/40 transition-all duration-700 hover:shadow-[0_0_60px_rgba(236,72,153,0.25)] max-w-md text-center hover:-translate-y-2"
              >
                <div className="absolute -top-4 -right-4">
                  <span className="relative flex h-8 w-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-8 w-8 bg-pink-500 items-center justify-center text-white shadow-xl">
                      <Gift size={16} />
                    </span>
                  </span>
                </div>
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle size={32} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 font-serif">Open Me</h3>
                <p className="text-pink-200/70 font-light text-sm">Ada surat kecil untukmu.</p>
              </div>
            </RevealOnScroll>
          ) : (
            <div className="animate-in zoom-in-95 duration-500 bg-[#fffcf5] text-gray-800 p-8 md:p-16 rounded-xl shadow-2xl max-w-2xl w-full relative transform rotate-1 border-8 border-white/40">
              <div className="absolute inset-0 rounded-xl opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
              <button
                onClick={() => setShowLetter(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 z-50 transition-colors p-2 hover:bg-pink-100 rounded-full"
              >
                <VolumeX size={24} />
              </button>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-full border-b border-pink-200 pb-6 mb-6 text-center">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2 block">From Me, To You</span>
                  <h2 className="text-3xl sm:text-4xl font-serif text-rose-950">{data.letter?.title || "Untuk Kamu"}</h2>
                </div>
                <div className="space-y-6 text-gray-700 leading-loose font-serif text-lg text-justify w-full">
                  {data.letter?.content}
                </div>
                <div className="mt-12 flex flex-col items-center gap-2">
                  <Heart className="text-pink-500 fill-pink-500 w-10 h-10 animate-pulse" />
                  <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Forever Love</span>
                </div>
              </div>
            </div>
          )
          }
        </div>

        {/* Footer */}
        <div className="w-full text-center py-8 text-white/20 text-xs pb-32">
          <p>Dibuat dengan Sepenuh Hati</p>
        </div>

      </main>

      {/* Modal Settings */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        data={data}
        onUpdate={handleUpdateData}
      />

      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        
        @keyframes falling-petal {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translateY(100vh) translateX(100px) rotate(360deg); opacity: 0; }
        }
        .animate-falling-petal {
            animation-name: falling-petal;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }
        .font-script { font-family: 'Brush Script MT', cursive; }
      `}</style>
    </div>
  );
}
