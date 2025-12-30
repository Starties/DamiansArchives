"use client";

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, Battery, X } from 'lucide-react';

// --- CONFIGURATION THIS SHOULD BE SHARED W YOU ALREADY SO CTRL+ CLICK ---
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTiUD07fPcFA9zPES-HKKCs-BC8GZ223iKxzr2bJeLX_YX6cS5YpKD8Y97oPv-NZpCxZUrsXdo8pWyV/pub?gid=0&single=true&output=csv';

type ArchiveImage = {
  id: string;
  image_url: string;
};

// --- VISUALS ---
const bootText = [
  "INITIALIZING BIOS...",
  "CHECKING VRAM... 4096KB OK",
  "LOADING VISON_OS KERNEL...",
  "MOUNTING MEMORY CARD SLOT 1...",
  "ACCESS GRANTED."
];

export default function Home() {
  const [pictures, setPictures] = useState<ArchiveImage[]>([]);
  const [bootPhase, setBootPhase] = useState<'off' | 'bios' | 'logo' | 'os'>('off');
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<ArchiveImage | null>(null);

  // --- BOOT SEQUENCE LOGIC ---
  useEffect(() => {
    setTimeout(() => setBootPhase('bios'), 1000);
  }, []);

  useEffect(() => {
    if (bootPhase === 'bios') {
      let delay = 0;
      bootText.forEach((line, index) => {
        delay += 600 + Math.random() * 400;
        setTimeout(() => {
          setBootLog(prev => [...prev, line]);
          if (index === bootText.length - 1) {
            setTimeout(() => setBootPhase('logo'), 1500);
          }
        }, delay);
      });
    }

    if (bootPhase === 'logo') {
      setTimeout(() => setBootPhase('os'), 3500);
    }
  }, [bootPhase]);

  // --- DATA FETCHING ---
  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then(r => r.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (res: any) => setPictures(res.data)
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden font-mono selection:bg-orange-500 selection:text-black cursor-crosshair">
      
      {/* --- GLOBAL CSS (FONTS & CRT FX) --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap');
        
        .font-bios { font-family: 'VT323', monospace; }
        .font-ps { font-family: 'Press Start 2P', cursive; }

        @keyframes turnOn {
          0% { transform: scale(1, 0.002); opacity: 0; filter: brightness(30); }
          50% { transform: scale(1, 0.002); opacity: 1; filter: brightness(10); }
          100% { transform: scale(1, 1); opacity: 1; filter: brightness(1); }
        }

        .crt-wrapper {
          animation: turnOn 0.4s ease-out forwards;
          position: relative;
          z-index: 10;
          height: 100vh;
          width: 100vw;
          overflow-y: auto;
          overflow-x: hidden;
          text-shadow: 2px 0 rgba(255,0,0,0.5), -2px 0 rgba(0,255,255,0.5);
        }

        .scanlines {
          position: fixed; inset: 0; z-index: 50; pointer-events: none;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 3px, 3px 100%;
          opacity: 0.6;
        }

        .vignette {
          position: fixed; inset: 0; z-index: 60; pointer-events: none;
          background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 130%);
        }

        @keyframes flicker {
          0% { opacity: 0.97; } 50% { opacity: 1; } 100% { opacity: 0.98; }
        }
        .flicker { animation: flicker 0.15s infinite; }
      `}</style>

      {/* --- CRT OVERLAYS --- */}
      <div className="scanlines" />
      <div className="vignette" />

      {/* --- MAIN CRT CONTAINER --- */}
      {bootPhase !== 'off' && (
        <div className="crt-wrapper flicker bg-[#0a0a0a] text-[#a8a8a8]">
          
          {/* PHASE 1: BIOS SCREEN */}
          {bootPhase === 'bios' && (
            <div className="h-full flex flex-col p-4 md:p-10 font-bios text-lg md:text-2xl text-green-500 uppercase leading-snug">
              <div className="mb-8 font-bold">DONE4 Entertainment</div>
              {bootLog.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {log}
                </motion.div>
              ))}
              <div className="mt-auto animate-pulse">_</div>
            </div>
          )}

          {/* PHASE 2: LOGO SCREEN */}
          {bootPhase === 'logo' && (
            <div className="h-full flex items-center justify-center bg-white text-black p-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-center w-full"
              >
                <div className="flex justify-center mb-6">
                  {/* Responsive Logo Size */}
                  <div className="relative w-40 h-40 md:w-60 md:h-60">
                    <img src="/don4logo.png" alt="done4logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <h1 className="font-ps text-3xl md:text-5xl tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-black to-gray-500">
                  DONE4
                </h1>
                <p className="font-ps text-[8px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] mt-2 text-gray-500">ENTERTAINMENT</p>
              </motion.div>
            </div>
          )}

          {/* PHASE 3: THE OS (GALLERY) */}
          {bootPhase === 'os' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 1 }}
              className="min-h-screen relative pb-20" // added padding bottom for footer
            >
              {/* OS HEADER */}
              <header className="sticky top-0 z-40 bg-[#111] border-b-2 border-white/20 px-3 md:px-6 py-3 md:py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-linear-to-br from-gray-700 to-black rounded flex items-center justify-center border border-gray-500 shrink-0">
                    <Disc className="text-white w-3 h-3 md:w-5 md:h-5 animate-spin-slow" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bios text-xl md:text-3xl text-white leading-none">MEMORY CARD</h2>
                    <p className="font-bios text-sm md:text-xl text-gray-400 leading-none">DONE4_ARCHIVE</p>
                  </div>
                </div>
                <div className="flex gap-2 md:gap-4 opacity-50 shrink-0">
                  <Battery className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                  <div className="font-bios text-lg md:text-xl text-white hidden sm:block">100%</div>
                </div>
              </header>

              {/* GRID CONTENT */}
              <main className="p-3 md:p-8">
                {/* Optimized columns for mobile (columns-1) */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
                  <AnimatePresence>
                    {pictures.map((pic, i) => (
                      pic.image_url ? (
                        <motion.div
                          key={pic.id}
                          layoutId={`card-${pic.id}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.05 }}
                          className="break-inside-avoid"
                          onClick={() => setSelectedImage(pic)}
                        >
                          {/* JEWEL CASE AESTHETIC */}
                          <div className="group cursor-pointer relative bg-black border-l-2 border-t-2 border-gray-600 border-r-2 border-b-2 hover:border-orange-500 transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.5)] md:shadow-[5px_5px_0px_rgba(0,0,0,0.5)]">
                            
                            {/* The Image */}
                            <div className="relative overflow-hidden aspect-square">
                              <motion.img 
                                src={pic.image_url} 
                                alt={pic.id}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.1 }}
                              />
                              <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-black/40 pointer-events-none" />
                            </div>

                            {/* CD Spine Info */}
                            <div className="p-2 bg-[#1a1a1a] flex justify-between items-center">
                              <span className="font-bios text-lg md:text-xl text-white tracking-widest truncate">SLUS-{pic.id}</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : null
                    ))}
                  </AnimatePresence>
                </div>
              </main>

              {/* FOOTER CONTROLS */}
              <footer className="fixed bottom-0 w-full bg-[#111] border-t-2 border-white/20 p-2 flex justify-center text-center text-gray-400 font-bios text-sm md:text-xl z-30">
               <div>Done4.co // Curated by @GoodBye World 2026</div>
              </footer>

            </motion.div>
          )}

          {/* LIGHTBOX MODAL */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={() => setSelectedImage(null)}
              >
                
                <motion.div
                  layoutId={`card-${selectedImage.id}`}
                  className="relative w-[95%] max-w-6xl max-h-[85vh] border-2 md:border-4 border-white/20 bg-black shadow-[0_0_50px_rgba(255,255,255,0.1)] flex flex-col"
                  onClick={(e) => e.stopPropagation()} 
                >
                  {/* Mobile Close Button */}
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-10 right-0 p-2 text-white bg-white/10 rounded-full md:hidden"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="flex-1 overflow-hidden relative">
                     <img src={selectedImage.image_url} className="w-full h-full object-contain bg-[#050505]" />
                  </div>
                  
                  <div className="bg-[#111] p-3 md:p-4 border-t-2 border-white/20 flex justify-between items-center font-bios text-lg md:text-2xl text-white shrink-0">
                    <span className="truncate mr-4">VIEWING: {selectedImage.id}</span>
                    <button onClick={() => setSelectedImage(null)}>
                        <X className="w-6 h-6 md:w-8 md:h-8 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </div>
  );
}