import React, { useState, useEffect } from 'react';
import eyesPhoto from './assets/eyes.jpg';

const DAYS_ORDER = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// --- 1. LOGIN PAGE COMPONENT ---
const LoginPage = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === 'Jo' && pass === '21/7/2008') {
      onLogin('Jo');
    } else if (user === 'Ari' && pass === '10/8/2011') {
      onLogin('Ari');
    } else {
      alert("Wrong username or password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-pink-50">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm flex flex-col gap-4 border border-white animate-in zoom-in duration-500">
        <h2 className="text-2xl font-black text-gray-800 italic uppercase text-center mb-4 leading-none">Access<br/>Us Hub</h2>
        <input 
          type="text" placeholder="Username" 
          className="bg-gray-50 p-4 rounded-2xl outline-none border border-transparent focus:border-pink-200 font-bold"
          value={user} onChange={(e) => setUser(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="bg-gray-50 p-4 rounded-2xl outline-none border border-transparent focus:border-pink-200 font-bold"
          value={pass} onChange={(e) => setPass(e.target.value)}
        />
        <button type="submit" className="bg-[#ff85a1] text-white p-4 rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all mt-2 tracking-widest">Login</button>
      </form>
    </div>
  );
};

// --- 2. ALBUM PAGE COMPONENT ---
const AlbumPage = ({ onBack, currentUser }) => {
  const [openedBook, setOpenedBook] = useState(null); 
  const [albums, setAlbums] = useState(() => {
    const saved = localStorage.getItem('couple_albums_v1');
    return saved ? JSON.parse(saved) : { Jo: [], Ari: [] };
  });

  useEffect(() => {
    localStorage.setItem('couple_albums_v1', JSON.stringify(albums));
  }, [albums]);

  const addPhoto = (book) => {
    const url = prompt(`Add photo URL to ${book}'s book:`);
    const caption = prompt("Enter a short caption:");
    if (url) {
      setAlbums(prev => ({
        ...prev,
        [book]: [...prev[book], { id: Date.now(), url, caption }]
      }));
    }
  };

  const deletePhoto = (book, id) => {
    if (window.confirm("Delete this memory?")) {
      setAlbums(prev => ({
        ...prev,
        [book]: prev[book].filter(p => p.id !== id)
      }));
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      <button onClick={openedBook ? () => setOpenedBook(null) : onBack} className="text-[#ff85a1] font-bold text-xs uppercase self-start px-2">
        {openedBook ? "← Back to Books" : "← Back to Hub"}
      </button>

      {!openedBook ? (
        <div className="flex flex-col items-center gap-12 pt-10">
          <h2 className="text-2xl font-black text-gray-800 uppercase italic">Our Albums</h2>
          <div className="flex gap-8">
            <button onClick={() => setOpenedBook('Jo')} className="group flex flex-col items-center gap-4">
              <div className="w-32 h-44 bg-[#4a90e2] rounded-r-2xl rounded-l-md shadow-2xl border-l-8 border-black/20 flex items-center justify-center transform group-hover:rotate-[-5deg] transition-all">
                <span className="text-white font-black text-2xl italic">JO</span>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to Open</span>
            </button>

            <button onClick={() => setOpenedBook('Ari')} className="group flex flex-col items-center gap-4">
              <div className="w-32 h-44 bg-[#ff85a1] rounded-r-2xl rounded-l-md shadow-2xl border-l-8 border-black/20 flex items-center justify-center transform group-hover:rotate-[5deg] transition-all">
                <span className="text-white font-black text-2xl italic">ARI</span>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to Open</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-black text-gray-800 uppercase italic">{openedBook}'s Gallery</h2>
            {currentUser === openedBook && (
              <button 
                onClick={() => addPhoto(openedBook)}
                className="bg-[#ff85a1] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg"
              >+ Add Photo</button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {albums[openedBook].map((photo) => (
              <div key={photo.id} className="bg-white p-2 rounded-2xl shadow-md relative group">
                <img src={photo.url} className="w-full h-40 object-cover rounded-xl" alt="Memory" />
                {photo.caption && <p className="text-[9px] font-bold text-gray-500 mt-2 px-1 uppercase tracking-tight">{photo.caption}</p>}
                {currentUser === openedBook && (
                  <button 
                    onClick={() => deletePhoto(openedBook, photo.id)}
                    className="absolute top-3 right-3 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                  >✕</button>
                )}
              </div>
            ))}
          </div>
          {albums[openedBook].length === 0 && (
            <p className="text-gray-300 font-bold uppercase text-xs mt-20 text-center italic">This book is empty...</p>
          )}
        </div>
      )}
    </div>
  );
};

// --- 3. MATCHING PAGE COMPONENT ---
const MatchingPage = ({ onBack }) => {
  const [sets, setSets] = useState(() => {
    const saved = localStorage.getItem('couple_matching_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('couple_matching_v1', JSON.stringify(sets));
  }, [sets]);

  const addMatchingSet = () => {
    const title = prompt("Set Name (e.g. Anime Night):");
    const myPfp = prompt("Jo's PFP URL:");
    const herPfp = prompt("Ari's PFP URL:");
    const banner = prompt("Shared Banner URL:");
    if (title && myPfp && herPfp && banner) {
      setSets([...sets, { id: Date.now(), title, myPfp, herPfp, banner, likes: 0, dislikes: 0 }]);
    }
  };

  const react = (id, type) => {
    setSets(sets.map(s => s.id === id ? { ...s, [type]: s[type] + 1 } : s));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      <button onClick={onBack} className="text-[#ff85a1] font-bold text-xs uppercase self-start px-2">← Back</button>
      <h2 className="text-2xl font-black text-gray-800 uppercase italic text-center">Matching Sets</h2>
      <div className="flex flex-col gap-8">
        {sets.map((set) => (
          <div key={set.id} className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-pink-50 relative">
            <button onClick={() => setSets(sets.filter(s => s.id !== set.id))} className="absolute top-4 right-6 text-gray-300 font-bold">✕</button>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{set.title}</p>
            <img src={set.banner} className="w-full h-24 object-cover rounded-2xl mb-4 shadow-inner" alt="Banner" />
            <div className="flex justify-around items-center mb-6">
              <div className="text-center">
                <img src={set.myPfp} className="w-16 h-16 rounded-full border-4 border-blue-400 object-cover shadow-md mb-1" alt="Jo" />
                <p className="text-[8px] font-black text-blue-400 uppercase">Jo</p>
              </div>
              <div className="text-pink-200 text-xl font-bold">❤</div>
              <div className="text-center">
                <img src={set.herPfp} className="w-16 h-16 rounded-full border-4 border-pink-400 object-cover shadow-md mb-1" alt="Ari" />
                <p className="text-[8px] font-black text-pink-400 uppercase">Ari</p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => react(set.id, 'likes')} className="bg-green-50 px-4 py-2 rounded-2xl text-green-600 font-black text-xs active:scale-90 transition-all">👍 {set.likes}</button>
              <button onClick={() => react(set.id, 'dislikes')} className="bg-red-50 px-4 py-2 rounded-2xl text-red-600 font-black text-xs active:scale-90 transition-all">👎 {set.dislikes}</button>
            </div>
          </div>
        ))}
        <button onClick={addMatchingSet} className="border-2 border-dashed border-pink-200 p-8 rounded-[2.5rem] text-pink-300 font-black text-xs uppercase">+ Add New Set</button>
      </div>
    </div>
  );
};

// --- 4. COUNTER COMPONENT ---
const Counter = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const startDate = new Date(2025, 11, 17, 0, 0, 0); 
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - startDate;
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60),
          secs: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-pink-50 text-center">
      <p className="text-[#ff85a1] font-black tracking-[0.3em] uppercase text-[10px] mb-6">Our Journey</p>
      <div className="grid grid-cols-4 gap-4 text-center">
        {[{ l: 'Days', v: time.days }, { l: 'Hrs', v: time.hours }, { l: 'Min', v: time.mins }, { l: 'Sec', v: time.secs }].map((u) => (
          <div key={u.l} className="flex flex-col">
            <span className="text-3xl font-black text-[#ff4d6d] tabular-nums">{u.v}</span>
            <span className="text-[8px] uppercase font-bold text-gray-300 mt-1">{u.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 5. CALENDAR PAGE ---
const CalendarPage = ({ onBack, currentUser }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [activeUser, setActiveUser] = useState('his');
  const today = new Date();
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('couple_schedule_v5');
    return saved ? JSON.parse(saved) : { his: { Sat: [], Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [] }, hers: { Sat: [], Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [] } };
  });
  useEffect(() => { localStorage.setItem('couple_schedule_v5', JSON.stringify(schedules)); }, [schedules]);

  const addTask = (day) => {
    const task = prompt("Plan?"); const start = prompt("Start?"); const end = prompt("End?");
    if (task && start && end) setSchedules(prev => ({ ...prev, [activeUser]: { ...prev[activeUser], [day]: [...prev[activeUser][day], { task, start, end, id: Date.now() }].sort((a,b) => a.start.localeCompare(b.start)) } }));
  };

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  // Helper to check if current logged user matches the schedule owner
  const isScheduleOwner = (activeUser === 'his' && currentUser === 'Jo') || (activeUser === 'hers' && currentUser === 'Ari');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <button onClick={onBack} className="text-[#ff85a1] font-bold text-xs uppercase self-start px-2">← Back</button>
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-pink-50 text-center">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="text-pink-200">❮</button>
          <h2 className="text-lg font-black text-gray-800 uppercase italic">{monthName}</h2>
          <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="text-pink-200">❯</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-gray-300 uppercase mb-2">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDay).fill(null).map((_, i) => <div key={i} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const isAnniv = day === 17; // ADDED BACK THE 17th MARK
            const isJoBday = day === 21 && viewDate.getMonth() === 6; // July
            const isAriBday = day === 10 && viewDate.getMonth() === 7; // Aug
            const isToday = day === today.getDate() && viewDate.getMonth() === today.getMonth();
            
            return (
              <div key={day} className={`h-9 flex flex-col items-center justify-center rounded-xl text-xs font-bold relative
                ${isAnniv ? 'bg-[#ff4d6d] text-white shadow-md' : 'text-gray-400'} 
                ${(isJoBday || isAriBday) ? 'bg-yellow-400 text-white z-10' : ''}
                ${isToday && !isAnniv && !(isJoBday || isAriBday) ? 'border-2 border-[#ff85a1] scale-105 bg-white z-10' : ''}`}>
                {day}
                {(isJoBday || isAriBday) && <span className="absolute -top-1 -right-1 text-[8px]">🎂</span>}
                {isAnniv && !isJoBday && !isAriBday && <span className="absolute -top-1 -right-1 text-[8px]">❤️</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white/90 p-6 rounded-[2.5rem] shadow-lg mb-20 text-left">
        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setActiveUser('his')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeUser === 'his' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>JO</button>
            <button onClick={() => setActiveUser('hers')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeUser === 'hers' ? 'bg-[#ff85a1] text-white' : 'text-gray-400'}`}>ARI</button>
          </div>
        </div>
        {DAYS_ORDER.map(day => (
          <div key={day} className="border-l-2 border-pink-50 pl-4 py-1 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{day}</span>
              {isScheduleOwner && (
                <button onClick={() => addTask(day)} className="text-[10px] font-bold text-pink-300">+ Add</button>
              )}
            </div>
            {schedules[activeUser][day].map((item) => (
              <div key={item.id} className={`p-3 rounded-2xl relative group mb-2 ${activeUser === 'his' ? 'bg-blue-500' : 'bg-[#ff85a1]'} text-white shadow-sm`}>
                {isScheduleOwner && (
                  <button onClick={() => { if(window.confirm("Delete?")) setSchedules(prev => ({ ...prev, [activeUser]: { ...prev[activeUser], [day]: prev[activeUser][day].filter(i => i.id !== item.id) } })) }} className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                )}
                <p className="text-[10px] font-black uppercase tracking-tight">{item.task}</p>
                <p className="text-[8px] font-bold opacity-80">{item.start} - {item.end}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 6. STORY PAGE ---
const StoryPage = ({ onBack }) => {
  const [memories, setMemories] = useState(() => { const saved = localStorage.getItem('couple_stories_v3'); return saved ? JSON.parse(saved) : []; });
  const [selectedMemory, setSelectedMemory] = useState(null);
  useEffect(() => { localStorage.setItem('couple_stories_v3', JSON.stringify(memories)); }, [memories]);
  const addMemory = () => {
    const title = prompt("Title:"); const date = prompt("Date:"); const text = prompt("Story:");
    const photo = prompt("Photo URL:") || "https://via.placeholder.com/300x200?text=Memory";
    if (title && date && text) setMemories([...memories, { id: Date.now(), title, date, text, photo }]);
  };
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      <button onClick={onBack} className="text-[#ff85a1] font-bold text-xs uppercase self-start px-2">← Back</button>
      <h2 className="text-2xl font-black text-gray-800 uppercase italic text-center">Our Story</h2>
      <div className="relative mt-20 mb-20 flex justify-center items-center px-10">
        <div className="absolute w-full h-1 bg-pink-100 rounded-full"></div>
        <div className="relative flex justify-between w-full items-center">
          {memories.map((m) => (
            <div key={m.id} className="relative group">
              <button onClick={() => setSelectedMemory(m)} className="w-6 h-6 bg-white border-4 border-[#ff85a1] rounded-full shadow-md hover:scale-150 transition-all z-10" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap">{m.title}</div>
            </div>
          ))}
          <button onClick={addMemory} className="w-8 h-8 bg-pink-50 border-2 border-dashed border-[#ff85a1] rounded-full text-[#ff85a1] font-bold hover:bg-white">+</button>
        </div>
      </div>
      {selectedMemory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-[60]">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl relative text-left animate-in zoom-in duration-300">
            <button onClick={() => setSelectedMemory(null)} className="absolute top-4 right-4 bg-white/80 w-8 h-8 rounded-full font-bold text-gray-400 z-10">✕</button>
            <img src={selectedMemory.photo} className="w-full h-48 object-cover" alt="Memory" />
            <div className="p-8">
              <span className="text-[#ff85a1] text-[10px] font-black uppercase tracking-widest">{selectedMemory.date}</span>
              <h3 className="text-xl font-black text-gray-800 mt-1 mb-4 italic">{selectedMemory.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{selectedMemory.text}</p>
              <button onClick={() => { if(window.confirm("Delete?")) { setMemories(memories.filter(mem => mem.id !== selectedMemory.id)); setSelectedMemory(null); }}} className="mt-6 text-red-400 text-[10px] font-bold uppercase tracking-widest">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 7. VAULT PAGE ---
const VaultPage = ({ onBack }) => {
  const [items, setItems] = useState(() => { const saved = localStorage.getItem('couple_vault_v3'); return saved ? JSON.parse(saved) : []; });
  useEffect(() => { localStorage.setItem('couple_vault_v3', JSON.stringify(items)); }, [items]);
  const addItem = () => {
    const type = confirm("OK for Msg, Cancel for VM") ? 'msg' : 'vm';
    const content = prompt("Content/Link:"); const lockType = prompt("Lock: 'none', 'pass', 'date'");
    let password = ""; let unlockDate = "";
    if (lockType === 'pass') password = prompt("Password:");
    if (lockType === 'date') unlockDate = prompt("Date (YYYY-MM-DD):");
    if (content) setItems([...items, { id: Date.now(), type, content, lockType, password, unlockDate }]);
  };
  const openItem = (item) => {
    if (item.lockType === 'date' && new Date() < new Date(item.unlockDate)) return alert("Locked!");
    if (item.lockType === 'pass' && prompt("Guess:") !== item.password) return alert("Wrong!");
    item.type === 'msg' ? alert(item.content) : window.open(item.content, '_blank');
  };
  return (
    <div className="flex flex-col gap-6 pb-20">
      <button onClick={onBack} className="text-[#ff85a1] font-bold text-xs uppercase self-start">← Back</button>
      <h2 className="text-2xl font-black italic uppercase text-center">Secret Vault</h2>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <button key={item.id} onClick={() => openItem(item)} className="bg-white p-5 rounded-[2rem] shadow-sm border border-pink-50 flex items-center justify-between">
            <span className="text-2xl">{item.type === 'msg' ? '✉️' : '🎙️'}</span>
            <span className="text-pink-300 font-bold text-[10px] uppercase tracking-widest">{item.lockType}</span>
            <span>{item.lockType === 'none' ? '🔓' : '🔒'}</span>
          </button>
        ))}
        <button onClick={addItem} className="border-2 border-dashed border-pink-200 p-5 rounded-[2rem] text-pink-300 font-black">+ Add Secret</button>
      </div>
    </div>
  );
};

// --- 8. MOVIES PAGE ---
const MoviesPage = ({ onBack }) => {
  const [movies, setMovies] = useState(() => { const saved = localStorage.getItem('couple_movies_v1'); return saved ? JSON.parse(saved) : []; });
  useEffect(() => { localStorage.setItem('couple_movies_v1', JSON.stringify(movies)); }, [movies]);
  const addMovie = () => {
    const name = prompt("Name:"); const type = prompt("Type:"); const eps = prompt("Eps:");
    if (name) setMovies([...movies, { id: Date.now(), name, type, eps, likes: 0, dislikes: 0 }]);
  };
  return (
    <div className="flex flex-col gap-6 pb-20">
      <button onClick={onBack} className="text-[#ff85a1] font-bold text-xs uppercase self-start px-2">← Back</button>
      <h2 className="text-2xl font-black text-gray-800 uppercase italic text-center">Watchlist</h2>
      {movies.map(m => (
        <div key={m.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm flex justify-between items-center text-left">
          <div><p className="text-[10px] font-black text-pink-300 uppercase">{m.type} • {m.eps} Eps</p><h3 className="text-lg font-black text-gray-800 italic uppercase leading-none mt-1">{m.name}</h3></div>
          <div className="flex gap-2">
            <button onClick={() => setMovies(movies.map(mov => mov.id === m.id ? {...mov, likes: mov.likes+1} : mov))} className="bg-green-50 px-3 py-2 rounded-2xl">👍 {m.likes}</button>
            <button onClick={() => setMovies(movies.map(mov => mov.id === m.id ? {...mov, dislikes: mov.dislikes+1} : mov))} className="bg-red-50 px-3 py-2 rounded-2xl">👎 {m.dislikes}</button>
          </div>
        </div>
      ))}
      <button onClick={addMovie} className="border-2 border-dashed border-pink-200 p-6 rounded-[2.5rem] text-pink-300 font-black">+ Add New</button>
    </div>
  );
};

// --- 9. MAIN HUB ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [mood, setMood] = useState(() => localStorage.getItem('hub_mood') || "😊");
  useEffect(() => { localStorage.setItem('hub_mood', mood); }, [mood]);

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col gap-8 pb-24 text-center">
      {currentPage === 'home' ? (
        <>
          <header className="flex flex-col items-center pt-10 gap-4">
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-pink-50 flex items-center justify-center">
                <img src={eyesPhoto} className="w-full h-full object-cover" alt="Eyes" onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='👀'; }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-pink-50">{mood}</div>
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic leading-none">Us Hub</h1>
            <p className="text-[#ff85a1] text-[10px] font-black uppercase italic tracking-widest leading-none mt-1">Hello, {currentUser}</p>
          </header>
          <Counter />
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: 'Calendar', i: '📅', id: 'calendar' },
              { n: 'Story', i: '🌱', id: 'story' },
              { n: 'Vault', i: '🔒', id: 'vault' },
              { n: 'Movies', i: '🍿', id: 'movies' },
              { n: 'Album', i: '🖼️', id: 'album' },
              { n: 'Matching', i: '👥', id: 'matching' }
            ].map((item) => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 flex flex-col items-center gap-2 active:scale-95 transition-all">
                <span className="text-3xl">{item.i}</span>
                <span className="font-bold text-gray-700 text-[10px] uppercase tracking-wider">{item.n}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setCurrentUser(null)} className="text-gray-300 text-[10px] font-bold uppercase tracking-widest mt-4">Logout</button>
        </>
      ) : (
        <>
          {currentPage === 'calendar' && <CalendarPage onBack={() => setCurrentPage('home')} currentUser={currentUser} />}
          {currentPage === 'story' && <StoryPage onBack={() => setCurrentPage('home')} />}
          {currentPage === 'vault' && <VaultPage onBack={() => setCurrentPage('home')} />}
          {currentPage === 'movies' && <MoviesPage onBack={() => setCurrentPage('home')} />}
          {currentPage === 'album' && <AlbumPage onBack={() => setCurrentPage('home')} currentUser={currentUser} />}
          {currentPage === 'matching' && <MatchingPage onBack={() => setCurrentPage('home')} />}
        </>
      )}

      {/* Persistent Mood Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[80%] max-w-[300px] bg-white/80 backdrop-blur-lg p-4 rounded-[2rem] border border-white flex justify-around shadow-2xl z-50">
        {['😊', '🥰', '😴', '🥺', '🍿'].map(m => (
          <button key={m} onClick={() => setMood(m)} className={`text-2xl transition-all ${mood === m ? 'scale-125' : 'grayscale opacity-30'}`}>{m}</button>
        ))}
      </div>
    </div>
  );
}