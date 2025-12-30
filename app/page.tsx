"use client";

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Radio } from 'lucide-react';

// --- CONFIGURATION ---
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTiUD07fPcFA9zPES-HKKCs-BC8GZ223iKxzr2bJeLX_YX6cS5YpKD8Y97oPv-NZpCxZUrsXdo8pWyV/pub?gid=0&single=true&output=csv';

type ArchiveImage = {
  id: string;
  image_url: string;
};

// --- SILENT HILL UTILS ---
// A "twitchy" animation variant for text
const glitchVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 10,
      repeat: Infinity,
      repeatType: "reverse" as const,
      repeatDelay: 2 + Math.random() * 5, // Random twitching
      duration: 0.1
    }
  }
};

export default function Home() {
  const [pictures, setPictures] = useState<ArchiveImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ArchiveImage | null>(null);

  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            setPictures(results.data as ArchiveImage[]);
            setLoading(false);
          },
        });
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d4] font-mono relative overflow-x-hidden selection:bg-red-900 selection:text-white">
      
      {/* --- ATMOSPHERE LAYERS --- */}
      
      {/* 1. CSS Injection for Fonts & Grain */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        .font-sh { font-family: 'Special Elite', monospace; }
        
        .noise-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 50;
          opacity: 0.08;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          filter: contrast(170%) brightness(100%);
        }

        .fog-layer {
          position: fixed;
          top: 0; left: 0; width: 200%; height: 100%;
          background: linear-gradient(to right, transparent 0%, rgba(200,200,200,0.05) 50%, transparent 100%);
          z-index: 10;
          pointer-events: none;
          animation: drift 60s linear infinite;
        }

        @keyframes drift {
          from { transform: translateX(-50%); }
          to { transform: translateX(0%); }
        }
      `}</style>

      {/* 2. Visual Overlays */}
      <div className="noise-overlay" />
      <div className="fog-layer" />
      
      {/* Vignette (Dark Corners) */}
      <div className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-between items-end px-6 md:px-12 py-8 border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="flex flex-col">
          <motion.div 
            animate={{ opacity: [1, 0.5, 1, 1, 0.8, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex items-center gap-2 text-red-700 mb-1"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase">No Signal</span>
          </motion.div>
          <h1 className="font-sh text-2xl md:text-4xl text-white tracking-widest uppercase">
            Damian's <span className="text-red-800">Archive</span>
          </h1>
        </div>
        <div className="hidden md:block text-right">
          <p className="font-sh text-xs text-gray-500">LOC: TOLUCA LAKE</p>
          <p className="font-sh text-xs text-red-900/60">STATUS: UNSTABLE</p>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="pt-40 md:pt-48 px-4 md:px-12 pb-32 max-w-1920px mx-auto relative z-30">
        
        {/* Loading State */}
        {loading && (
          <div className="h-[40vh] flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin w-12 h-12 text-red-900" />
            <p className="font-sh text-sm tracking-widest text-red-800/80 animate-pulse">
              LOADING PSYCHOLOGICAL DATA...
            </p>
          </div>
        )}

        {/* The Grid */}
        {!loading && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            <AnimatePresence>
              {pictures.map((pic, i) => (
                pic.image_url ? (
                  <motion.div
                    layoutId={`card-${pic.id}`}
                    key={pic.id}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="group relative break-inside-avoid mb-6 cursor-pointer bg-[#050505] p-2 border border-white/5 hover:border-red-900/50 transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                    onClick={() => setSelectedImage(pic)}
                  >
                    {/* The "Polaroid/File" Container */}
                    <div className="relative overflow-hidden bg-black">
                      
                      {/* Image - Desaturated by default, Color on Hover */}
                      <motion.img 
                        layoutId={`img-${pic.id}`}
                        src={pic.image_url} 
                        alt={pic.id}
                        className="w-full h-auto object-cover opacity-80 grayscale contrast-[1.2] brightness-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-500 ease-out"
                      />

                      {/* "Rust" Overlay on Hover */}
                      <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-3 flex justify-between items-center px-1">
                      <span className="font-sh text-xs text-gray-600 group-hover:text-red-500 transition-colors">
                        FIG. {pic.id}
                      </span>
                      <div className="h-1px grow bg-gray-800 mx-2 group-hover:bg-red-900/30 transition-colors" />
                      <span className="font-sh text-[10px] text-gray-700">
                        [RESTRICTED]
                      </span>
                    </div>
                  </motion.div>
                ) : null
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* --- MODAL (THE "SAVE ROOM") --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            {/* Red "Save Point" Square in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="w-[50vw] h-[50vw] bg-red-600 blur-[150px] rounded-full" />
            </div>

            <button className="absolute top-6 right-6 text-red-800 hover:text-red-500 transition-colors z-50">
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <motion.div
              layoutId={`card-${selectedImage.id}`}
              className="relative max-w-5xl max-h-[85vh] w-full overflow-hidden border-2 border-red-900/20 bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,0,0,0.1)]"
              onClick={(e) => e.stopPropagation()} 
            >
              <motion.img
                layoutId={`img-${selectedImage.id}`}
                src={selectedImage.image_url}
                alt={selectedImage.id}
                className="w-full h-full max-h-[80vh] object-contain bg-black"
              />
              
              <div className="p-6 border-t border-red-900/20 bg-black/80 backdrop-blur-xl flex justify-between items-end">
                <div>
                    <h3 className="font-sh text-3xl text-red-600 mb-1">RECORD #{selectedImage.id}</h3>
                    <p className="font-sh text-xs text-gray-500 tracking-widest">THERE WAS A HOLE HERE. IT'S GONE NOW.</p>
                </div>
                <div className="hidden md:block">
                     <div className="w-16 h-16 border border-red-900/30 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-red-600 rounded-full animate-ping" />
                     </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}