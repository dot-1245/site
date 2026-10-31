import React, { useState, useEffect } from 'react';
import { SwissGrid, GridItem } from './components/SwissGrid';
import { SystemCard } from './components/SystemCard';
import { UserProfile, SystemSpec } from './types';
import { MapPin, User, Globe, Sun, Moon } from 'lucide-react';
// @ts-ignore
import { SiYoutube, SiDiscord, SiSteam, SiSpotify } from 'react-icons/si';
// @ts-ignore
import { RiMailFill } from 'react-icons/ri';

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user: UserProfile = {
    handle: "dot1245",
    gender: "Male",
    location: "Japan",
    region: "JP/Asia-Pacific (+0900)",
    roles: ["Minimalist", "Developer", "System Enthusiast"]
  };

  const systems: SystemSpec[] = [
    {
      os: "Windows 11",
      version: "25H2",
      type: "secondary",
      kernel: "NT 10.0",
      hardware: "i5-12400F / RTX 3060"
    },
    {
      os: "Arch Linux",
      type: "primary",
      kernel: "Linux",
      ds: "Wayland",
      wm: "hyprland",
      version:"Rolling Release"
    },
    {
      os: "Android",
      version: "16",
      type: "mobile",
      hardware: "Pixel 10 / 128GB"
    }
  ];

  // Dynamic Theme Classes
  const theme = {
    bg: isDark ? 'bg-swiss-black' : 'bg-swiss-white',
    text: isDark ? 'text-swiss-white' : 'text-swiss-black',
    selection: isDark ? 'selection:bg-white selection:text-black' : 'selection:bg-black selection:text-white',
    subText: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-swiss-white/20' : 'border-swiss-black/20',
    headerBorder: isDark ? 'border-swiss-gray/50' : 'border-swiss-black/10',
    identityBorder: isDark ? 'border-white' : 'border-black',
    highlight: isDark ? 'text-white' : 'text-black',
    
    // Footer inverts the main theme
    footerBg: isDark ? 'bg-white' : 'bg-swiss-black',
    footerText: isDark ? 'text-black' : 'text-swiss-white',
    footerHover: isDark ? 'hover:text-[#6c4bfd]' : 'hover:text-[#a08bff]', // Slightly adjust link hover if needed
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${theme.selection} transition-colors duration-500 ease-in-out ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Dynamic Scrollbar Styles */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${isDark ? '#000' : '#e5e5e5'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDark ? '#333' : '#999'};
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#555' : '#777'};
        }
        body {
          background-color: ${isDark ? '#050505' : '#F0F0F0'};
        }
      `}</style>

      {/* Navigation / Header Line */}
      {/* text-white is forced here so mix-blend-difference works correctly on both Black and White backgrounds */}
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white px-4 py-6 md:px-12">
        <div className={`flex justify-between items-center border-b ${theme.headerBorder} pb-4`}>
          <h1 className="text-xl font-bold tracking-tighter">DOT1245</h1>
          <div className="flex items-center gap-4">
            <span className="font-sans font-normal text-xs hidden md:block">{new Date().getFullYear()} © DOT1245</span>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="hover:scale-110 transition-transform duration-200 focus:outline-none"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 px-4 md:px-12 pb-20">
        
        {/* HERO SECTION */}
        <SwissGrid className="mb-24 md:mb-40">
          <GridItem colSpan={4} mdColSpan={8} lgColSpan={8} className="flex flex-col justify-end min-h-[40vh]">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-4">
              HELLO.<br />
              I AM DOT.
            </h2>
          </GridItem>
          <GridItem colSpan={4} mdColSpan={8} lgColSpan={4} className="flex flex-col justify-end pb-2">
             <div className="text-right md:text-left lg:text-right">
                <p className={`text-lg font-light ${theme.subText}`}>JAPANESE MALE</p>
                <p className={`text-lg font-light ${theme.subText}`}>BASED IN JAPAN</p>
             </div>
          </GridItem>
        </SwissGrid>

        {/* IDENTITY SECTION */}
        <div className={`border-t ${theme.border} pt-8 mb-24 transition-colors duration-500`}>
          <SwissGrid>
            <GridItem colSpan={4} mdColSpan={2} lgColSpan={3}>
               <span className="text-xs font-mono text-gray-500 uppercase">Identity</span>
            </GridItem>
            <GridItem colSpan={4} mdColSpan={6} lgColSpan={9}>
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <User size={16} />
                      <span className="font-mono text-sm uppercase">Profile</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-medium leading-tight">
                      Known as <span className={`${theme.highlight} border-b-2 ${theme.identityBorder}`}>{user.handle}</span>. 
                      A digital native focusing on simplicity and structure.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <MapPin size={16} />
                      <span className="font-mono text-sm uppercase">Location</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-medium leading-tight">
                      Operating from <span className={theme.highlight}>{user.location}</span>.
                      <br />
                      <span className={`text-base font-mono mt-1 block ${theme.subText}`}>{user.region}</span>
                    </p>
                  </div>
                </div>
              </div>
            </GridItem>
          </SwissGrid>
        </div>

        {/* SYSTEM ENVIRONMENT SECTION */}
        <div className={`border-t ${theme.border} pt-8 mb-24 transition-colors duration-500`}>
          <SwissGrid>
            <GridItem colSpan={4} mdColSpan={2} lgColSpan={3}>
               <span className="text-xs font-mono text-gray-500 uppercase">Environment</span>
            </GridItem>
            <GridItem colSpan={4} mdColSpan={6} lgColSpan={9}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systems.map((sys) => (
                  <SystemCard key={sys.os + sys.hardware} spec={sys} isDark={isDark} />
                ))}
              </div>
            </GridItem>
          </SwissGrid>
        </div>

        {/* PHILOSOPHY / FOOTER */}
        <div className={`${theme.footerBg} ${theme.footerText} p-8 md:p-12 mt-20 transition-colors duration-500`}>
          <SwissGrid>
            <GridItem colSpan={4} mdColSpan={8} lgColSpan={8}>
              {/* Reduced bottom margin from mb-8 to mb-1 */}
              <h3 className="text-4xl md:text-6xl font-bold tracking-tight mb-1">
                BREAK.<br />
                THINK.<br />
                REBUILD.
              </h3>
            </GridItem>
            {/* Changed justify-between to justify-end with gap-6 to crush space between Globe and Contact */}
            <GridItem colSpan={4} mdColSpan={8} lgColSpan={4} className="flex flex-col justify-end gap-6 pt-6 md:pt-0">
              <Globe className="w-12 h-12" />
              <div className="space-y-4">
                 <p className="font-mono text-sm">
                   Contact me
                 </p>
                 {/* Icons: Added w-12 h-12 rounded-full hover:bg-white to force background on hover */}
                 <div className="flex items-center gap-4 pt-2">
                    <a href="https://www.youtube.com/@dot-1245" target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-white hover:scale-110 hover:text-[#FF0000]`} aria-label="YouTube">
                      <SiYoutube size={24} />
                    </a>
                    <a href="https://d.dot1245.net/" target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-white hover:scale-110 hover:text-[#5865F2]`} aria-label="Discord">
                      <SiDiscord size={24} />
                    </a>
                    <a href="https://steamcommunity.com/profiles/76561199340967978/" target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-white hover:scale-110 hover:text-[#2a5298]`} aria-label="Steam">
                      <SiSteam size={24} />
                    </a>
                    <a href="https://open.spotify.com/user/9mvmw97oqtx5wxi8xcy9vwfsw" target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-white hover:scale-110 hover:text-[#1ED760]`} aria-label="Spotify">
                      <SiSpotify size={24} />
                    </a>
                    <a href="mailto:dot1245@proton.me" className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:bg-white hover:scale-110 ${theme.footerHover}`} aria-label="Email">
                      <RiMailFill size={24} />
                    </a>
                 </div>
              </div>
            </GridItem>
          </SwissGrid>
          
          {/* Reduced top margin from mt-12 to mt-4 */}
          <div className="mt-4 pt-6 border-t border-current border-opacity-20 flex justify-end">
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
              made by dot1245 and gemini with ❤
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
